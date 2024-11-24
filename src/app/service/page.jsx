"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useAuth } from "@/PrivateRoute/auth"; // Assuming useAuth is for auth
import data from "@/data/services.json"; // Static data fallback if needed
import { stringToDate } from "@/utils/helper";
const serviceTypeToService = {
  "book-hotel": "hotel",
  "rent-car": "car",
  "book-salon": "salon",
  "book-gym": "gym",
  "book-hall": "hall",
  "book-activity": "activity",
  "book-flight": "flight",
  "book-playground": "playground",
};

export default function ServiceProducts() {
  const searchParams = useSearchParams();
  const serviceType = serviceTypeToService[searchParams.get("serviceType")];

  const [isValidServiceType, setIsValidServiceType] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const serviceTypes = data.serviceTypes;
    if (serviceTypes.includes(serviceType)) {
      setIsValidServiceType(true);

      // Fetch services from API
      setLoading(true);
      fetch(`/api/services?serviceType=${serviceType}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            console.log("data received is: ", data);
            setServices(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching services:", err);
          setLoading(false);
        });
    } else {
      notFound(); // Redirect to the "not found" page
    }
  }, [serviceType]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!isValidServiceType || services.length === 0) {
    return <div className="p-6">No services found for this type.</div>;
  }

  const renderServiceDetails = (service) => {
    // Same renderServiceDetails function
    switch (service.type) {
      case "hotel":
        return (
          <>
            {/* <div className="mt-4">
              <p className="text-sm font-semibold text-indigo-600 bg-indigo-50 p-2 rounded-sm">
                Check-in: {stringToDate(service.availableStartTime)}
              </p>
              <p className="text-sm font-semibold text-indigo-600 bg-indigo-50 p-2 rounded-sm mt-1">
                Check-out: {stringToDate(service.availableEndTime)}
              </p>
            </div> */}
            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>

            <p className="text-sm text-gray-400">
              Room Type: {service.roomType}
            </p>

            {/* <p className="text-sm text-gray-400">
              Check-in: {service.availableStartTime}
            </p>

            <p className="text-sm text-gray-400">
              Check-out: {service.availableEndTime}
            </p> */}

            <p className="text-sm text-gray-400">
              Amenities: {service.amenities}
            </p>
            <p className="text-sm text-gray-400">Rating: {service.rating}</p>
          </>
        );
      case "car":
        return (
          <>
            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>

            <p className="text-sm text-gray-400">
              Car Type: {service.carType} hours
            </p>

            <p className="text-sm text-gray-400">
              Rental Duration: {service.rentalDuration} hours
            </p>

            <p className="text-sm text-gray-400">
              Capacity: {service.carCapacity}
            </p>
          </>
        );

      case "gym":
        return (
          <>
            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>
            <p className="text-sm text-gray-400">
              Membership Type: {service.membershipTypes}
            </p>
            <p className="text-sm text-gray-400">
              Facilities: {service.gymFacilities}
            </p>
            <p className="text-sm text-gray-400">
              Operating Hours: {service.operatingHours}
            </p>
            <p className="text-sm text-gray-400">Rating: {service.rating}</p>
          </>
        );

      case "salon":
        return (
          <>
            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>
            <p className="text-sm text-gray-400">
              Services Offered: {service.salonSpeciality}
            </p>
            <p className="text-sm text-gray-400">Rating: {service.rating}</p>

            {/* <p className="text-sm text-gray-400">
              Available Hours: {service.availableHours}
            </p> */}
          </>
        );
      case "hall":
        return (
          <>
            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>

            <p className="text-sm text-gray-400">
              Events Types: {service.eventType}
            </p>

            <p className="text-sm text-gray-400">
              Capacity: {service.hallCapacity}
            </p>
            <p className="text-sm text-gray-400">Rating: {service.rating}</p>
          </>
        );
      case "activity":
        return (
          <>
            {/* <p className="text-sm text-gray-400">
              Activity Time: {service.activityTime}
            </p> */}
            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>

            <p className="text-sm text-gray-400">
              Type: {service.activityType}
            </p>

            <p className="text-sm text-gray-400">Rating: {service.rating}</p>
          </>
        );
      case "flight":
        return (
          <>
            {/* <p className="text-sm text-gray-400">
              Flight Time: {service.flightTime}
            </p> */}
            <p className="text-sm text-gray-400">
              Airline name: {service.airlineName}
            </p>

            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>
            <p className="text-sm text-gray-400">
              Class: {service.flightClass}
            </p>
            <p className="text-sm text-gray-400">
              Seats Available: {service.seatsAvailable}
            </p>
            <p className="text-sm text-gray-400">Rating: {service.rating}</p>
          </>
        );
      case "playground":
        return (
          <>
            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>
            <p className="text-sm text-gray-400">
              Ground Type: {service.playgroundType}
            </p>

            <p className="text-sm text-gray-400">
              Age Group: {service.ageGroup}
            </p>

            <p className="text-sm text-gray-400">
              Equipment: {service.equipment}
            </p>

            <p className="text-sm text-gray-400">rating: {service.rating}</p>

            {/* <p className="text-sm text-gray-400">
              Playground Hours: {service.playgroundHours}
            </p> */}

            {/* <p className="text-sm text-gray-400">
              Capacity: {service.capacity}
            </p> */}
          </>
        );
      default:
        return <p>No additional details available for this service type.</p>;
    }
  };

  const handleReserveClick = (e, serviceId) => {
    router.push(`/reserve/${serviceId}`);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{`Services: ${
        serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
      }`}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.isArray(services) &&
          services.length > 0 &&
          services?.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={`/images/${serviceType}.jpg`}
                alt={service.name}
                className="w-full h-48 object-cover"
                onError={(e) => (e.target.src = "/fallback-image.jpg")}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                {renderServiceDetails(service)}
                <p className="text-sm text-gray-400">Price: ${service.price}</p>
                <button
                  className="mt-4 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none"
                  onClick={(e) => handleReserveClick(e, service.id)}
                >
                  Reserve Now
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
