// src\app\checkout\page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getUserDiscounts, markDiscountsAsUsed, calculateDiscountedPrice } from "@/utils/discountCalculator";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckout />
    </Elements>
  );
}

function StripeCheckout() {
  const [reservations, setReservations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [discounts, setDiscounts] = useState(null);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(true);
  const [signupDiscountData, setSignupDiscountData] = useState(null);
  const [priceDetails, setPriceDetails] = useState({
    originalPrice: 0,
    finalPrice: 0,
    totalDiscount: 0,
    appliedDiscounts: []
  });
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  
  const [loyaltyDiscountData, setLoyaltyDiscountData] = useState({
    currentDiscount: null,
    completedReservations: 0,
    nextTier: null
  });

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  // Fetch loyalty discount details
  const fetchLoyaltyDiscountDetails = async (userId) => {
    try {
      const response = await fetch(`/api/loyalty-discount?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch loyalty discount");
      }
      const data = await response.json();
      
      setLoyaltyDiscountData({
        currentDiscount: data.currentDiscount,
        completedReservations: data.completedReservations,
        nextTier: data.nextTier
      });

      return data;
    } catch (error) {
      console.error("Error fetching loyalty discount:", error);
      return null;
    }
  };

  // Fetch user discounts
  const fetchUserDiscounts = async (userId) => {
    try {
      const response = await fetch(`/api/discounts?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch discounts");
      }
      const data = await response.json();
      setDiscounts(data);
      
      // Set signup discount data if available
      if (data.signupDiscount) {
        setSignupDiscountData(data.signupDiscount);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching discounts:", error);
      return null;
    }
  };

  // Initial data fetching
  // useEffect(() => {
  //   const storedUserEmail = localStorage.getItem("userEmail");
  //   const storedUserId = localStorage.getItem("userId");
    
  //   if (!storedUserEmail || !storedUserId) {
  //     router.push("/login");
  //     return;
  //   }

  //   setUserEmail(storedUserEmail);
  //   setUserId(storedUserId);

  //   const fetchData = async () => {
  //     // Fetch loyalty discount details
  //     await fetchLoyaltyDiscountDetails(storedUserId);

  //     // Fetch discounts
  //     const discountData = await fetchUserDiscounts(storedUserId);

  //     const storedReservations = localStorage.getItem(storedUserEmail);
      
  //     if (storedReservations) {
  //       const parsedReservations = JSON.parse(storedReservations);
  //       setReservations(parsedReservations);
        
  //       const originalTotal = parsedReservations.reduce(
  //         (acc, curr) => acc + (curr.totalPrice || curr.price),
  //         0
  //       );
        
  //       setTotalAmount(originalTotal);
        
  //       if (discountData) {
  //         const priceInfo = calculateDiscountedPrice(originalTotal, discountData);
  //         setPriceDetails(priceInfo);
  //       }
  //     }
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, [router]);

  useEffect(() => {
    const storedUserEmail = localStorage.getItem("userEmail");
    const storedUserId = localStorage.getItem("userId");
    
    if (!storedUserEmail || !storedUserId) {
      router.push("/login");
      return;
    }

    setUserEmail(storedUserEmail);
    setUserId(storedUserId);

    const fetchData = async () => {
      // Fetch loyalty discount details
      await fetchLoyaltyDiscountDetails(storedUserId);

      // Fetch discounts
      const discountData = await fetchUserDiscounts(storedUserId);

      const storedReservations = localStorage.getItem(storedUserEmail);
      
      if (storedReservations) {
        const parsedReservations = JSON.parse(storedReservations);
        setReservations(parsedReservations);
        
        const originalTotal = parsedReservations.reduce(
          (acc, curr) => acc + (curr.totalPrice || curr.price),
          0
        );
        
        setTotalAmount(originalTotal);
        
        if (discountData) {
          const priceInfo = calculateDiscountedPrice(originalTotal, discountData);
          setPriceDetails(priceInfo);

          // Set signup discount data
          if (discountData.signupDiscount && !discountData.signupDiscount.isUsed) {
            setSignupDiscountData(discountData.signupDiscount);
          }
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  // Update price when loyalty points change
  useEffect(() => {
    if (discounts) {
      let newDiscountData = { ...discounts };
      
      // If useLoyaltyPoints is false, mark loyalty discount as used
      if (!useLoyaltyPoints && newDiscountData.loyaltyDiscount) {
        newDiscountData.loyaltyDiscount.isUsed = true;
      } else if (newDiscountData.loyaltyDiscount) {
        // If useLoyaltyPoints is true, mark it as not used
        newDiscountData.loyaltyDiscount.isUsed = false;
      }

      const newPriceDetails = calculateDiscountedPrice(
        totalAmount, 
        newDiscountData
      );
      
      setPriceDetails(newPriceDetails);
    }
  }, [useLoyaltyPoints, totalAmount, discounts]);

  // Handle loyalty points toggle
  const handleLoyaltyPointsToggle = async () => {
    const newUseLoyaltyPoints = !useLoyaltyPoints;
    
    try {
      const response = await fetch('/api/loyalty-discount/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          useDiscount: !newUseLoyaltyPoints // Invert the logic here
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update loyalty discount preference');
      }

      // Update local state
      setUseLoyaltyPoints(newUseLoyaltyPoints);
    } catch (error) {
      console.error('Error toggling loyalty discount:', error);
    }
  };

  // Stripe Checkout Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Validate cardholder name
      const cardholderName = e.target.cardholderName.value;
      if (!cardholderName) {
        setError("Cardholder name is required");
        setProcessing(false);
        return;
      }

      // Create a payment intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(priceDetails.finalPrice * 100), // Convert to cents
          currency: "qar", 
          metadata: {
            userId: userId,
            reservationIds: reservations.map(r => r.serviceId).join(',')
          }
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm the payment on the client side
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: cardholderName,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }

      // Mark used discounts
      await markDiscountsAsUsed(
        parseInt(userId), 
        priceDetails.appliedDiscounts
      );

      // Process reservations
      const requestData = {
        status: "confirmed",
        userId: parseInt(userId),
        totalPrice: priceDetails.finalPrice,
        originalPrice: priceDetails.originalPrice,
        discountAmount: priceDetails.totalDiscount,
        paymentDetails: {
          paymentIntentId: result.paymentIntent.id,
          last4: result.paymentIntent.payment_method.last4,
        },
        reservationItems: reservations.map((item) => ({
          serviceId: parseInt(item.serviceId),
          price: item.totalPrice || item.price,
          startTime: new Date(item.startDate).toISOString(),
          endTime: new Date(item.endDate || item.startDate).toISOString(),
          quantity: item.quantity || 1,
          specificServiceId: item.specificService ? item.specificService.id : null
        })),
        appliedDiscounts: priceDetails.appliedDiscounts
      };

      // Submit reservation to your backend
      const reservationResponse = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      
      if (!reservationResponse.ok) {
        throw new Error("Failed to process reservation");
      }

      // UPDATED: Clear specific reservations from localStorage
      const storedReservations = JSON.parse(localStorage.getItem(userEmail) || '[]');
      
      // Filter out the reservations that were just processed
      const remainingReservations = storedReservations.filter(storedReservation => 
        !reservations.some(processedReservation => 
          processedReservation.serviceId === storedReservation.serviceId &&
          processedReservation.startDate === storedReservation.startDate
        )
      );

      // Update localStorage with remaining reservations
      if (remainingReservations.length > 0) {
        localStorage.setItem(userEmail, JSON.stringify(remainingReservations));
      } else {
        // If no reservations remain, remove the item completely
        localStorage.removeItem(userEmail);
      }

      // Redirect to reservations page
      router.push("/reservations");
    } catch (error) {
      console.error("Payment processing error:", error);
      setError("Payment processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

    // Loading state
    if (loading) {
      return <div className="p-6">Loading...</div>;
    }

    // Empty cart state
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

    const renderSignupDiscountSection = () => {
    if (!signupDiscountData) return null;

    return (
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Signup Discount</h3>
            <p className="text-sm text-gray-500">
              {signupDiscountData.discountType === 'PERCENTAGE' 
                ? `${signupDiscountData.discount}% off your first purchase` 
                : `QAR ${signupDiscountData.discount} off your first purchase`}
            </p>
          </div>
          <span className="text-green-600 font-medium">
            Applied
          </span>
        </div>
      </div>
    );
  };
  

    const renderLoyaltyDiscountSection = () => {
      const { currentDiscount, completedReservations, nextTier } = loyaltyDiscountData;
    
      if (!currentDiscount) {
        return (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">
              Complete more reservations to unlock loyalty discounts!
            </p>
            {nextTier && (
              <p className="text-sm text-gray-500">
                Next tier at {nextTier.threshold} reservations
              </p>
            )}
          </div>
        );
      }
    
      return (
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Loyalty Discount</h3>
              <p className="text-sm text-gray-500">
                Completed Reservations: {completedReservations}
              </p>
              <p className="text-sm text-gray-500">
                Current Discount: {currentDiscount.discountType === 'PERCENTAGE' 
                  ? `${currentDiscount.discount}%` 
                  : `QAR ${currentDiscount.discount}`}
              </p>
              {nextTier && (
                <p className="text-sm text-gray-500">
                  Next tier at {nextTier.threshold} reservations
                </p>
              )}
            </div>
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLoyaltyPoints}
                  onChange={handleLoyaltyPointsToggle}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Use Loyalty Discount
                </span>
              </label>
            </div>
          </div>
        </div>
      );
    };

    // Main checkout render
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
                  {renderSignupDiscountSection()}
                  {renderLoyaltyDiscountSection()}
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
                        placeholder="John Doe"
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Card Details
                      </label>
                      <CardElement 
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#424770',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                            invalid: {
                              color: '#9e2146',
                            },
                          },
                        }}
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={processing || !stripe}
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
