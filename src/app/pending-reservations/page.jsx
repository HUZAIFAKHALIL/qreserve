"use client";
import { useAuth } from "@/PrivateRoute/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PendingReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPublic, setisPublic] = useState(false);
  const [error, setError] = useState("");
  const [confirmationStatus, setConfirmationStatus] = useState("");
  const [noOfRooms, setNoOfRooms] = useState(1);

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
                return { ...serviceDetails, ...reservation };
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

  // if (!userEmail) {
  //   return router.push("/login");
  // }


  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setStartDate(reservation.startDate);
    setEndDate(reservation.endDate);
    if (reservation.type === "hotel") setNoOfRooms(reservation.noOfRooms);
    setError("");
  };

  const handleStartDateChange = (event) => setStartDate(event.target.value);
  const handleEndDateChange = (event) => setEndDate(event.target.value);
  const handleRoomsChange = (e) => {
    const value = Math.max(1, e.target.value); // Ensure value is at least 1
    setNoOfRooms(value);
  };

  const handleConfirmEditReservation = (event) => {
    event.preventDefault();

    if (!startDate || !endDate) {
      setError("Please provide both start and end dates.");
      return;
    }

    let oldNoOfRooms = 1;
    if (reservations.type === "hotel") {
      oldNoOfRooms = reservations.noOfRooms;
    }

    const updatedReservations = reservations.map((reservation) => {
      if (reservation.serviceId === editingReservation.serviceId) {
        if (reservation.type === "hotel") {
          const pricePerService = reservation.price / reservation.noOfRooms;

          return {
            ...reservation,
            startDate,
            endDate,
            noOfRooms,
            price: pricePerService * noOfRooms,
          };
        } else return { ...reservation, startDate, endDate };
      } else return reservation;
    });

    const filteredUpdatedReservations = updatedReservations.map(
      (reservation) => {
        const baseReservation = {
          userId: reservation.userId,
          userEmail: reservation.userEmail,
          serviceId: reservation.serviceId,
          serviceName: reservation.serviceName,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          price: reservation.price,
        };

        if (reservation.type === "hotel") {
          baseReservation.noOfRooms = reservation.noOfRooms;
        }

        return baseReservation;
      }
    );

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
        `Are you sure you want to delete the reservation for ${reservation.serviceName}?`
      )
    ) {
      const updatedReservations = reservations.filter(
        (r) => r.serviceId !== reservation.serviceId
      );

      const filteredUpdatedReservations = updatedReservations.map(
        (reservation) => {
          const baseReservation = {
            userId: reservation.userId,
            userEmail: reservation.userEmail,
            serviceId: reservation.serviceId,
            serviceName: reservation.serviceName,
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            price: reservation.price,
          };

          if (reservation.type === "hotel") {
            baseReservation.noOfRooms = reservation.noOfRooms;
          }

          return baseReservation;
        }
      );

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
      (acc, curr) => acc + curr.price,
      0
    );

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          userId: parseInt(userId),
          totalPrice: totalPrice,
          reservationItems: parsedReservations.map((item) => ({
            serviceId: parseInt(item.serviceId), // Ensure `serviceId` exists in the item
            price: item.price,
            startTime: new Date(item.startDate).toISOString(),
            endTime: new Date(item.endDate).toISOString(),
          })),
        }),
      });

      // Convert the startDate and endDate to Date objects
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
              src={`/images/${reservation.type}.jpg`}
              alt={reservation.serviceName}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 flex-grow">
              <h3 className="text-xl font-semibold mb-2">
                {reservation.serviceName || reservation.name}
              </h3>
              <p className="text-gray-600 mb-4">
                Start Date:{" "}
                {new Date(reservation.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-4">
                End Date: {new Date(reservation.endDate).toLocaleDateString()}
              </p>
              {reservation.type === "hotel" && (
                <p className="text-gray-600 mb-4">
                  No of Rooms: {reservation.noOfRooms}
                </p>
              )}
              <p className="text-gray-600 mb-4">Price: ${reservation.price}</p>
              <p className="text-gray-600 mb-4">
                Description: {reservation.description || "N/A"}
              </p>
              <p className="text-gray-600 mb-4">
                Location: {reservation.location || "N/A"}
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

                {reservation.type === "hotel" && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      No of rooms:
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

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                className="px-4 py-2 bg-black text-white rounded-lg"
                onClick={(e) => setReservations}
                >
                        Request for Partner
                      </button>
                <button
                  type="submit"
                  className="mt-4 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none"
                >
                  Edit Reservation
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
          className="mt-8 bg-black text-white py-2 px-4 rounded-lg  hover:bg-gray-800 focus:outline-none ml-auto mr-auto"
        >
          Confirm Reservations
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
