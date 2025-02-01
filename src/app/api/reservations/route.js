import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

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
      where : whereClause,
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

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return new Response(
        JSON.stringify({
          message: "If the email exists, reservation details will be sent.",
        }),
        { status: 200 }
      );
    }
    // Create a new reservation (assuming you're using Prisma or any ORM)
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        status,
        totalPrice,
        reservationItems: {
          create: reservationItems.map((item) => ({
            serviceId: item.serviceId,
            price: item.price,
            startTime: new Date(item.startTime), // Ensure it's a valid Date object
            endTime: new Date(item.endTime), // Ensure it's a valid Date object
          })),
        },
      },
    });

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
    ${reservationItems
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
      subject: "Reservation Confirmation",
      text: `Thank you for your reservation! Here are your details:\n\n${reservationDetails}\n\nIf you have any questions, feel free to contact us.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return new Response(
        JSON.stringify({
          message: "Reservation details sent to email successfully.",
        }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ error: "Failed to send email." }), {
        status: 500,
      });
    }

    // Respond with the created reservation
    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
