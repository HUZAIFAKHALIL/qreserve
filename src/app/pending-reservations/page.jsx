"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PendingReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [confirmationStatus, setConfirmationStatus] = useState("");

  const isBrowser = typeof window !== "undefined";
  const userEmail = isBrowser ? localStorage.getItem("userEmail") : null;
  const router = useRouter();

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";

    if (isBrowser) {
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        router.push("/login");
        return;
      }

      setLoading(true);

      const allReservations = localStorage.getItem(userEmail);

      if (!allReservations) {
        setReservations([]);
        setLoading(false);
        return;
      }

      try {
        const parsedReservations = JSON.parse(allReservations);

        const fetchServiceDetails = async () => {
          const enrichedReservations = await Promise.all(
            parsedReservations.map(async (reservation) => {
              try {
                const response = await fetch(
                  `/api/services/${reservation.serviceId}`
                );
                if (!response.ok)
                  throw new Error("Failed to fetch service details");

                const serviceDetails = await response.json();
                return { 
                  ...serviceDetails, 
                  ...reservation,
                  // Ensure type is available for rendering
                  type: reservation.serviceType || serviceDetails.service.type
                };
              } catch (error) {
                console.error("Error fetching service details:", error);
                return reservation;
              }
            })
          );

          setReservations(enrichedReservations);
        };

        fetchServiceDetails();
      } catch (error) {
        console.error("Error parsing reservations from localStorage:", error);
        setReservations([]);
      }

      setLoading(false);
    }
  }, [router]);

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setStartDate(reservation.startDate);
    setEndDate(reservation.endDate);
    setQuantity(reservation.quantity || 1);
    setError("");
  };

  const handleStartDateChange = (event) => setStartDate(event.target.value);
  const handleEndDateChange = (event) => setEndDate(event.target.value);
  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1); // Ensure value is at least 1
    setQuantity(value);
  };

  const getServiceSpecificLabel = (type) => {
    switch (type) {
      case 'hotel':
        return 'Number of Rooms';
      case 'flight':
        return 'Number of Passengers';
      case 'car':
        return 'Number of Vehicles';
      case 'gym':
        return 'Number of Memberships';
      case 'salon':
        return 'Number of Appointments';
      case 'hall':
        return 'Number of Halls';
      case 'activity':
      case 'playground':
        return 'Number of Tickets';
      default:
        return 'Quantity';
    }
  };

  const handleConfirmEditReservation = (event) => {
    event.preventDefault();

    if (!startDate || (!endDate && ['hotel', 'car', 'hall'].includes(editingReservation.type))) {
      setError("Please provide both start and end dates.");
      return;
    }

    if (endDate && ['hotel', 'car', 'hall'].includes(editingReservation.type) && new Date(startDate) >= new Date(endDate)) {
      setError("End date should be later than start date.");
      return;
    }

    const updatedReservations = reservations.map((reservation) => {
      if (reservation.serviceId === editingReservation.serviceId) {
        // Calculate price based on quantity and specific service if available
        let updatedPrice = reservation.price;
        
        if (reservation.specificService) {
          const pricePerUnit = reservation.specificService.price;
          updatedPrice = pricePerUnit * quantity;
        } else if (reservation.price && quantity !== reservation.quantity) {
          // Recalculate based on base price and new quantity
          const pricePerUnit = reservation.price / (reservation.quantity || 1);
          updatedPrice = pricePerUnit * quantity;
        }

        return {
          ...reservation,
          startDate,
          endDate: endDate || startDate, // Use start date as end date for single-day services
          quantity: quantity,
          totalPrice: updatedPrice,
          price: updatedPrice // For backward compatibility
        };
      } else {
        return reservation;
      }
    });

    // Prepare data for localStorage - maintain the same structure as ReserveService
    const filteredUpdatedReservations = updatedReservations.map((reservation) => {
      // Extract only the necessary fields to store in localStorage
      const baseReservation = {
        userId: reservation.userId,
        userEmail: reservation.userEmail,
        serviceId: reservation.serviceId,
        serviceName: reservation.serviceName || reservation.name,
        serviceType: reservation.type || reservation.serviceType,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        totalPrice: reservation.totalPrice || reservation.price,
        quantity: reservation.quantity || 1
      };

      // Include specificService if available
      if (reservation.specificService) {
        baseReservation.specificService = reservation.specificService;
      }

      return baseReservation;
    });

    localStorage.setItem(
      userEmail,
      JSON.stringify(filteredUpdatedReservations)
    );

    setReservations(updatedReservations);
    setEditingReservation(null);
  };

  const handleDelete = (reservation) => {
    if (
      window.confirm(
        `Are you sure you want to delete the reservation for ${reservation.serviceName || reservation.name}?`
      )
    ) {
      const updatedReservations = reservations.filter(
        (r) => r.serviceId !== reservation.serviceId
      );

      // Prepare data for localStorage - maintain the same structure as ReserveService
      const filteredUpdatedReservations = updatedReservations.map((reservation) => {
        // Extract only the necessary fields to store in localStorage
        const baseReservation = {
          userId: reservation.userId,
          userEmail: reservation.userEmail,
          serviceId: reservation.serviceId,
          serviceName: reservation.serviceName || reservation.name,
          serviceType: reservation.type || reservation.serviceType,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          totalPrice: reservation.totalPrice || reservation.price,
          quantity: reservation.quantity || 1
        };

        // Include specificService if available
        if (reservation.specificService) {
          baseReservation.specificService = reservation.specificService;
        }

        return baseReservation;
      });

      localStorage.setItem(
        userEmail,
        JSON.stringify(filteredUpdatedReservations)
      );

      setReservations(updatedReservations);
    }
  };

  const handleConfirmReservations = async () => {
    setConfirmationStatus("Saving reservations...");

    const filteredReservations = localStorage.getItem(userEmail);
    const parsedReservations = JSON.parse(filteredReservations);
    const userId = localStorage.getItem("userId");
    const totalPrice = parsedReservations.reduce(
      (acc, curr) => acc + (curr.totalPrice || curr.price),
      0
    );

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "confirmed",
          userId: parseInt(userId),
          totalPrice: totalPrice,
          reservationItems: parsedReservations.map((item) => ({
            serviceId: parseInt(item.serviceId),
            price: item.totalPrice || item.price,
            startTime: new Date(item.startDate).toISOString(),
            endTime: new Date(item.endDate || item.startDate).toISOString(),
            quantity: item.quantity || 1,
            specificServiceId: item.specificService ? item.specificService.id : null
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to confirm reservations");

      setConfirmationStatus("Reservations confirmed successfully!");
      localStorage.removeItem(userEmail); // Clear the reservations after successful confirmation
      setReservations([]);

      router.push("/confirmed-reservations");
    } catch (error) {
      setConfirmationStatus("Failed to confirm reservations");
      console.error("Error confirming reservations:", error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (reservations.length === 0 && loading === false) {
    return <div className="p-6">No pending reservations found.</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Pending Reservations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((reservation) => (
          <div
            key={reservation.serviceId}
            className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl flex flex-col justify-between"
          >
            <img
              src={`/images/${reservation.type || 'default'}.jpg`}
              alt={reservation.serviceName || reservation.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 flex-grow">
              <h3 className="text-xl font-semibold mb-2">
                {reservation.serviceName || reservation.name}
              </h3>
              
              {/* Display specific service details if available */}
              {reservation.specificService && (
                <p className="text-gray-600 mb-4">
                  Option: {reservation.specificService.name || 
                          (reservation.type === 'hotel' ? `${reservation.specificService.roomType} Room` :
                           reservation.type === 'car' ? reservation.specificService.carModel : 
                           reservation.specificService.serviceType || 'Standard')}
                </p>
              )}
              
              <p className="text-gray-600 mb-4">
                Start Date: {new Date(reservation.startDate).toLocaleDateString()}
              </p>
              
              {reservation.endDate && (
                <p className="text-gray-600 mb-4">
                  End Date: {new Date(reservation.endDate).toLocaleDateString()}
                </p>
              )}
              
              <p className="text-gray-600 mb-4">
                {getServiceSpecificLabel(reservation.type)}: {reservation.quantity || 1}
              </p>
              
              <p className="text-gray-600 mb-4">
                Price: QAR {(reservation.totalPrice || reservation.price).toFixed(2)}
              </p>
              
              <p className="text-gray-600 mb-4">
                Description: {reservation.service.description || "N/A"}
              </p>
              
              <p className="text-gray-600 mb-4">
                Location: {reservation.service.location || "N/A"}
              </p>
            </div>
            
            {editingReservation?.serviceId === reservation.serviceId ? (
              <form onSubmit={handleConfirmEditReservation} className="p-4">
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {['hotel', 'car', 'hall'].includes(reservation.type) && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      End Date:
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      min={startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}

                {/* <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    {getServiceSpecificLabel(reservation.type)}:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div> */}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                  type="submit"
                  className="mt-4 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="p-4 flex gap-4">
                <button
                  className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none"
                  onClick={() => handleEdit(reservation)}
                >
                  Edit Reservation
                </button>
                <button
                  className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none"
                  onClick={() => handleDelete(reservation)}
                >
                  Delete Reservation
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {reservations.length > 0 && (
        <button
          onClick={handleConfirmReservations}
          className="mt-8 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none mx-auto block"
        >
          Confirm All Reservations
        </button>
      )}
      {confirmationStatus && (
        <div
          className={`mt-4 p-4 ${
            confirmationStatus === "Reservations confirmed successfully!"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {confirmationStatus}
        </div>
      )}
    </div>
  );
}