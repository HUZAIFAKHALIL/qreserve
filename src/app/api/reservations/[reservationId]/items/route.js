// app/api/reservations/[reservationId]/items/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { reservationId } = params;

  try {
    const reservationItems = await prisma.reservationItem.findMany({
      where: {
        reservationId: parseInt(reservationId),
      },
    });

    return NextResponse.json(reservationItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching reservation items:", error);
    return NextResponse.json(
      { message: "Error fetching reservation items" },
      { status: 500 }
    );
  }
}
