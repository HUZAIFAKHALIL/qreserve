"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { BuildingIcon, UsersIcon, ScissorsIcon, TreePineIcon, PlaneIcon, PlayIcon, StarIcon, MapPinIcon, CalendarIcon, ClockIcon, WifiIcon, SchoolIcon as PoolIcon, DumbbellIcon, CoffeeIcon, UtensilsIcon, GamepadIcon, CheckCircleIcon, ArrowRightToLine } from 'lucide-react';
import data from "@/data/services.json";

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
      notFound();
    }
  }, [serviceType]);

  const getServiceIcon = (type) => {
    switch (type.toLowerCase()) {
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
        return <StarIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLowestPrice = (service) => {
    if (service.specificService && service.specificService.length > 0) {
      const prices = service.specificService.map(item => item.price || 0);
      return Math.min(...prices);
    }
    return service.price || 'N/A';
  };

  const getFeatureIcon = (feature, type) => {
    const featureLower = feature.toLowerCase().trim();
    switch (featureLower) {
      case 'wifi':
        return <WifiIcon className="w-3 h-3" />;
      case 'pool':
        return <PoolIcon className="w-3 h-3" />;
      case 'gym':
        return <DumbbellIcon className="w-3 h-3" />;
      case 'restaurant':
        return <UtensilsIcon className="w-3 h-3" />;
      case 'coffee':
        return <CoffeeIcon className="w-3 h-3" />;
      case 'games':
        return <GamepadIcon className="w-3 h-3" />;
      default:
        return <CheckCircleIcon className="w-3 h-3" />;
    }
  };

  const renderServiceDetails = (service) => {
    switch (service.type) {
      case "hotel":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">{service.location}</p>
            </div>
            {service.specificService && service.specificService.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.specificService.map((room, idx) => (
                  <div key={idx} className="w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{room.roomType} Room</span>
                      <span className="text-sm font-semibold">QAR {room.price}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{room.noOfRooms} rooms available</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(room.hotelStars)].map((_, i) => (
                        <StarIcon key={i} className="w-3 h-3 text-yellow-400" />
                      ))}
                    </div>
                    {room.amenities && (
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.split(',').map((amenity, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {getFeatureIcon(amenity, 'hotel')}
                            {amenity.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "car":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">{service.location}</p>
            </div>
            {service.specificService && service.specificService.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.specificService.map((car, idx) => (
                  <div key={idx} className="w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{car.carModel}</span>
                      <span className="text-sm font-semibold">QAR {car.price}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{car.carCapacity} passengers</span>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{car.rentalDuration}h</span>
                      </div> */}
                    </div>
                    {car.features && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {car.features.split(',').map((feature, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {getFeatureIcon(feature, 'car')}
                            {feature.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "gym":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">{service.location}</p>
            </div>
            {service.specificService && service.specificService.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.specificService.map((membership, idx) => (
                  <div key={idx} className="w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{membership.membershipType}</span>
                      <span className="text-sm font-semibold">QAR {membership.price}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{membership.operatingHours}</span>
                    </div>
                    {membership.gymFacilities && (
                      <div className="flex flex-wrap gap-2">
                        {membership.gymFacilities.split(',').map((facility, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {getFeatureIcon(facility, 'gym')}
                            {facility.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "salon":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">{service.location}</p>
            </div>
            {service.specificService && service.specificService.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.specificService.map((salonService, idx) => (
                  <div key={idx} className="w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{salonService.serviceType}</span>
                      <span className="text-sm font-semibold">QAR {salonService.price}</span>
                    </div>
                    {/* <div className="flex items-center gap-2 mb-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{salonService.duration} minutes</span>
                    </div> */}
                    {salonService.salonSpecialty && (
                      <div className="flex flex-wrap gap-2">
                        {salonService.salonSpecialty.split(',').map((specialty, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {getFeatureIcon(specialty, 'salon')}
                            {specialty.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "flight":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PlaneIcon className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">{service.route || service.location}</p>
            </div>
            {service.specificService && service.specificService.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.specificService.map((flight, idx) => (
                  <div key={idx} className="w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{flight.flightClass} Class</span>
                      <span className="text-sm font-semibold">QAR {flight.price}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <PlaneIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Flight Name: {flight.airlineName}
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Arrival: {formatDate(flight.arrivalTime)}
                        </span>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "hall":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">{service.location}</p>
            </div>
            {service.specificService && service.specificService.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.specificService.map((hall, idx) => (
                  <div key={idx} className="w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{hall.hallType}</span>
                      <span className="text-sm font-semibold">QAR {hall.price}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <UsersIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Capacity: {hall.hallCapacity} people</span>
                    </div>
                    {hall.features && (
                      <div className="flex flex-wrap gap-2">
                        {hall.features.split(',').map((feature, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {getFeatureIcon(feature, 'hall')}
                            {feature.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "activity":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">{service.location}</p>
            </div>
            {service.specificService && service.specificService.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.specificService.map((activity, idx) => (
                  <div key={idx} className="w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{activity.activityName}</span>
                      <span className="text-sm font-semibold">QAR {activity.price}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <TreePineIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{activity.activityType}</span>
                    </div>
                    {activity.features && (
                      <div className="flex flex-wrap gap-2">
                        {activity.features.split(',').map((feature, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {getFeatureIcon(feature, 'activity')}
                            {feature.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "playground":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">{service.location}</p>
            </div>
            {service.specificService && service.specificService.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {service.specificService.map((playground, idx) => (
                  <div key={idx} className="w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{playground.playgroundName}</span>
                      <span className="text-sm font-semibold">QAR {playground.price}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <PlayIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{playground.playgroundType}</span>
                      </div>
                      {playground.ageRange && (
                        <div className="flex items-center gap-2">
                          <UsersIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Ages: {playground.ageRange}</span>
                        </div>
                      )}
                    </div>
                    {playground.features && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {playground.features.split(',').map((feature, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {getFeatureIcon(feature, 'playground')}
                            {feature.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">{service.location}</p>
            </div>
            {service.availableStartTime && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Available from {formatDate(service.availableStartTime)}
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!isValidServiceType || services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg font-medium">No services found for this type.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-white rounded-lg shadow">
            {getServiceIcon(serviceType)}
          </div>
          <h1 className="text-3xl font-bold">
            {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Services
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(services) && services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              <img
                src={`/images/${serviceType}.jpg`}
                alt={service.name}
                className="w-full h-48 object-cover"
                onError={(e) => (e.target.src = "/fallback-image.jpg")}
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">{service.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                {renderServiceDetails(service)}

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">From</span>
                    <span className="text-lg font-bold">QAR {getLowestPrice(service)}</span>
                  </div>
                  <button
                    onClick={() => router.push(`/reserve/${service.id}`)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}