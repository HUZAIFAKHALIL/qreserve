"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

export default function ReviewPage() {
  const [completedReservations, setCompletedReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBrowser = typeof window !== "undefined";
  const userId = isBrowser ? localStorage.getItem("userId") : null;
  const userEmail = isBrowser ? localStorage.getItem("userEmail") : null;
  const router = useRouter();

  // Fetch completed reservations when the component loads
  useEffect(() => {
    const fetchCompletedReservations = async () => {
      setIsLoading(true);
      try {
        // Updated API endpoint to match your folder structure
        const response = await fetch(`/api/users/${userId}/completed-reservations`);
        if (response.ok) {
          const data = await response.json();
          setCompletedReservations(data.completedReservations);
        } else {
          console.error("Failed to fetch completed reservations");
          toast.error("Failed to load completed reservations", {
            position: "bottom-right",
            autoClose: 5000,
            theme: "dark",
          });
        }
      } catch (error) {
        console.error("Error fetching completed reservations:", error);
        toast.error("Error loading completed reservations", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchCompletedReservations();
    }
  }, [userId]);

  if (!userEmail) {
    return router.push("/login");
  }

  // Handle selecting a reservation
  const handleSelectReservation = (reservation) => {
    setSelectedReservation(reservation);
    setRating(0);
    setComment("");
    
    // Check if user has already reviewed this service
    const checkExistingReview = async () => {
      try {
        const response = await fetch(`/api/reviews/user/${userId}/service/${reservation.reservation.serviceId}`);
        if (response.ok) {
          const existingReview = await response.json();
          if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment || "");
            toast.info("You've already reviewed this service. You can update your review.", {
              position: "bottom-right",
              autoClose: 5000,
              theme: "dark",
            });
          }
        }
      } catch (error) {
        console.error("Error checking existing review:", error);
      }
    };
    
    checkExistingReview();
  };

  // Handle submitting a review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          serviceId: selectedReservation.reservation.serviceId,
          rating,
          comment,
        }),
      });
      
      if (response.ok) {
        toast.success("Review submitted successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });
        setSelectedReservation(null);
        router.push("/")
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to submit review", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {isLoading && <p className="text-center">Loading...</p>}
      
      <h1 className="text-3xl font-bold text-black mb-6">Submit Reviews</h1>
      
      {completedReservations.length === 0 && !isLoading ? (
        <p className="text-center text-gray-500">No completed reservations found. Complete a service to leave a review.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="p-4 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition"
              onClick={() => handleSelectReservation(reservation)}
            >
              <h2 className="text-xl font-semibold">
                {reservation.reservation.service.name}
              </h2>
              <p className="text-sm">Type: {reservation.reservation.service.type}</p>
              <p className="text-sm">Price: ${reservation.totalPrice.toFixed(2)}</p>
              <p className="text-sm">
                Completed on: {new Date(reservation.completedAt).toLocaleDateString()}
              </p>
              <div className="mt-2">
                <button className="px-4 py-2 bg-black text-white rounded-lg">
                  Write Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Review Form Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Review for {selectedReservation.reservation.service.name}
            </h3>
            
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating:
                </label>
                <div className="flex">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          className="hidden"
                          value={ratingValue}
                          onClick={() => setRating(ratingValue)}
                        />
                        <FaStar
                          className="cursor-pointer"
                          color={(hover || rating) >= ratingValue ? "#FFD700" : "#e4e5e9"}
                          size={32}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comment:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Share your experience with this service..."
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                  onClick={() => setSelectedReservation(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}