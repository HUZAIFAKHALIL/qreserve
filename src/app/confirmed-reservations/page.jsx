"use client";
import { useAuth } from "@/PrivateRoute/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function ConfirmedReservations() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPartnerPreference, setShowPartnerPreference] = useState(false);
  const [partnerItem, setPartnerItem] = useState(null);
  const [genderPreference, setGenderPreference] = useState(""); // "" for no preference

  const isBrowser = typeof window !== "undefined";
  const userId = isBrowser ? localStorage.getItem("userId") : null;
  const userEmail = isBrowser ? localStorage.getItem("userEmail") : null;
  const router = useRouter();

  // Fetch all reservations when the component loads
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        // const response = await fetch(`/api/users/${userId}/reservations`);
        const response = await fetch(`/api/reservations/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setReservations(data.reservations);
        } else {
          console.error("Failed to fetch reservations");
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, [userId]);

  if (!userEmail) {
    return router.push("/login");
  }

  // Handle selecting a reservation
  const handleSelectReservation = async (reservationId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reservations/${reservationId}/items`);
      if (response.ok) {
        const items = await response.json();
        setSelectedReservation({ id: reservationId, items });
      } else {
        console.error("Failed to fetch reservation items");
      }
    } catch (error) {
      console.error("Error fetching reservation items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete reservation item
  const handleDeleteReservationItem = async (itemId) => {
    console.log("id of reservation to delete is: ", itemId);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reservation-items/${itemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Refresh the reservation items
        const updatedItems = selectedReservation.items.filter(
          (item) => item.id !== itemId
        );
        setSelectedReservation((prev) => ({ ...prev, items: updatedItems }));
      } else {
        console.error("Failed to delete reservation item");
      }
    } catch (error) {
      console.error("Error deleting reservation item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle initiating partner request
  const handlePublicReservation = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setPartnerItem(item);
    setGenderPreference(""); // Reset preference
    setShowPartnerPreference(true);
  };

  // Handle submitting partner request with preference
  const handleSubmitPartnerRequest = async () => {
    setIsLoading(true);
    // Prepare the filter object based on gender preference
    const filter = {};
    if (genderPreference) {
      filter.gender = genderPreference;
    }
    
    const req = {
      reservationItemID: partnerItem.id,
      requestUser: parseInt(userId),
      status: "pending",
      filter: filter,
    };
    console.log("req",req)
    
    try {
      const response = await fetch(`/api/partnerRequests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        // Update the items in the selected reservation
        const updatedItems = selectedReservation.items.map((item) =>
          item.id === partnerItem.id ? {...item,PartnerRequest:[updatedItem]} : item
        );
        setSelectedReservation((prev) => ({ ...prev, items: updatedItems }));
        
        // Show success message
        toast.success(`Request for Partner has been added for this reservation${genderPreference ? ` with ${genderPreference} preference` : ''}`, {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });
        
        // Close the preference modal
        setShowPartnerPreference(false);
      } else {
        console.error("Failed to edit reservation item");
        toast.error("Failed to submit partner request", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error editing reservation item:", error);
      toast.error("Error submitting partner request", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle canceling partner request
  const handleCancelPartnerRequest = () => {
    setShowPartnerPreference(false);
    setPartnerItem(null);
  };

  // Handle edit button click
  const handleEditClick = (item) => {
    setEditItem(item);
    setStartDate(new Date(item.startTime).toISOString().split("T")[0]);
    setEndDate(new Date(item.endTime).toISOString().split("T")[0]);
  };

  // Handle confirm edit
  const handleConfirmEdit = async (e, isPublic = false) => {
    e.preventDefault();
    setIsLoading(true);
    let req = {
      startTime: new Date(startDate),
      endTime: new Date(endDate),
    };
    try {
      const response = await fetch(`/api/reservation-items/${editItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      if (response.ok) {
        // Update the item in the list
        const updatedItem = await response.json();
        const updatedItems = selectedReservation.items.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );
        setSelectedReservation((prev) => ({ ...prev, items: updatedItems }));
        setEditItem(null); // Exit edit mode
        alert("Reservation edited successfully");
      } else {
        console.error("Failed to edit reservation item");
      }
    } catch (error) {
      console.error("Error editing reservation item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {isLoading && <p>Loading...</p>}
      {Array.isArray(reservations) &&
      !isLoading &&
      reservations.length === 0 ? (
        <p>No Confirmed Reservations</p>
      ) : (
        <h1 className="text-3xl font-bold text-black mb-6">
          Confirmed Reservations
        </h1>
      )}

      {/* Partner Preference Modal */}
      {showPartnerPreference && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Partner Preference</h3>
            <p className="mb-4">Would you like to specify a gender preference for your partner?</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="no-preference"
                  name="gender-preference"
                  value=""
                  checked={genderPreference === ""}
                  onChange={() => setGenderPreference("")}
                  className="mr-2"
                />
                <label htmlFor="no-preference">No preference</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male-preference"
                  name="gender-preference"
                  value="male"
                  checked={genderPreference === "male"}
                  onChange={() => setGenderPreference("male")}
                  className="mr-2"
                />
                <label htmlFor="male-preference">Male</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="female-preference"
                  name="gender-preference"
                  value="female"
                  checked={genderPreference === "female"}
                  onChange={() => setGenderPreference("female")}
                  className="mr-2"
                />
                <label htmlFor="female-preference">Female</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                onClick={handleCancelPartnerRequest}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-lg"
                onClick={handleSubmitPartnerRequest}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 overflow-y-auto max-h-96">
        {Array.isArray(reservations) &&
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="p-4 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition"
              onClick={() => handleSelectReservation(reservation.id)}
            >
              <h2 className="text-xl font-semibold">
                Reservation ID: {reservation.id}
              </h2>
              <p className="text-sm">Status: {reservation.status}</p>
              <p className="text-sm">
                Total Price: ${reservation.totalPrice.toFixed(2)}
              </p>
              <p className="text-sm">
                Created At: {new Date(reservation.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
      </div>

      {selectedReservation && (
        <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <h2 className="text-2xl font-bold text-black mb-4">
            Reservation Items
          </h2>
          <div className="space-y-4">
            {selectedReservation.items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white border border-gray-300 rounded-lg flex gap-4"
              >
                <div>
                  <h3 className="text-xl font-semibold">
                    Service ID: {item.serviceId}
                  </h3>
                  <p className="text-sm">Price: ${item.price.toFixed(2)}</p>
                  <p className="text-sm">
                    Start Time: {new Date(item.startTime).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    End Time: {new Date(item.endTime).toLocaleString()}
                  </p>
                
                  {!editItem || editItem.id !== item.id ? (
                    <div className="flex gap-4 mt-2">
                      <button
                        className="px-4 py-2 bg-black text-white rounded-lg"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                      {item.PartnerRequest.length ==0 && (
                      <button
                        className="px-4 py-2 bg-black text-white rounded-lg"
                        onClick={(e) => handlePublicReservation(e, item)}
                      >
                        Request for Partner
                      </button>
                      )}
                      <button
                        className="px-4 py-2 bg-black text-white rounded-lg"
                        onClick={() => handleDeleteReservationItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleConfirmEdit} className="mt-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700">
                          Start Date:
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700">
                          End Date:
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
                      >
                        Confirm
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}