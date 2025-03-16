// Path: G:/react/sarmadWork/qreverse/src/app/api/reviews/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId, serviceId, rating, comment } = await req.json();

    // Validate that this user has used this service (completed reservation)
    const completedReservation = await prisma.completedReservation.findFirst({
      where: {
        userId: parseInt(userId),
        reservation: {
          serviceId: parseInt(serviceId),
        },
      },
    });

    if (!completedReservation) {
      return NextResponse.json({ error: "You can only review services you have used" }, { status: 403 });
    }

    // Check if user has already reviewed this service
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: parseInt(userId),
        serviceId: parseInt(serviceId),
      },
    });

    let review;
    
    if (existingReview) {
      // Update existing review
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: parseFloat(rating),
          comment,
        },
      });
    } else {
      // Create new review
      review = await prisma.review.create({
        data: {
          userId: parseInt(userId),
          serviceId: parseInt(serviceId),
          rating: parseFloat(rating),
          comment,
        },
      });
    }

    // Update service average rating
    const allServiceReviews = await prisma.review.findMany({
      where: {
        serviceId: parseInt(serviceId),
      },
    });

    const averageRating = allServiceReviews.reduce((sum, review) => sum + review.rating, 0) / allServiceReviews.length;

    await prisma.service.update({
      where: { id: parseInt(serviceId) },
      data: {
        rating: averageRating,
      },
    });

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}