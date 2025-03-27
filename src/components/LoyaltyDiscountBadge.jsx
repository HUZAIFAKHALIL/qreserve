import React, { useState, useEffect } from 'react';
import { Percent, Crown } from 'lucide-react';

const LoyaltyDiscountBadge = () => {
  const [discountData, setDiscountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyDiscount = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('User ID not found in localStorage');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/loyalty-discount?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch loyalty discount');
        }
        
        const data = await response.json();
        setDiscountData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching loyalty discount:', error);
        setIsLoading(false);
      }
    };

    fetchLoyaltyDiscount();
  }, []);

  if (
    isLoading || 
    !discountData?.currentDiscount?.discount || 
    discountData.currentDiscount.isUsed
  ) return null;

  return (
    <div className="relative group">
      <div 
        className="
          flex items-center gap-1 px-2.5 py-1 
          bg-gradient-to-r from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          text-white rounded-full 
          shadow-sm hover:shadow-md
          transform hover:scale-105
          transition-all duration-200 ease-in-out
          cursor-pointer
        "
      >
        {discountData.currentDiscount.discount >= 20 ? (
          <Crown className="w-3.5 h-3.5 text-yellow-300" />
        ) : (
          <Percent className="w-3.5 h-3.5" />
        )}
        <span className="text-xs font-semibold tracking-wide">
          {discountData.currentDiscount.discount}%
        </span>
      </div>

      {/* Enhanced Tooltip */}
      <div 
        className="
          absolute z-50 -bottom-24 left-1/2 transform -translate-x-1/2
          min-w-[200px] p-3
          bg-white rounded-lg shadow-xl
          border border-gray-100
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200 ease-in-out
          text-sm
        "
      >
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2
          border-8 border-transparent border-b-white" />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-gray-700">
            <span>Current Discount</span>
            <span className="font-semibold text-blue-600">
              {discountData.currentDiscount.discount}%
            </span>
          </div>
          
          {discountData.nextTier && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500">Next Tier</div>
              <div className="flex items-center justify-between text-gray-700">
                <span>Spend ${discountData.nextTier.threshold}</span>
                <span className="font-semibold text-green-600">
                  {discountData.nextTier.discount}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDiscountBadge;