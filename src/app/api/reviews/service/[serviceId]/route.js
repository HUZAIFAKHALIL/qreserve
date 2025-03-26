import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { serviceId } = params;

  try {
    // First, check if the service exists
    const service = await prisma.service.findUnique({
      where: {
        id: parseInt(serviceId)
      }
    });

    // If service doesn't exist, return a 404
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Check if there are any reviews for this service
    const reviewCount = await prisma.review.count({
      where: {
        serviceId: parseInt(serviceId)
      }
    });

    // If no reviews exist, return an empty array with a message
    if (reviewCount === 0) {
      return NextResponse.json({ 
        reviews: [], 
        message: "No reviews available for this service yet" 
      }, { status: 200 });
    }

    // If reviews exist, fetch them
    const reviews = await prisma.review.findMany({
      where: {
        serviceId: parseInt(serviceId),
      },
      orderBy: {
        createdAt: 'desc',
      },
      // Assuming you want to select specific user fields
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json({ 
      reviews: reviews, 
      message: "Reviews retrieved successfully" 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}