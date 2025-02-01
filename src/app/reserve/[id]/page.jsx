"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/PrivateRoute/auth";

export default function ReserveService({ params }) {
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [noOfRooms, setNoOfRooms] = useState(1);
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");
  const router = useRouter();
  useEffect(() => {
    if (id) {
      // Fetch the service details using the ID
      setLoading(true);
      fetch(`/api/services/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setService(data);
          } else {
            notFound(); // If no service found, show the not found page
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching service details:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (!userEmail) {
    return router.push("/login");
  }

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    if (new Date(e.target.value) > new Date(endDate)) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleRoomsChange = (e) => {
    const value = Math.max(1, e.target.value); // Ensure value is at least 1
    setNoOfRooms(value);
  };

  const validateForm = () => {
    if (!startDate || !endDate) {
      setError("Both dates are required.");
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("End date should be later than start date.");
      return false;
    }
    setError("");
    return true;
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const reservation = {
      userId: userId,
      userEmail: userEmail,
      serviceId: id,
      serviceName: service.name,
      startDate,
      endDate,
      price: service.price,
    };

    if (service.type === "hotel") {
      reservation.noOfRooms = noOfRooms;
      reservation.price *= noOfRooms;
    }

    // Retrieve existing reservations from localStorage
    const existingReservations =
      JSON.parse(localStorage.getItem(userEmail)) || [];

    // Add the new reservation
    const updatedReservations = [...existingReservations, reservation];

    // Store updated reservations in localStorage
    localStorage.setItem(userEmail, JSON.stringify(updatedReservations));

    setStartDate("");
    setEndDate("");
    setNoOfRooms(1);
    alert("Reservation saved successfully!");
    router.push("/pending-reservations");
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex justify-center items-center">
        {/* Loading Spinner */}
        <div
          style={{
            border: "8px solid #f3f3f3",
            borderTop: "8px solid #3498db",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 2s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  if (!service) {
    return <div>Service not found.</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Reserve: {service.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <img
            src={`/images/${service.type}.jpg`}
            alt={service.name}
            className="w-full h-56 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <p className="text-sm text-gray-400">Price: ${service.price}</p>

            <form onSubmit={handleConfirmReservation}>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Start Date:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
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
                  onChange={handleEndDateChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {service.type === "hotel" && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Select No of Rooms
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={noOfRooms}
                    onChange={handleRoomsChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}

              {/* Display error message above the button */}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <button
                type="submit"
                className="mt-4 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none"
              >
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
