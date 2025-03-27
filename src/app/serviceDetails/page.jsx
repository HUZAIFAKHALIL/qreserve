'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
    CalendarIcon, 
    MapPinIcon, 
    DollarSignIcon, 
    StarIcon, 
    ClockIcon, 
    UsersIcon, 
    ScissorsIcon,
    BuildingIcon,
    TreePineIcon,
    PlaneIcon,
    PlayIcon,
    UserIcon,
    PhoneIcon,
    MailIcon,
    CheckCircleIcon,
    UtensilsIcon,
    SaladIcon,
    XCircleIcon
} from 'lucide-react';

const ServiceDetail = () => {
    const [service, setService] = useState(null);
    const [specificServices, setSpecificServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const serviceID = searchParams.get('serviceID');
  
    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);


        console.log(serviceID)
        if (!serviceID) return;
    
        const fetchServiceDetails = async () => {
          try {
            const response = await fetch(`/api/services/${serviceID}`);
            if (!response.ok) {
              throw new Error('Failed to fetch service details');
            }
            const data = await response.json();
            console.log(data, "dsadssdsd")
            setService(data.service);
            setSpecificServices(data.specificService || []);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchServiceDetails();
      }, [serviceID]);

      if (loading) return <p className="text-center">Loading...</p>;
      if (!service) return <p className="text-center">Service not found</p>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleApproveService = async () => {
    try {
      const response = await fetch(`/api/services/${serviceID}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve service');
      }

      // Refresh service data after approval
      const data = await response.json();
      console.log("data", data);
      setService({...service,isApproved:true , isRejected: false });
    } catch (err) {
      console.error('Error approving service:', err);
    }
  };

  const handleRejectService = async () => {
    
    const confirmReject = window.confirm(
      "Are you sure you want to reject this service? This action cannot be undone."
    );
  
    if (!confirmReject) return;
  
    try {
      const response = await fetch(`/api/services/${serviceID}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to reject service. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Service rejection response:", data);
  
      setService({
        ...service, 
        isApproved: false,
        isRejected: true 
      });
  
      // Optional: Show a success notification to the user
      // You could use a toast library or custom notification system
      alert("Service has been successfully rejected.");
  
    } catch (error) {
      // Log the detailed error
      console.error('Error rejecting service:', error);
  
      // Optional: Show an error message to the user
      alert(`Failed to reject service: ${error.message}`);
    }
  };


  const renderHotelDetails = () => (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Hotel Details</h3>
      
      {specificServices.map((roomOption, index) => (
        <div key={index} className="p-4 border rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-lg capitalize">{roomOption.roomType} Room</h4>
            <div className="flex items-center gap-1">
              <span className="font-bold">QAR {roomOption.price}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Room Type</p>
              <p className="font-medium capitalize">{roomOption.roomType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Number of Rooms</p>
              <p className="font-medium">{roomOption.noOfRooms} available</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hotel Stars</p>
              <div className="flex items-center gap-1">
                {[...Array(parseInt(roomOption.hotelStars))].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Amenities</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {roomOption.amenities?.split(',').map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {amenity.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCarDetails = () => (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Car Details</h3>
      
      {specificServices.map((carOption, index) => (
        <div key={index} className="p-4 border rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-lg capitalize">{carOption.carModel}</h4>
            <div className="flex items-center gap-1">
              <span className="font-bold">QAR {carOption.price}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Car Model</p>
              <p className="font-medium">{carOption.carModel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Car Type</p>
              <p className="font-medium">{carOption.carType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-gray-400" />
                <p className="font-medium">{carOption.carCapacity} passengers</p>
              </div>
            </div>
            {carOption.features && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Features</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {carOption.features.split(',').map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {feature.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderGymDetails = () => (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Gym Details</h3>
      
      {specificServices.map((gymOption, index) => (
        <div key={index} className="p-4 border rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-lg capitalize">{gymOption.membershipType || "Membership"}</h4>
            <div className="flex items-center gap-1">
              <span className="font-bold">QAR {gymOption.price}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {gymOption.membershipType && (
              <div>
                <p className="text-sm text-gray-500">Membership Type</p>
                <p className="font-medium capitalize">{gymOption.membershipType}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Facilities</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {gymOption.gymFacilities?.split(',').map((facility, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {facility.trim()}
                  </span>
                ))}
              </div>
            </div>
            {gymOption.operatingHours && (
              <div>
                <p className="text-sm text-gray-500">Operating Hours</p>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{gymOption.operatingHours}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSalonDetails = () => (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Salon Details</h3>
      
      {specificServices.map((salonOption, index) => (
        <div key={index} className="p-4 border rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-lg capitalize">{salonOption.serviceType || "Service"}</h4>
            <div className="flex items-center gap-1">
              <span className="font-bold">QAR {salonOption.price}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {salonOption.serviceType && (
              <div>
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="font-medium capitalize">{salonOption.serviceType}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Specialties</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {salonOption.salonSpecialty?.split(',').map((specialty, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {specialty.trim()}
                  </span>
                ))}
              </div>
            </div>
            {salonOption.duration && (
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{salonOption.duration} minutes</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderHallDetails = () => (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Hall Details</h3>
      
      {specificServices.map((hallOption, index) => (
        <div key={index} className="p-4 border rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-lg capitalize">{hallOption.hallType || "Hall"}</h4>
            <div className="flex items-center gap-1">
              <span className="font-bold">QAR {hallOption.price}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hallOption.hallType && (
              <div>
                <p className="text-sm text-gray-500">Hall Type</p>
                <p className="font-medium capitalize">{hallOption.hallType}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-gray-400" />
                <p className="font-medium">{hallOption.hallCapacity} people</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderActivityDetails = () => (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Activity Details</h3>
      
      {specificServices.map((activityOption, index) => (
        <div key={index} className="p-4 border rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-lg capitalize">{activityOption.activityName || "Activity"}</h4>
            <div className="flex items-center gap-1">
              <span className="font-bold">QAR {activityOption.price}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm text-gray-500">Activity Type</p>
              <div className="flex items-center gap-2">
                <TreePineIcon className="w-4 h-4 text-gray-400" />
                <p className="font-medium">{activityOption.activityType}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRestaurantDetails = () => (
    <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Restaurant Details</h3>
        
        {specificServices.map((restaurantOption, index) => (
            <div key={index} className="p-4 border rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-lg">Dining Option</h4>
                    <div className="flex items-center gap-1">
                        <span className="font-bold">QAR {restaurantOption.price}</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Dining Type</p>
                        <div className="flex items-center gap-2">
                            <UtensilsIcon className="w-4 h-4 text-gray-400" />
                            <p className="font-medium capitalize">{restaurantOption.diningOption}</p>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <div className="flex items-center gap-2">
                            <UsersIcon className="w-4 h-4 text-gray-400" />
                            <p className="font-medium">{restaurantOption.numPersons} persons</p>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-sm text-gray-500">Available Seats</p>
                        <div className="flex items-center gap-2">
                            <SaladIcon className="w-4 h-4 text-gray-400" />
                            <p className="font-medium">{restaurantOption.seatsAvailable} seats</p>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);


  const renderPlaygroundDetails = () => (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Playground Details</h3>
      
      {specificServices.map((playgroundOption, index) => (
        <div key={index} className="p-4 border rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-lg capitalize">{playgroundOption.playgroundName || "Playground"}</h4>
            <div className="flex items-center gap-1">
              <span className="font-bold">QAR {playgroundOption.price}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm text-gray-500">Playground Type</p>
              <div className="flex items-center gap-2">
                <PlayIcon className="w-4 h-4 text-gray-400" />
                <p className="font-medium">{playgroundOption.playgroundType}</p>
              </div>
            </div>
            {playgroundOption.ageRange && (
              <div>
                <p className="text-sm text-gray-500">Age Range</p>
                <p className="font-medium">{playgroundOption.ageRange}</p>
              </div>
            )}
            {playgroundOption.features && (
              <div>
                <p className="text-sm text-gray-500">Features</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {playgroundOption.features.split(',').map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {feature.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderFlightDetails = () => (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Flight Details</h3>
      
      {specificServices.map((flightOption, index) => (
        <div key={index} className="p-4 border rounded-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-lg capitalize">{flightOption.classType || "Flight"}</h4>
            <div className="flex items-center gap-1">
              <span className="font-bold">QAR {flightOption.price}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Route</p>
              <div className="flex items-center gap-2">
                <PlaneIcon className="w-4 h-4 text-gray-400" />
                <p className="font-medium">{flightOption.route || service.location}</p>
              </div>
            </div>
            {flightOption.classType && (
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium capitalize">{flightOption.classType}</p>
              </div>
            )}
            {flightOption.departureTime && (
              <div>
                <p className="text-sm text-gray-500">Departure</p>
                <p className="font-medium">{formatDate(flightOption.departureTime)}</p>
              </div>
            )}
            {flightOption.arrivalTime && (
              <div>
                <p className="text-sm text-gray-500">Arrival</p>
                <p className="font-medium">{formatDate(flightOption.arrivalTime)}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const getServiceIcon = () => {
    switch (service?.type.toLowerCase()) {
      case 'hotel':
        return <BuildingIcon className="w-5 h-5" />;
      case 'car':
        return <UsersIcon className="w-5 h-5" />;
      case 'gym':
        return <UsersIcon className="w-5 h-5" />;
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

  const renderSellerDetails = () => (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Seller Details</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <UserIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Seller Name</p>
            <p className="font-medium">{service.seller.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <PhoneIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Contact Number</p>
            <p className="font-medium">{service.seller.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MailIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{service.seller.email}</p>
          </div>
        </div>

        {!service.isApproved && !service.isRejected && (
          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={handleApproveService}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircleIcon className="w-5 h-5" />
              Approve Service
            </button>
            <button
              onClick={handleRejectService}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircleIcon className="w-5 h-5" />
              Reject Service
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderServiceSpecificDetails = () => {
    if (specificServices.length === 0) {
      return (
        <div className="border-t pt-4">
          <p>No specific options available for this service.</p>
        </div>
      );
    }
    
    switch (service.type.toLowerCase()) {
      case 'hotel':
        return renderHotelDetails();
      case 'car':
        return renderCarDetails();
      case 'gym':
        return renderGymDetails();
      case 'salon':
        return renderSalonDetails();
      case 'hall':
        return renderHallDetails();
      case 'activity':
        return renderActivityDetails();
      case 'flight':
        return renderFlightDetails();
      case 'playground':
        return renderPlaygroundDetails();
      case 'restaurant':
          return renderRestaurantDetails();
      default:
        return (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold">{service.type} Options</h3>
            {specificServices.map((option, index) => (
              <div key={index} className="p-4 border rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-lg">Option {index + 1}</h4>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">QAR {option.price}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(option).map(([key, value]) => {
                    if (key === 'id' || key === 'serviceId' || key === 'price') return null;
                    
                    return (
                      <div key={key}>
                        <p className="text-sm text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  // Calculate lowest price from specific services if available
  const getLowestPrice = () => {
    if (specificServices && specificServices.length > 0) {
      const prices = specificServices.map(item => item.price || 0);
      return Math.min(...prices);
    }
    return service.price || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getServiceIcon()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {service.type}
                  </p>
                  <h1 className="text-3xl font-bold mt-1">{service.name}</h1>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">{service.rating}</span>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-6">
            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-gray-600">{service.description}</p>
            </div>

            {/* Price and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm text-gray-500">Starting Price</p>
                  <p className="font-semibold">QAR {getLowestPrice()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{service.location}</p>
                </div>
              </div>
            </div>

            {/* Service Status Badge */}
            <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                service.isApproved && !service.isRejected
                  ? 'bg-green-100 text-green-800' // Approved
                  : service.isRejected && !service.isApproved
                  ? 'bg-red-100 text-red-800' // Rejected
                  : 'bg-yellow-100 text-yellow-800' // Pending Approval
              }`}
            >
              {service.isApproved && !service.isRejected
                ? 'Approved'
                : service.isRejected && !service.isApproved
                ? 'Rejected'
                : 'Pending Approval'}
            </span>
          </div>

            {/* Availability */}
            {service.availableStartTime && service.availableEndTime && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Available From</p>
                      <p className="font-medium">
                        {formatDate(service.availableStartTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Available Until</p>
                      <p className="font-medium">
                        {formatDate(service.availableEndTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Service Specific Details */}
            {renderServiceSpecificDetails()}

            {userRole === 'ADMIN' && renderSellerDetails()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;