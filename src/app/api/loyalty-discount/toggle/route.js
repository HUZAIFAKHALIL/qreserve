// src\app\api\loyalty-discount\toggle\route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { userId, useDiscount } = await request.json();

    if (!userId) {
      return NextResponse.json({ 
        message: 'User ID is required' 
      }, { status: 400 });
    }

    const loyaltyDiscount = await prisma.loyaltyDiscount.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!loyaltyDiscount) {
      return NextResponse.json({ 
        message: 'No loyalty discount found for this user' 
      }, { status: 404 });
    }

    // Only allow toggling if a discount is available
    if (loyaltyDiscount.discount > 0) {
      const updatedDiscount = await prisma.loyaltyDiscount.update({
        where: { userId: parseInt(userId) },
        data: { 
          isUsed: useDiscount 
        }
      });

      return NextResponse.json({ 
        message: 'Loyalty discount preference updated',
        result: updatedDiscount 
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        message: 'No loyalty discount available',
        result: loyaltyDiscount 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in loyalty discount toggle:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}