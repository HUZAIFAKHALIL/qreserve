import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken"; // For generating JWT tokens
import { PrismaClient } from "@prisma/client"; // Prisma client

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Store JWT secret key securely

export async function POST(req) {
  const { identifier, password } = await req.json(); // Parse JSON body

  // Validate input
  if (!identifier || !password) {
    return new Response(
      JSON.stringify({ error: "Identifier and password are required" }),
      { status: 400 }
    );
  }

  try {
    // Log data for debugging (consider removing in production)
    console.log("Data received at back:", identifier, password);

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
      });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Send response with token
    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        userEmail: user.email,
        userId: user.id,
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
