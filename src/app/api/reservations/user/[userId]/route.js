import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all reservations for a specific user
export async function GET(req, { params }) {
  const { userId } = params;
  try {
    // Fetch all reservations from the database for the specified user
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: parseInt(userId), // Fetch only reservations belonging to this user
      },
      include: {
        reservationItems: true, // Optionally include reservation items
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
