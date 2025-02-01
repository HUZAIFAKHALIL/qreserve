import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req) {
  const { identifier } = await req.json();

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

  // Check if the user exists
  // const user = await prisma.user.findUnique({ where: { email } });
  // if (!user) {
  //   return new Response(
  //     JSON.stringify({
  //       message: "If the email exists, a reset link will be sent.",
  //     }),
  //     { status: 200 }
  //   );
  // }

  // Generate token and expiry
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

  // Save token and expiry in the database
  await prisma.user.update({
    where: { email: user.email },
    data: { token, tokenExpiry },
  });

  // Send reset email
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "no-reply@qreserve.com",
    to: user.email,
    subject: "Password Reset",
    text: `Click the link to reset your password: ${resetUrl}. This link will expire in 60 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({ message: "Reset link sent successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email." }), {
      status: 500,
    });
  }
}
