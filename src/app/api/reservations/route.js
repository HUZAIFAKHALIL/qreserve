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
      where: whereClause,
      include: {
        reservationItems: true, // Optionally include reservation items
        user: true, // Optionally include user information
        appliedPromotion: true, // Include promotion information
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
    const { status, userId, totalPrice, reservationItems, promotionId } = body;

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

    // Calculate the original total price based on the sum of all reservation items
    let originalTotalPrice = reservationItems.reduce((sum, item) => sum + item.price, 0);
    let finalTotalPrice = originalTotalPrice;
    let appliedDiscountAmount = 0;
    let appliedPromotionDetails = null;
    let appliedPromotionId = null;

    // Check if a promotion code was provided
    if (promotionId) {
      const promotion = await prisma.promotion.findUnique({
        where: { id: parseInt(promotionId) },
      });
      
      if (promotion && promotion.isActive && 
          (!promotion.startDate || new Date(promotion.startDate) <= new Date()) &&
          (!promotion.endDate || new Date(promotion.endDate) >= new Date())) {
        
        // Apply promotion discount
        if (promotion.discountType === "PERCENTAGE") {
          appliedDiscountAmount = originalTotalPrice * (promotion.discount / 100);
        } else { // FIXED discount
          appliedDiscountAmount = promotion.discount;
        }
        
        finalTotalPrice = Math.max(0, originalTotalPrice - appliedDiscountAmount);
        appliedPromotionId = promotion.id;
        appliedPromotionDetails = promotion;
      }
    } else {
      // Check for signup discount if no promotion code was provided
      const signupDiscount = await prisma.signupDiscount.findUnique({
        where: { userId: userId, isUsed: false },
      });
      
      if (signupDiscount) {
        // Apply signup discount
        if (signupDiscount.discountType === "PERCENTAGE") {
          appliedDiscountAmount = originalTotalPrice * (signupDiscount.discount / 100);
        } else { // FIXED discount
          appliedDiscountAmount = signupDiscount.discount;
        }
        
        finalTotalPrice = Math.max(0, originalTotalPrice - appliedDiscountAmount);
        
        // Mark signup discount as used (in a later transaction)
        await prisma.signupDiscount.update({
          where: { id: signupDiscount.id },
          data: { isUsed: true },
        });
      } else {
        // Check for loyalty discount
        const loyaltyDiscount = await prisma.loyaltyDiscount.findUnique({
          where: { userId: userId },
        });
        
        if (loyaltyDiscount) {
          // Apply loyalty discount
          if (loyaltyDiscount.discountType === "PERCENTAGE") {
            appliedDiscountAmount = originalTotalPrice * (loyaltyDiscount.discount / 100);
          } else { // FIXED discount
            appliedDiscountAmount = loyaltyDiscount.discount;
          }
          
          finalTotalPrice = Math.max(0, originalTotalPrice - appliedDiscountAmount);
        }
      }
    }

    // Create a new reservation with the applied discount
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        status,
        totalPrice: finalTotalPrice,
        appliedPromotionId,
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
        appliedPromotion: true,
      },
    });

    // Send email with reservation details including discount information
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Add discount information to the email
    const discountInfo = appliedDiscountAmount > 0 
      ? `
      Discount Applied: ${appliedDiscountAmount.toFixed(2)}
      Original Price: $${originalTotalPrice.toFixed(2)}
      Final Price: $${finalTotalPrice.toFixed(2)}
      `
      : '';

    const reservationDetails = `
    Reservation ID: ${reservation.id}
    User ID: ${reservation.userId}
    Total Price: $${reservation.totalPrice.toFixed(2)}
    ${discountInfo}
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

    // Respond with the created reservation and discount information
    return NextResponse.json({ 
      reservation,
      discountApplied: appliedDiscountAmount > 0,
      originalPrice: originalTotalPrice,
      discountAmount: appliedDiscountAmount,
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