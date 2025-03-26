import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function calculateDiscountedPrice(originalPrice, discounts) {
  let finalPrice = originalPrice;
  const appliedDiscounts = [];

  // Apply signup discount first
  if (discounts.signupDiscount && !discounts.signupDiscount.isUsed) {
    const discount = discounts.signupDiscount;
    const discountAmount = discount.discountType === 'PERCENTAGE'
      ? originalPrice * (discount.discount / 100)
      : discount.discount;

    finalPrice -= discountAmount;
    appliedDiscounts.push({
      type: 'SIGNUP',
      amount: discountAmount,
      description: 'New user signup discount'
    });
  }

  // Apply loyalty discount
  if (discounts.loyaltyDiscount && !discounts.loyaltyDiscount.isUsed) {
    const discount = discounts.loyaltyDiscount;
    const discountAmount = discount.discountType === 'PERCENTAGE'
      ? originalPrice * (discount.discount / 100)
      : discount.discount;

    finalPrice -= discountAmount;
    appliedDiscounts.push({
      type: 'LOYALTY',
      amount: discountAmount,
      description: `Loyalty discount (${discount.discount}%)`
    });
  }

  // Apply promotion if available
  if (discounts.promotion) {
    const discount = discounts.promotion;
    const discountAmount = discount.discountType === 'PERCENTAGE'
      ? originalPrice * (discount.discount / 100)
      : discount.discount;

    finalPrice -= discountAmount;
    appliedDiscounts.push({
      type: 'PROMOTION',
      amount: discountAmount,
      description: discount.title
    });
  }

  // Ensure price doesn't go below zero
  finalPrice = Math.max(0, finalPrice);

  return {
    originalPrice,
    finalPrice,
    totalDiscount: originalPrice - finalPrice,
    appliedDiscounts
  };
}

export async function markDiscountsAsUsed(userId, appliedDiscounts) {
  try {
    const discountTypes = appliedDiscounts.map(discount => discount.type);

    if (discountTypes.includes('SIGNUP')) {
      await prisma.signupDiscount.update({
        where: { userId },
        data: { isUsed: true }
      });
    }

    if (discountTypes.includes('LOYALTY')) {
      await prisma.loyaltyDiscount.update({
        where: { userId },
        data: { isUsed: true }
      });
    }
  } catch (error) {
    console.error("Error marking discounts as used:", error);
  }
}