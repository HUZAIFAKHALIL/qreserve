// app/api/discounts/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user discounts
    const signupDiscount = await prisma.signupDiscount.findUnique({
      where: { userId: parseInt(userId) }
    });

    let loyaltyDiscount = await prisma.loyaltyDiscount.findUnique({
      where: { userId: parseInt(userId) }
    });

    // Check if user is eligible for loyalty discount
    const completedReservations = await prisma.completedReservation.count({
      where: {
        userId: parseInt(userId)
      }
    });

    // Define loyalty tiers
    const loyaltyTiers = [
      { threshold: 5, discount: 5, type: "PERCENTAGE" },
      { threshold: 10, discount: 10, type: "PERCENTAGE" },
      { threshold: 20, discount: 15, type: "PERCENTAGE" }
    ];

    // Find the highest tier the user qualifies for
    let eligibleTier = null;
    for (const tier of loyaltyTiers) {
      if (completedReservations >= tier.threshold) {
        eligibleTier = tier;
      } else {
        break;
      }
    }

    // If user qualifies for a higher tier than current, update
    if (eligibleTier && (!loyaltyDiscount || loyaltyDiscount.threshold < eligibleTier.threshold)) {
      if (loyaltyDiscount) {
        // Update existing loyalty discount
        await prisma.loyaltyDiscount.update({
          where: { userId: parseInt(userId) },
          data: {
            discount: eligibleTier.discount,
            discountType: eligibleTier.type,
            threshold: eligibleTier.threshold
          }
        });
      } else {
        // Create new loyalty discount
        await prisma.loyaltyDiscount.create({
          data: {
            userId: parseInt(userId),
            discount: eligibleTier.discount,
            discountType: eligibleTier.type,
            threshold: eligibleTier.threshold
          }
        });
      }

      // Refetch loyalty discount after update
      loyaltyDiscount = await prisma.loyaltyDiscount.findUnique({
        where: { userId: parseInt(userId) }
      });
    }

    return NextResponse.json({
      signupDiscount,
      loyaltyDiscount,
      completedReservations,
      nextTier: loyaltyTiers.find(tier => tier.threshold > completedReservations)
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user discounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, discountType, discount, threshold } = body;

    if (!userId || !discountType || discount === undefined || discount === null) {
      return NextResponse.json(
        { error: "User ID, discount type, and discount amount are required" },
        { status: 400 }
      );
    }

    // Check if creating a signup or loyalty discount
    if (discountType === "signup") {
      // Check if user already has a signup discount
      const existingDiscount = await prisma.signupDiscount.findUnique({
        where: { userId: parseInt(userId) }
      });

      if (existingDiscount) {
        return NextResponse.json(
          { error: "User already has a signup discount" },
          { status: 400 }
        );
      }

      // Create signup discount
      const signupDiscount = await prisma.signupDiscount.create({
        data: {
          userId: parseInt(userId),
          discount: parseFloat(discount),
          discountType: "PERCENTAGE", // or "FIXED"
          isUsed: false
        }
      });

      return NextResponse.json({
        message: "Signup discount created successfully",
        discount: signupDiscount
      }, { status: 201 });
    } else if (discountType === "loyalty") {
      // Check if user already has a loyalty discount
      const existingDiscount = await prisma.loyaltyDiscount.findUnique({
        where: { userId: parseInt(userId) }
      });

      if (existingDiscount) {
        // Update existing loyalty discount
        const loyaltyDiscount = await prisma.loyaltyDiscount.update({
          where: { userId: parseInt(userId) },
          data: {
            discount: parseFloat(discount),
            discountType: "PERCENTAGE", // or "FIXED"
            threshold: threshold || existingDiscount.threshold
          }
        });

        return NextResponse.json({
          message: "Loyalty discount updated successfully",
          discount: loyaltyDiscount
        }, { status: 200 });
      } else {
        // Create new loyalty discount
        const loyaltyDiscount = await prisma.loyaltyDiscount.create({
          data: {
            userId: parseInt(userId),
            discount: parseFloat(discount),
            discountType: "PERCENTAGE", // or "FIXED"
            threshold: threshold || 0
          }
        });

        return NextResponse.json({
          message: "Loyalty discount created successfully",
          discount: loyaltyDiscount
        }, { status: 201 });
      }
    } else {
      return NextResponse.json(
        { error: "Invalid discount type" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error managing user discounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}