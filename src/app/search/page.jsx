"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const serviceTypeToService = {
  hotel: "hotel",
  car: "car",
  salon: "salon",
  gym: "gym",
  hall: "hall",
  activity: "activity",
  flight: "flight",
  playground: "playground",
};

const categories = {
  travel: ["car", "flight"],
  events: ["hall"],
  services: ["activity", "salon", "hotel", "gym", "playground"],
};

export default function SearchService() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const queryParams = Object.fromEntries(searchParams.entries());
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryString = new URLSearchParams(queryParams).toString();
        const response = await fetch(`/api/search?${queryString}`);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const res = await response.json();
        const data = res.data;

        console.log("data before filter is: ", data);
        const filteredData = data.filter((product) => {
          if (category === "all") return true;
          else {
            if (category === "travel") {
              if (product.type === "car" || product.type === "flight")
                return true;
            } else if (categories === "events") {
              if (product.type === "hall") return true;
            } else if (category === "services") {
              console.log("in category service");
              if (
                product.type === "activity" ||
                product.type === "salon" ||
                product.type === "hotel" ||
                product.type === "gym" ||
                product.type === "playground"
              )
                return true;
            }
          }
        });

        console.log("data after filter is: ", filteredData);

        setResults(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, searchParams]);

  const handleReserveClick = (e, serviceId) => {
    router.push(`/reserve/${serviceId}`);
  };

  const renderServiceDetails = (service) => {
    switch (service.type) {
      case "hotel":
        return (
          <>
            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>
            <p className="text-sm text-gray-400">
              Room Type: {service.roomType}
            </p>
            <p className="text-sm text-gray-400">
              Amenities: {service.amenities}
            </p>
          </>
        );
      case "car":
        return (
          <>
            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>
            <p className="text-sm text-gray-400">Car Type: {service.carType}</p>
            <p className="text-sm text-gray-400">
              Rental Duration: {service.rentalDuration} hours
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
          </>
        );
      case "activity":
        return (
          <>
            <p className="text-sm text-gray-400">
              Location: {service.location}
            </p>
            <p className="text-sm text-gray-400">
              Type: {service.activityType}
            </p>
          </>
        );
      case "flight":
        return (
          <>
            <p className="text-sm text-gray-400">
              Airline Name: {service.airlineName}
            </p>
            <p className="text-sm text-gray-400">
              Class: {service.flightClass}
            </p>
            <p className="text-sm text-gray-400">
              Seats Available: {service.seatsAvailable}
            </p>
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
          </>
        );
      default:
        return <p>No additional details available for this service type.</p>;
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      {results && results.length > 0 ? (
        <>
          <h1 className="text-xl mb-4">
            Number of services found: {results.length}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((service) => {
              const serviceType = serviceTypeToService[service.type];
              return (
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
                    <h3 className="text-xl font-semibold mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    {renderServiceDetails(service)}
                    <p className="text-sm text-gray-400">
                      Price: ${service.price}
                    </p>
                    <div className="h-full flex flex-col">
                      <button
                        className="mt-4 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none justify-end"
                        onClick={(e) => handleReserveClick(e, service.id)}
                      >
                        Reserve Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
