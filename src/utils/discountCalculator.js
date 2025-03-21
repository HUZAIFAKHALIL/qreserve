/**
 * Calculate the final price after applying discounts
 * @param {number} originalPrice - The original price
 * @param {object} discounts - Object containing discount information
 * @returns {object} - Object with finalPrice and appliedDiscounts
 */
export function calculateDiscountedPrice(originalPrice, discounts) {
    let finalPrice = originalPrice;
    const appliedDiscounts = [];
    
    // Apply signup discount if available and not used
    if (discounts.signupDiscount && !discounts.signupDiscount.isUsed) {
      const discount = discounts.signupDiscount;
      let discountAmount = 0;
      
      if (discount.discountType === 'PERCENTAGE') {
        discountAmount = originalPrice * (discount.discount / 100);
      } else {
        discountAmount = discount.discount;
      }
      
      finalPrice -= discountAmount;
      appliedDiscounts.push({
        type: 'SIGNUP',
        amount: discountAmount,
        description: 'New user discount'
      });
    }
    
    // Apply loyalty discount if available
    if (discounts.loyaltyDiscount) {
      const discount = discounts.loyaltyDiscount;
      let discountAmount = 0;
      
      if (discount.discountType === 'PERCENTAGE') {
        discountAmount = originalPrice * (discount.discount / 100);
      } else {
        discountAmount = discount.discount;
      }
      
      finalPrice -= discountAmount;
      appliedDiscounts.push({
        type: 'LOYALTY',
        amount: discountAmount,
        description: 'Loyalty discount'
      });
    }
    
    // Apply promotion if available
    if (discounts.promotion) {
      const discount = discounts.promotion;
      let discountAmount = 0;
      
      if (discount.discountType === 'PERCENTAGE') {
        discountAmount = originalPrice * (discount.discount / 100);
      } else {
        discountAmount = discount.discount;
      }
      
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