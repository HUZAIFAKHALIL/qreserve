import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function PUT(req) {
  const { token, newPassword } = await req.json();

  // Find user by token and check expiry
  const user = await prisma.user.findFirst({
    where: { token: token, tokenExpiry: { gte: new Date() } },
  });

  if (!user) {
    return new Response(
      JSON.stringify({ error: "Invalid or expired token." }),
      { status: 400 }
    );
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user's password and clear the token
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, token: null, tokenExpiry: null },
  });

  return new Response(
    JSON.stringify({ message: "Password reset successful." }),
    { status: 200 }
  );
}
