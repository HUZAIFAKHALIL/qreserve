// app/api/auth/signup/route.js
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, phone, dob, gender, password, userRole } = await req.json();
    
    console.log("DATA received at backend from frontend is : ", name, email, phone, dob, gender, password, userRole);
    
    // Validate required fields
    if (!name || !email || !phone || !dob || !gender || !password || !userRole) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }

    // Use a transaction to ensure both user and discount are created or nothing happens
    const result = await prisma.$transaction(async (tx) => {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create the user
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          dob: new Date(dob),
          gender,
          password: hashedPassword,
          role: userRole
        },
      });
      
      // Create signup discount for BUYER role
      if (userRole === "BUYER") {
        await tx.signupDiscount.create({
          data: {
            userId: user.id,
            discount: 10, // 10% discount for first-time users
            discountType: "PERCENTAGE",
            isUsed: false
          }
        });
      }
      
      return user;
    });
    
    return new Response(
      JSON.stringify({
        message: "User created successfully",
        userId: result.id,
        hasSignupDiscount: result.role === "BUYER"
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user creation:", error);
    
    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({ error: "Email already exists. Please use another email." }),
        { status: 409 }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500 }
    );
  }
}