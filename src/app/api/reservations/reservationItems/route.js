// app/api/reservations/[reservationId]/items/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ispublic = searchParams.get('ispublic');
  const whereClause = {};
  if (ispublic) {
    whereClause.isPublic = true
  }
  try {
    const reservationItems = await prisma.reservationItem.findMany({
      where: whereClause,
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
