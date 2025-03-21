import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Get userId from query params or auth token
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get('userId'));
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400 }
      );
    }
    
    // Get user's signup discount
    const signupDiscount = await prisma.signupDiscount.findUnique({
      where: { userId }
    });
    
    // Get user's loyalty discount
    const loyaltyDiscount = await prisma.loyaltyDiscount.findUnique({
      where: { userId }
    });
    
    // Get active promotions
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      }
    });
    
    return new Response(
      JSON.stringify({ signupDiscount, loyaltyDiscount, promotions }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user discounts:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user discounts" }),
      { status: 500 }
    );
  }
}