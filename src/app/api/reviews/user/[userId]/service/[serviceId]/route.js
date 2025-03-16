// Path: G:/react/sarmadWork/qreverse/src/app/api/reviews/user/[userId]/service/[serviceId]/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { userId, serviceId } = params;

  try {
    const review = await prisma.review.findFirst({
      where: {
        userId: parseInt(userId),
        serviceId: parseInt(serviceId),
      },
    });

    if (!review) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json({ error: "Failed to fetch review" }, { status: 500 });
  }
}