import bcrypt from "bcryptjs"; // For password hashing
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, phone, dob, gender, password,userRole } = await req.json();

    console.log(
      "DATA received at backend from frontend is : ",
      name,
      email,
      phone,
      dob,
      gender,
      password,
      userRole
    );
    // Validate required fields
    if (!name || !email || !phone || !dob || !gender || !password || !userRole) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        dob: new Date(dob), // Ensure dob is in correct Date format
        gender,
        password: hashedPassword,
        role:userRole
      },
    });

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error during user creation:", error);

    if (error.code === "P2002") {
      // Prisma's unique constraint violation code
      return new Response(
        JSON.stringify({
          error: "Email already exists. Please use another email.",
        }),
        { status: 409 }
      );
    }

    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      {
        status: 500,
      }
    );
  }
}
