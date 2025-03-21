// utils/loyaltyManager.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkAndUpdateLoyaltyStatus(userId) {
  try {
    // Count completed reservations for the user
    const reservationCount = await prisma.completedReservation.count({
      where: { userId }
    });
    
    // Loyalty tiers
    const loyaltyTiers = [
      { threshold: 5, discount: 5, type: 'PERCENTAGE' },
      { threshold: 10, discount: 10, type: 'PERCENTAGE' },
      { threshold: 20, discount: 15, type: 'PERCENTAGE' }
    ];
    
    // Find the highest tier the user qualifies for
    let appliedTier = null;
    for (const tier of loyaltyTiers) {
      if (reservationCount >= tier.threshold) {
        appliedTier = tier;
      } else {
        break;
      }
    }
    
    if (!appliedTier) return null;
    
    // Update or create loyalty discount
    const existingLoyalty = await prisma.loyaltyDiscount.findUnique({
      where: { userId }
    });
    
    if (existingLoyalty) {
      // Update if tier has changed
      if (existingLoyalty.discount !== appliedTier.discount) {
        return await prisma.loyaltyDiscount.update({
          where: { userId },
          data: {
            discount: appliedTier.discount,
            discountType: appliedTier.type === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED',
            threshold: appliedTier.threshold
          }
        });
      }
      return existingLoyalty;
    } else {
      // Create new loyalty discount
      return await prisma.loyaltyDiscount.create({
        data: {
          userId,
          discount: appliedTier.discount,
          discountType: appliedTier.type === 'PERCENTAGE' ? 'PERCENTAGE' : 'FIXED',
          threshold: appliedTier.threshold
        }
      });
    }
  } catch (error) {
    console.error("Error updating loyalty status:", error);
    return null;
  }
}