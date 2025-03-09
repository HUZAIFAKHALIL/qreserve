"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BuildingIcon, UsersIcon, ScissorsIcon, TreePineIcon, PlaneIcon, PlayIcon, DumbbellIcon } from 'lucide-react';

export default function ReserveService({ params }) {
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  
  const router = useRouter();
  
  // Get user information from localStorage
  const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem("userEmail") : null;

  useEffect(() => {
    if (id) {
      // Fetch the service details using the ID
      setLoading(true);
      fetch(`/api/services/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setService({...data.service,specificService:data.specificService  });
            // Set default selected option if specific services exist
            if (data.specificService && data.specificService.length > 0) {
              setSelectedOption(data.specificService[0]);
              setTotalPrice(data.specificService[0].price);
            } else {
              setTotalPrice(data.price || 0);
            }
          } else {
            // If no service found, show the not found page
            console.error("Service not found");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching service details:", err);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (!userEmail && typeof window !== 'undefined') {
      router.push("/login");
    }
  }, [userEmail, router]);

  useEffect(() => {
    // Update total price when quantity or selected option changes
    if (selectedOption) {
      setTotalPrice(selectedOption.price * quantity);
    } else if (service) {
      setTotalPrice(service.price * quantity);
    }
  }, [selectedOption, quantity, service]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    if (new Date(e.target.value) > new Date(endDate)) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1); // Ensure value is at least 1
    setQuantity(value);
  };

  const handleOptionChange = (e) => {
    const optionId = e.target.value;
    const option = service.specificService.find(item => item.id === optionId || 
      JSON.stringify(item) === optionId);
    setSelectedOption(option);
  };

  const validateForm = () => {
    if (!startDate) {
      setError("Start date is required.");
      return false;
    }
    
    // For services that need both start and end dates
    if (['hotel', 'car', 'hall'].includes(service.type) && !endDate) {
      setError("End date is required.");
      return false;
    }
    
    if (endDate && new Date(startDate) >= new Date(endDate)) {
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
      serviceType: service.type,
      startDate,
      endDate: endDate || startDate, // Use start date as end date for single-day services
      totalPrice: totalPrice,
      quantity: quantity,
      specificService: selectedOption ? {
        ...selectedOption,
        name: getSpecificServiceName(selectedOption, service.type)
      } : null
    };

    // Retrieve existing reservations from localStorage
    const existingReservations =
      JSON.parse(localStorage.getItem(userEmail)) || [];

    // Add the new reservation
    const updatedReservations = [...existingReservations, reservation];

    // Store updated reservations in localStorage
    localStorage.setItem(userEmail, JSON.stringify(updatedReservations));

    setStartDate("");
    setEndDate("");
    setQuantity(1);
    alert("Reservation saved successfully!");
    router.push("/pending-reservations");
  };

  // Helper function to get specific service name based on service type
  const getSpecificServiceName = (option, type) => {
    switch (type) {
      case 'hotel':
        return `${option.roomType} Room`;
      case 'car':
        return option.carModel;
      case 'gym':
        return option.membershipTypes;
      case 'salon':
        return option.salonSpecialty;
      case 'flight':
        return `${option.flightClass} Class`;
      case 'hall':
        return option.eventType;
      case 'activity':
        return option.activityType;
      case 'playground':
        return option.playgroundType;
      default:
        return option.name || '';
    }
  };

  // Helper to render service-specific icons
  const getServiceIcon = (type) => {
    switch (type) {
      case 'hotel':
        return <BuildingIcon className="w-5 h-5" />;
      case 'car':
        return <UsersIcon className="w-5 h-5" />;
      case 'gym':
        return <DumbbellIcon className="w-5 h-5" />;
      case 'salon':
        return <ScissorsIcon className="w-5 h-5" />;
      case 'hall':
        return <BuildingIcon className="w-5 h-5" />;
      case 'activity':
        return <TreePineIcon className="w-5 h-5" />;
      case 'flight':
        return <PlaneIcon className="w-5 h-5" />;
      case 'playground':
        return <PlayIcon className="w-5 h-5" />;
      default:
        return <BuildingIcon className="w-5 h-5" />;
    }
  };

  // Helper function to render service-specific fields
  const renderServiceSpecificFields = () => {
    if (!service) return null;

    // Common fields for all services
    const commonFields = (
      <>
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Date:
          </label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </>
    );

    // Service-specific fields
    switch (service.type) {
      case 'hotel':
      case 'car':
      case 'hall':
        return (
          <>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">
                Check-in/Start Date:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700">
                Check-out/End Date:
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </>
        );
        
      default:
        return commonFields;
    }
  };

  // Render the quantity field with appropriate label
  const renderQuantityField = () => {
    if (!service) return null;
    
    let label;
    switch (service.type) {
      case 'hotel':
        label = 'Number of Rooms';
        break;
      case 'flight':
        label = 'Number of Passengers';
        break;
      case 'car':
        label = 'Number of Vehicles';
        break;
      case 'gym':
        label = 'Number of Memberships';
        break;
      case 'salon':
        label = 'Number of Appointments';
        break;
      case 'hall':
        label = 'Number of Halls';
        break;
      case 'activity':
      case 'playground':
        label = 'Number of Tickets';
        break;
      default:
        label = 'Quantity';
    }
    
    return (
      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-700">
          {label}:
        </label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={handleQuantityChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    );
  };

  // Render options/variants selection
  const renderOptionsSelection = () => {
    if (!service || !service.specificService || service.specificService.length === 0) {
      return null;
    }
    
    let label;
    switch (service.type) {
      case 'hotel':
        label = 'Room Type';
        break;
      case 'car':
        label = 'Vehicle Model';
        break;
      case 'gym':
        label = 'Membership Type';
        break;
      case 'salon':
        label = 'Service Type';
        break;
      case 'flight':
        label = 'Class';
        break;
      case 'hall':
        label = 'Hall Type';
        break;
      case 'activity':
        label = 'Activity Type';
        break;
      case 'playground':
        label = 'Playground Type';
        break;
      default:
        label = 'Options';
    }
    
    return (
      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-700">
          {label}:
        </label>
        <select
          value={selectedOption ? JSON.stringify(selectedOption) : ''}
          onChange={handleOptionChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          {service.specificService.map((option, index) => (
            <option key={index} value={JSON.stringify(option)}>
              {getSpecificServiceName(option, service.type)} - QAR {option.price}
            </option>
          ))}
        </select>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return <div className="p-6">Service not found.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white rounded-lg shadow">
            {getServiceIcon(service.type)}
          </div>
          <h1 className="text-3xl font-bold">Reserve: {service.name}</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img
            src={`/images/${service.type}.jpg`}
            alt={service.name}
            className="w-full h-56 object-cover"
            onError={(e) => (e.target.src = "/fallback-image.jpg")}
          />
          
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <p className="text-sm text-gray-500 mb-6">
              {service.location && <span className="block">Location: {service.location}</span>}
              {!selectedOption && service.price && <span className="block">Base Price: QAR {service.price}</span>}
            </p>

            <form onSubmit={handleConfirmReservation} className="space-y-4">
              {/* Service Options */}
              {renderOptionsSelection()}
              
              {/* Service-specific date fields */}
              {renderServiceSpecificFields()}
              
              {/* Quantity field */}
              {renderQuantityField()}
              
              {/* Display calculated total */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Price:</span>
                  <span className="text-xl font-bold">QAR {totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Error message */}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none transition-colors"
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