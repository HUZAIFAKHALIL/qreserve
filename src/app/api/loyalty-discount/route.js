// src\app\api\loyalty-discount\route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getLoyaltyDiscountDetails } from '@/utils/loyaltyDiscountManager';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        message: 'User ID is required' 
      }, { status: 400 });
    }

    // Get total completed reservations
    const completedReservations = await prisma.reservation.count({
      where: {
        userId: parseInt(userId),
        status: 'confirmed'
      }
    });

    // Get loyalty discount details
    const loyaltyDiscountDetails = await getLoyaltyDiscountDetails(parseInt(userId));

    return NextResponse.json({
      currentDiscount: {
        discount: loyaltyDiscountDetails.currentDiscount,
        discountType: 'PERCENTAGE',
        totalSpent: loyaltyDiscountDetails.totalSpent,
        isUsed: loyaltyDiscountDetails.isUsed
      },
      completedReservations,
      nextTier: {
        threshold: loyaltyDiscountDetails.nextTierSpent,
        discount: Math.min(
          Math.floor(loyaltyDiscountDetails.totalSpent / 100) * 10, 
          25 // Max 25% discount
        )
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching loyalty discount:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}