import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function POST(req) {
  const { identifier, password } = await req.json();

  if (!identifier || !password) {
    return new Response(
      JSON.stringify({ error: "Identifier and password are required" }),
      { status: 400 }
    );
  }

  try {
    console.log("Data received at back:", identifier, password);

    // Find user by email or phone with related discount information
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
      include: {
        signupDiscount: true,
        loyaltyDiscount: true,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Format discount information for the frontend
    const discountInfo = {
      hasSignupDiscount: user.signupDiscount && !user.signupDiscount.isUsed,
      signupDiscountAmount: user.signupDiscount ? user.signupDiscount.discount : 0,
      signupDiscountType: user.signupDiscount ? user.signupDiscount.discountType : null,
      hasLoyaltyDiscount: !!user.loyaltyDiscount,
      loyaltyDiscountAmount: user.loyaltyDiscount ? user.loyaltyDiscount.discount : 0,
      loyaltyDiscountType: user.loyaltyDiscount ? user.loyaltyDiscount.discountType : null,
      loyaltyThreshold: user.loyaltyDiscount ? user.loyaltyDiscount.threshold : 0
    };

    // Send response with token and discount information
    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        userEmail: user.email,
        userId: user.id,
        userName: user.name,
        userRole: user.role || 'BUYER',
        discountInfo
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}