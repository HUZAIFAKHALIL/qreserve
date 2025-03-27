import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function updateLoyaltyDiscount(userId, reservationAmount) {
  try {
    // Find or create loyalty discount record
    let loyaltyDiscount = await prisma.loyaltyDiscount.findUnique({
      where: { userId }
    });

    if (!loyaltyDiscount) {
      // If no existing loyalty discount, create a new one
      loyaltyDiscount = await prisma.loyaltyDiscount.create({
        data: {
          userId,
          totalSpent: reservationAmount,
          discount: calculateDiscount(reservationAmount),
          nextTierSpent: calculateNextTierThreshold(reservationAmount),
          isUsed: false  // Explicitly set isUsed to false
        }
      });
    } else {
      // If the current discount was used, reset total spent and recalculate
      if (loyaltyDiscount.isUsed) {
        const newTotalSpent = reservationAmount;
        const newDiscount = calculateDiscount(newTotalSpent);
        
        loyaltyDiscount = await prisma.loyaltyDiscount.update({
          where: { userId },
          data: {
            totalSpent: newTotalSpent,
            discount: newDiscount,
            nextTierSpent: calculateNextTierThreshold(newTotalSpent),
            isUsed: false  // Reset isUsed to false
          }
        });
      } else {
        // Update total spent normally
        const newTotalSpent = loyaltyDiscount.totalSpent + reservationAmount;
        const newDiscount = calculateDiscount(newTotalSpent);
        
        loyaltyDiscount = await prisma.loyaltyDiscount.update({
          where: { userId },
          data: {
            totalSpent: newTotalSpent,
            discount: newDiscount,
            nextTierSpent: calculateNextTierThreshold(newTotalSpent)
          }
        });
      }
    }

    return loyaltyDiscount;
  } catch (error) {
    console.error('Error updating loyalty discount:', error);
    throw error;
  }
}

function calculateDiscount(totalSpent) {
  // 10% discount for every 100 QAR spent, max 25%
  const discount = Math.floor(totalSpent / 100) * 10;
  return Math.min(discount, 25); // Cap at 25%
}

function calculateNextTierThreshold(totalSpent) {
  // Calculate the next tier threshold
  return Math.ceil((totalSpent + 1) / 100) * 100;
}

export async function getLoyaltyDiscountDetails(userId) {
  try {
    const loyaltyDiscount = await prisma.loyaltyDiscount.findUnique({
      where: { userId }
    });

    if (!loyaltyDiscount) {
      return {
        totalSpent: 0,
        currentDiscount: 0,
        nextTierSpent: 100,
        isUsed: false
      };
    }

    return {
      totalSpent: loyaltyDiscount.totalSpent,
      currentDiscount: loyaltyDiscount.discount,
      nextTierSpent: loyaltyDiscount.nextTierSpent,
      isUsed: loyaltyDiscount.isUsed
    };
  } catch (error) {
    console.error('Error fetching loyalty discount details:', error);
    throw error;
  }
}