"use client";
import { useAuth } from "@/PrivateRoute/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ConfirmedReservations() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle edit button click
  const handleEditClick = (item) => {
    setEditItem(item);
    setStartDate(new Date(item.startTime).toISOString().split("T")[0]);
    setEndDate(new Date(item.endTime).toISOString().split("T")[0]);
  };

  // Handle confirm edit
  const handleConfirmEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reservation-items/${editItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: new Date(startDate),
          endTime: new Date(endDate),
        }),
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
                {/* <img
                  src={item.image || `/images${item.type}/.jpg`}
                  alt={`Service ${item.serviceId}`}
                  className="w-16 h-16 object-cover rounded-md"
                /> */}
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
