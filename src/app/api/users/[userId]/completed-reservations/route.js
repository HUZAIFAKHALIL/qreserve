// Path: G:/react/sarmadWork/qreverse/src/app/api/users/[userId]/completed-reservations/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const completedReservations = await prisma.completedReservation.findMany({
      where: { userId: parseInt(userId) },
      include: {
        reservation: {
          include: {
            service: true,
          },
        },
        user: true,
      },
    });

    return NextResponse.json({ completedReservations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching completed reservations:", error);
    return NextResponse.json({ error: "Failed to fetch completed reservations" }, { status: 500 });
  }
}