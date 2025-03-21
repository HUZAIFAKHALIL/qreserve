'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Clock, Trash2, Edit3, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

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
    const value = Math.max(1, parseInt(e.target.value) || 1);
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
        let updatedPrice = reservation.price;
        
        if (reservation.specificService) {
          const pricePerUnit = reservation.specificService.price;
          updatedPrice = pricePerUnit * quantity;
        } else if (reservation.price && quantity !== reservation.quantity) {
          const pricePerUnit = reservation.price / (reservation.quantity || 1);
          updatedPrice = pricePerUnit * quantity;
        }

        return {
          ...reservation,
          startDate,
          endDate: endDate || startDate,
          quantity: quantity,
          totalPrice: updatedPrice,
          price: updatedPrice
        };
      } else {
        return reservation;
      }
    });

    const filteredUpdatedReservations = updatedReservations.map((reservation) => {
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

      const filteredUpdatedReservations = updatedReservations.map((reservation) => {
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
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (reservations.length === 0 && loading === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <div className="text-6xl mb-4">🏷️</div>
        <h3 className="text-xl font-semibold mb-2">No Pending Reservations</h3>
        <p className="text-gray-500">Your reservation list is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reservations.map((reservation) => (
          <div
            key={reservation.serviceId}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
          >
            <div className="relative">
              <img
                src={`/images/${reservation.type || reservation.serviceType || 'default'}.jpg`}
                alt={reservation.serviceName || reservation.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.error(`Failed to load image: /images/${reservation.type || 'default'}.jpg`);
                  e.target.src = '/images/default.jpg';
                }}
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                <span className="text-sm font-semibold text-gray-800">
                  QAR {(reservation.totalPrice || reservation.price).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {reservation.serviceName || reservation.name}
              </h3>

              {reservation.specificService && (
                <div className="flex items-center text-gray-600 mb-3">
                  <span className="font-medium">
                    {reservation.specificService.name || 
                    (reservation.type === 'hotel' ? `${reservation.specificService.roomType} Room` :
                     reservation.type === 'car' ? reservation.specificService.carModel : 
                     reservation.specificService.serviceType || 'Standard')}
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>
                    {format(new Date(reservation.startDate), 'MMM dd, yyyy')}
                    {reservation.endDate && ` - ${format(new Date(reservation.endDate), 'MMM dd, yyyy')}`}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3" />
                  <span>{getServiceSpecificLabel(reservation.type)}: {reservation.quantity || 1}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{reservation.service?.location || "N/A"}</span>
                </div>
              </div>

              {editingReservation?.serviceId === reservation.serviceId ? (
                <form onSubmit={handleConfirmEditReservation} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {['hotel', 'car', 'hall'].includes(reservation.type) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  )}

                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleEdit(reservation)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reservation)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {reservations.length > 0 && (
        <div className="mt-12 text-center">
          <button
            onClick={handleConfirmReservations}
            className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-6 h-6 mr-2" />
            Confirm All Reservations
          </button>
        </div>
      )}

      {confirmationStatus && (
        <div className={`mt-6 p-4 rounded-lg ${
          confirmationStatus === "Reservations confirmed successfully!"
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {confirmationStatus}
          </div>
        </div>
      )}
    </div>
  );
}