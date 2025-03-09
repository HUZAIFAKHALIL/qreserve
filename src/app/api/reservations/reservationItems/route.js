// app/api/reservations/[reservationId]/items/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ispublic = searchParams.get("ispublic");
  const currentUserId = searchParams.get("userId"); // Get current user ID from request
  const includeClause = {};
  const whereClause = {};

  try {
    console.log("currentUserID",currentUserId)
      // Fetch current user details
      if(ispublic && currentUserId){
      const currentUser = await prisma.user.findUnique({
          where: { id: parseInt(currentUserId) },
          select: { gender: true }, // Only fetch the gender
      });

      if (!currentUser) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
          includeClause.PartnerRequest = true;
          whereClause.PartnerRequest = {
              some: {
                  OR: [
                      { filter: { equals: {} } }, // No filter applied
                      { filter: { path: ['gender'], equals: currentUser.gender } } // Gender matches
                  ]
              }
          };
      }

      const reservationItems = await prisma.reservationItem.findMany({
          where: whereClause,
          include: {
              ...includeClause,
              reservation: {
                  include: {
                      user: true, // Fetch the user who made the reservation
                  },
              },
              service: true, // Fetch the service details
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

  
