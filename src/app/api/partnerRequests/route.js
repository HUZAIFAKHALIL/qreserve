import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();


export async function POST(request) {
    try {
      const body = await request.json();
      const { reservationItemID, requestUser, status, filter } = body;
  
      if (!reservationItemID || !requestUser || !status) {
        return new Response(
          JSON.stringify({ message: "reservationItemID, requestUser, and status are required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      const newPartnerRequest = await prisma.partnerRequest.create({
        data: {
          reservationItem: {
            connect: { id: reservationItemID }, // Connect to existing ReservationItem
          },
          requester : {
            connect : {id:requestUser}
          },
          status,
          filter: filter || {}, // Ensure default empty object
        },
      });
  
      return new Response(
        JSON.stringify({ message: "Partner Request created successfully", partnerRequest: newPartnerRequest }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error creating partner request:", error);
      return new Response(
        JSON.stringify({ message: "Error creating partner request", error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  







