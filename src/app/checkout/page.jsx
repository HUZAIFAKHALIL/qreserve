"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateDiscountedPrice } from "@/utils/discountCalculator";


export default function Checkout() {
  const [reservations, setReservations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [discounts, setDiscounts] = useState(null);
  const [priceDetails, setPriceDetails] = useState({
    originalPrice: 0,
    finalPrice: 0,
    totalDiscount: 0,
    appliedDiscounts: []
  });
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promotions, setPromotions] = useState([]);
  
  const router = useRouter();
  
  // Fetch user discounts
  const fetchUserDiscounts = async (userId) => {
    try {
      const response = await fetch(`/api/discounts?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch discounts");
      }
      const data = await response.json();
      setDiscounts(data);
      return data;
    } catch (error) {
      console.error("Error fetching discounts:", error);
      return null;
    }
  };

  // Fetch available promotions
  const fetchPromotions = async () => {
    try {
      const response = await fetch("/api/promotions?activeOnly=true");
      if (!response.ok) {
        throw new Error("Failed to fetch promotions");
      }
      const data = await response.json();
      setPromotions(data.promotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const calculateDiscounts = (originalPrice, discountData, promotion = null) => {
    if (!discountData) return {
      originalPrice,
      finalPrice: originalPrice,
      totalDiscount: 0,
      appliedDiscounts: []
    };

    // Prepare discounts object for calculation
    const discountsToApply = {
      signupDiscount: discountData.signupDiscount,
      loyaltyDiscount: discountData.loyaltyDiscount,
      promotion: promotion
    };

    return calculateDiscountedPrice(originalPrice, discountsToApply);
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");
    
    if (!userEmail || !userId) {
      router.push("/login");
      return;
    }

    // Fetch discounts and promotions
    const fetchData = async () => {
      const discountData = await fetchUserDiscounts(userId);
      await fetchPromotions();

      const storedReservations = localStorage.getItem(userEmail);
      
      if (storedReservations) {
        const parsedReservations = JSON.parse(storedReservations);
        setReservations(parsedReservations);
        
        const originalTotal = parsedReservations.reduce(
          (acc, curr) => acc + (curr.totalPrice || curr.price),
          0
        );
        
        setTotalAmount(originalTotal);
        
        // Calculate discounted price
        if (discountData) {
          const priceInfo = calculateDiscounts(originalTotal, discountData);
          setPriceDetails(priceInfo);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  // Update price when promotion is selected
  useEffect(() => {
    if (discounts) {
      const newPriceDetails = calculateDiscounts(totalAmount, discounts, selectedPromotion);
      setPriceDetails(newPriceDetails);
    }
  }, [selectedPromotion, totalAmount, discounts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePromotionSelect = (promotion) => {
    setSelectedPromotion(promotion === selectedPromotion ? null : promotion);
  };

  const validateCard = () => {
    if (cardDetails.cardNumber.length !== 16) {
      setError("Card number must be 16 digits");
      return false;
    }
    if (cardDetails.cvv.length !== 3) {
      setError("CVV must be 3 digits");
      return false;
    }
    if (!cardDetails.cardholderName) {
      setError("Cardholder name is required");
      return false;
    }
    if (!cardDetails.expiryDate) {
      setError("Expiry date is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateCard()) {
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Process the reservations
      const userEmail = localStorage.getItem("userEmail");
      const userId = localStorage.getItem("userId");
      
      // Prepare the data for submission
      const requestData = {
        status: "confirmed",
        userId: parseInt(userId),
        totalPrice: priceDetails.finalPrice, // Use discounted price
        originalPrice: priceDetails.originalPrice,
        discountAmount: priceDetails.totalDiscount,
        paymentDetails: {
          cardholderName: cardDetails.cardholderName,
          last4: cardDetails.cardNumber.slice(-4),
        },
        reservationItems: reservations.map((item) => ({
          serviceId: parseInt(item.serviceId),
          price: item.totalPrice || item.price,
          startTime: new Date(item.startDate).toISOString(),
          endTime: new Date(item.endDate || item.startDate).toISOString(),
          quantity: item.quantity || 1,
          specificServiceId: item.specificService ? item.specificService.id : null
        })),
        appliedDiscounts: priceDetails.appliedDiscounts,
        appliedPromotionId: selectedPromotion ? selectedPromotion.id : null
      };

      console.log("Submitting reservation with data:", requestData);

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      // If signup discount was used, mark it as used
      if (discounts && discounts.signupDiscount && !discounts.signupDiscount.isUsed) {
        await fetch("/api/discounts", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: parseInt(userId),
            discountType: "signup",
            isUsed: true
          }),
        });
      }

      // Clear the pending reservations
      localStorage.removeItem(userEmail);
      
      // Redirect to confirmation page
      router.push("/confirmed-reservations");
    } catch (error) {
      console.error("Payment processing error:", error);
      setError("Payment processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!reservations.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Items to Checkout</h1>
          <p className="text-gray-600 mb-8">Your shopping cart is empty.</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="mt-2 text-gray-600">Complete your reservation payment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              <div className="bg-white shadow rounded-lg p-6 space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.serviceId} className="flex justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">{reservation.serviceName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(reservation.startDate).toLocaleDateString()} 
                        {reservation.endDate && ` - ${new Date(reservation.endDate).toLocaleDateString()}`}
                      </p>
                      <p className="text-sm text-gray-500">Quantity: {reservation.quantity || 1}</p>
                    </div>
                    <p className="font-medium">QAR {(reservation.totalPrice || reservation.price).toFixed(2)}</p>
                  </div>
                ))}
                
                {/* Discount section */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>QAR {priceDetails.originalPrice.toFixed(2)}</span>
                  </div>
                  
                  {priceDetails.appliedDiscounts.map((discount, index) => (
                    <div key={index} className="flex justify-between text-green-600">
                      <span>{discount.description}</span>
                      <span>-QAR {discount.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>QAR {priceDetails.finalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Available promotions */}
                {promotions && promotions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium mb-2">Available Promotions</h3>
                    {promotions.map((promotion) => (
                      <div key={promotion.id} className="flex items-center mb-2">
                        <input
                          type="radio"
                          id={`promo-${promotion.id}`}
                          name="promotion"
                          checked={selectedPromotion && selectedPromotion.id === promotion.id}
                          onChange={() => handlePromotionSelect(promotion)}
                          className="mr-2"
                        />
                        <label htmlFor={`promo-${promotion.id}`} className="text-sm">
                          {promotion.title} - {promotion.discountType === 'PERCENTAGE' ? `${promotion.discount}%` : `QAR ${promotion.discount}`} off
                          {promotion.description && <span className="block text-xs text-gray-500">{promotion.description}</span>}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Loyalty status */}
                {discounts && discounts.loyaltyDiscount && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium mb-2">Loyalty Status</h3>
                    <p className="text-sm">
                      You have completed {discounts.completedReservations} reservations.
                    </p>
                    <p className="text-sm text-green-600">
                      Your loyalty discount: {discounts.loyaltyDiscount.discount}
                      {discounts.loyaltyDiscount.discountType === 'PERCENTAGE' ? '%' : ' QAR'}
                    </p>
                    {discounts.nextTier && (
                      <p className="text-sm text-gray-500 mt-1">
                        Complete {discounts.nextTier.threshold - discounts.completedReservations} more reservations to reach the next tier ({discounts.nextTier.discount}%).
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="bg-white shadow rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
                      Cardholder Name
                    </label>
                    <input
                      id="cardholderName"
                      name="cardholderName"
                      type="text"
                      value={cardDetails.cardholderName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      pattern="\d*"
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        id="expiryDate"
                        name="expiryDate"
                        type="month"
                        value={cardDetails.expiryDate}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <input
                        id="cvv"
                        name="cvv"
                        type="text"
                        value={cardDetails.cvv}
                        onChange={handleInputChange}
                        maxLength={3}
                        pattern="\d*"
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {processing ? "Processing..." : `Pay QAR ${priceDetails.finalPrice.toFixed(2)}`}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}