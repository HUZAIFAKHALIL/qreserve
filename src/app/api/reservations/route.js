// src\app\api\reservations\route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { updateLoyaltyDiscount } from "@/utils/loyaltyDiscountManager";

const prisma = new PrismaClient();


async function checkReservationConflicts(reservationItems) {
  // Check each reservation item for conflicts
  for (const item of reservationItems) {
    const conflictingReservations = await prisma.reservationItem.findMany({
      where: {
        serviceId: item.serviceId,
        OR: [
          // Check if the new reservation overlaps with existing confirmed or completed reservations
          {
            reservation: {
              OR: [
                { status: 'CONFIRMED' },
                { status: 'COMPLETED' }
              ]
            },
            AND: [
              // Check for time overlap conditions
              {
                startTime: { lt: new Date(item.endTime) },
                endTime: { gt: new Date(item.startTime) }
              }
            ]
          }
        ]
      }
    });

    // If any conflicting reservations are found, return false
    if (conflictingReservations.length > 0) {
      return {
        hasConflict: true,
        conflictDetails: conflictingReservations
      };
    }
  }

  // No conflicts found
  return { hasConflict: false };
}


// GET all reservations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ispublic = searchParams.get('ispublic');
    const whereClause = {};
    if (ispublic) {
      whereClause.isPublic = true
    }
    // Fetch all reservations from the database
    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      include: {
        reservationItems: true, // Optionally include reservation items
        user: true, // Optionally include user information
      },
    });

    return NextResponse.json({ reservations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Parse the incoming request body
    const body = await request.json();

    // Extract the reservation details from the body
    const { status, userId, totalPrice, reservationItems } = body;

    // Here, you would typically validate the input data before proceeding
    if (!userId || !reservationItems || reservationItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }
    const conflictCheck = await checkReservationConflicts(reservationItems);
    
    // If conflicts exist, return conflict error
    if (conflictCheck.hasConflict) {
      return NextResponse.json(
        { 
          error: "Reservation conflicts exist", 
          conflictDetails: conflictCheck.conflictDetails 
        },
        { status: 409 } // Conflict status code
      );
    }

    
    await updateLoyaltyDiscount(userId, totalPrice);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return new Response(
        JSON.stringify({
          message: "If the email exists, reservation details will be sent.",
        }),
        { status: 200 }
      );
    }

    // Calculate the original total price based on the sum of all reservation items
    let originalTotalPrice = reservationItems.reduce((sum, item) => sum + item.price, 0);
    let finalTotalPrice = originalTotalPrice;

    // Create a new reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        status,
        totalPrice: finalTotalPrice,
        reservationItems: {
          create: reservationItems.map((item) => ({
            serviceId: item.serviceId,
            price: item.price,
            startTime: new Date(item.startTime),
            endTime: new Date(item.endTime),
            updatedAt: new Date(),
          })),
        },
      },
      include: {
        reservationItems: true,
      },
    });

    // Send email with reservation details
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const reservationDetails = `
    Reservation ID: ${reservation.id}
    User ID: ${reservation.userId}
    Total Price: $${reservation.totalPrice.toFixed(2)}
    Items: 
    ${reservation.reservationItems
      .map(
        (item, index) => `
      Item ${index + 1}:
        Service ID: ${item.serviceId}
        Price: $${item.price.toFixed(2)}
        Start Time: ${new Date(item.startTime).toLocaleString()}
        End Time: ${new Date(item.endTime).toLocaleString()}
      `
      )
      .join("")}
    `;

    const mailOptions = {
      from: "no-reply@qreserve.com",
      to: user.email,
      cc: "huzaifa.hado@gmail.com",
      subject: "Reservation Confirmation",
      text: `Thank you for your reservation! Here are your details:\n\n${reservationDetails}\n\nIf you have any questions, feel free to contact us.`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      // Continue with the response even if email fails
    }

    // Respond with the created reservation
    return NextResponse.json({ 
      reservation,
      originalPrice: originalTotalPrice,
      finalPrice: finalTotalPrice
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}