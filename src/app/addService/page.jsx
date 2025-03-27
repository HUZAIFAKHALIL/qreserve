"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  MapPinIcon,
  DollarSignIcon,
  StarIcon,
  PlusCircleIcon,
  XCircleIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
} from "lucide-react";

const serviceTypes = [
  "hotel",
  "car",
  "gym",
  "salon",
  "hall",
  "activity",
  "playground",
  "flight",
  "restaurant"
];

export default function CreateServiceForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Base service data
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    description: "",
    location: "",
    rating: "0",
  });

  // Service specific rows
  const [hotelRows, setHotelRows] = useState([]);
  const [carRows, setCarRows] = useState([]);
  const [gymRows, setGymRows] = useState([]);
  const [salonRows, setSalonRows] = useState([]);
  const [hallRows, setHallRows] = useState([]);
  const [activityRows, setActivityRows] = useState([]);
  const [flightRows, setFlightRows] = useState([]);
  const [playgroundRows, setPlaygroundRows] = useState([]);
  const [restaurantRows, setRestaurantRows] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for adding a new row to a specific service type
  const addServiceRow = (serviceType) => {
    switch (serviceType) {
      case "hotel":
        setHotelRows([
          ...hotelRows,
          {
            roomType: "",
            amenities: "",
            hotelStars: "",
            noOfRooms: "",
            price: "",
          },
        ]);
        break;
      case "car":
        setCarRows([
          ...carRows,
          { carModel: "", carType: "", carCapacity: "", price: "" },
        ]);
        break;
      case "gym":
        setGymRows([
          ...gymRows,
          {
            gymFacilities: "",
            membershipTypes: "",
            operatingHours: "",
            price: "",
          },
        ]);
        break;
      case "salon":
        setSalonRows([...salonRows, { salonSpecialty: "", price: "" }]);
        break;
      case "hall":
        setHallRows([
          ...hallRows,
          { hallCapacity: "", eventType: "", price: "" },
        ]);
        break;
      case "activity":
        setActivityRows([...activityRows, { activityType: "", price: "" }]);
        break;
      case "flight":
        setFlightRows([
          ...flightRows,
          { airlineName: "", flightClass: "", seatsAvailable: "", price: "" },
        ]);
        break;
      case "playground":
        setPlaygroundRows([
          ...playgroundRows,
          { playgroundType: "", ageGroup: "", equipment: "", price: "" },
        ]);
        break;
      case "restaurant":
        setRestaurantRows([
          ...restaurantRows,
          { diningOption: "", numPersons: "", seatsAvailable: "", price: "" },
          ]);
        break;
      default:
        break;
    }
  };

  // Handler for removing a row from a specific service type
  const removeServiceRow = (serviceType, index) => {
    switch (serviceType) {
      case "hotel":
        setHotelRows(hotelRows.filter((_, i) => i !== index));
        break;
      case "car":
        setCarRows(carRows.filter((_, i) => i !== index));
        break;
      case "gym":
        setGymRows(gymRows.filter((_, i) => i !== index));
        break;
      case "salon":
        setSalonRows(salonRows.filter((_, i) => i !== index));
        break;
      case "hall":
        setHallRows(hallRows.filter((_, i) => i !== index));
        break;
      case "activity":
        setActivityRows(activityRows.filter((_, i) => i !== index));
        break;
      case "flight":
        setFlightRows(flightRows.filter((_, i) => i !== index));
        break;
      case "playground":
        setPlaygroundRows(playgroundRows.filter((_, i) => i !== index));
        break;
      case "restaurant":
        setRestaurantRows(restaurantRows.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
  };

  // Handler for updating a specific field in a row
  const updateRowField = (serviceType, index, field, value) => {
    switch (serviceType) {
      case "hotel":
        setHotelRows(
          hotelRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
          )
        );
        break;
      case "car":
        setCarRows(
          carRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
          )
        );
        break;
      case "gym":
        setGymRows(
          gymRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
          )
        );
        break;
      case "salon":
        setSalonRows(
          salonRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
          )
        );
        break;
      case "hall":
        setHallRows(
          hallRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
          )
        );
        break;
      case "activity":
        setActivityRows(
          activityRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
          )
        );
        break;
      case "flight":
        setFlightRows(
          flightRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
          )
        );
        break;
      case "playground":
        setPlaygroundRows(
          playgroundRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
          )
        );
        break;
      case "restaurant":
        setRestaurantRows(
          restaurantRows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
          )
        );
      break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const sellerId = localStorage.getItem("userId");
      if (!sellerId) {
        throw new Error("Please log in to create a service");
      }

      // Base service payload
      const servicePayload = {
        sellerId: parseInt(sellerId),
        type: formData.type,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        rating: parseFloat(formData.rating) || 0,
      };

      // Service-specific payloads based on type
      let specificServicePayloads = [];

      switch (formData.type) {
        case "hotel":
          specificServicePayloads = hotelRows.map((row) => ({
            roomType: row.roomType,
            amenities: row.amenities,
            hotelStars: row.hotelStars ? parseInt(row.hotelStars) : null,
            noOfRooms: row.noOfRooms ? parseInt(row.noOfRooms) : null,
            price: parseFloat(row.price) || 0,
          }));
          break;
        case "car":
          specificServicePayloads = carRows.map((row) => ({
            carModel: row.carModel,
            carType: row.carType,
            carCapacity: row.carCapacity ? parseInt(row.carCapacity) : 0,
            price: parseFloat(row.price) || 0,
          }));
          break;
        case "gym":
          specificServicePayloads = gymRows.map((row) => ({
            gymFacilities: row.gymFacilities,
            membershipTypes: row.membershipTypes,
            operatingHours: row.operatingHours,
            price: parseFloat(row.price) || 0,
          }));
          break;
        case "salon":
          specificServicePayloads = salonRows.map((row) => ({
            salonSpecialty: row.salonSpecialty,
            price: parseFloat(row.price) || 0,
          }));
          break;
        case "hall":
          specificServicePayloads = hallRows.map((row) => ({
            hallCapacity: row.hallCapacity ? parseInt(row.hallCapacity) : 0,
            eventType: row.eventType,
            price: parseFloat(row.price) || 0,
          }));
          break;
        case "activity":
          specificServicePayloads = activityRows.map((row) => ({
            activityType: row.activityType,
            price: parseFloat(row.price) || 0,
          }));
          break;
        case "flight":
          specificServicePayloads = flightRows.map((row) => ({
            airlineName: row.airlineName,
            flightClass: row.flightClass,
            seatsAvailable: row.seatsAvailable
              ? parseInt(row.seatsAvailable)
              : 0,
            price: parseFloat(row.price) || 0,
          }));
          break;
        case "playground":
          specificServicePayloads = playgroundRows.map((row) => ({
            playgroundType: row.playgroundType,
            ageGroup: row.ageGroup,
            equipment: row.equipment,
            price: parseFloat(row.price) || 0,
          }));
          break;
        case "restaurant":
          specificServicePayloads = restaurantRows.map((row) => ({
            diningOption: row.diningOption,
            numPersons: row.numPersons ? parseInt(row.numPersons) : 0,
            seatsAvailable: row.seatsAvailable ? parseInt(row.seatsAvailable) : 0,
            price: parseFloat(row.price) || 0,
          }));
          break;  
        default:
          break;
      }

      const payload = {
        service: servicePayload,
        specificServices: specificServicePayloads,
      };

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create service");
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service");
    } finally {
      setIsLoading(false);
    }
  };
  const renderPricingCategories = (serviceType) => (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Pricing Categories</h3>
        <button
          type="button"
          onClick={() => addPricingCategory(serviceType)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add Category
        </button>
      </div>
      {servicePricing[serviceType].map((category, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg relative"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={category.category}
              onChange={(e) =>
                handlePricingChange(
                  serviceType,
                  index,
                  "category",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded-md"
              placeholder={`e.g., ${getServiceSpecificPlaceholder(
                serviceType
              )}`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="flex items-center gap-2">
                <DollarSignIcon className="w-4 h-4" />
                Price
              </span>
            </label>
            <input
              type="number"
              value={category.price}
              onChange={(e) =>
                handlePricingChange(serviceType, index, "price", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Available Units
            </label>
            <input
              type="number"
              value={category.available}
              onChange={(e) =>
                handlePricingChange(
                  serviceType,
                  index,
                  "available",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded-md"
              placeholder="Optional"
              min="0"
            />
          </div>
          <button
            type="button"
            onClick={() => removePricingCategory(serviceType, index)}
            className="absolute -right-2 -top-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  const getServiceSpecificPlaceholder = (serviceType) => {
    const placeholders = {
      hotel: "Standard Room, Deluxe Suite",
      car: "SUV, Sedan",
      gym: "Basic Plan, Premium Membership",
      salon: "Haircut, Full Service",
      hall: "Wedding Package, Conference Hall",
      activity: "Group Tour, Private Session",
      restaurant: "Lunch Menu, Dinner Package",
      playground: "2-Hour Pass, Full Day Access",
      flight: "Economy, Business Class",
    };
    return placeholders[serviceType] || "Category Name";
  };

  const renderToggleButton = (serviceType) => (
    <button
      type="button"
      onClick={() => toggleServiceDetails(serviceType)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        serviceDetails[serviceType]
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
    >
      {serviceDetails[serviceType] ? (
        <>
          <XCircleIcon className="w-5 h-5" />
          Remove Details
        </>
      ) : (
        <>
          <PlusCircleIcon className="w-5 h-5" />
          Add Details
        </>
      )}
    </button>
  );

  const renderRestaurantFields = () => (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Restaurant Services</h3>
        <button
          type="button"
          onClick={() => addServiceRow("restaurant")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Dining Option
        </button>
      </div>
  
      {restaurantRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Dining Option</th>
                <th className="border px-4 py-2 text-left">Max Persons</th>
                <th className="border px-4 py-2 text-left">Seats Available</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurantRows.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <select
                      value={row.diningOption}
                      onChange={(e) =>
                        updateRowField(
                          "restaurant",
                          index,
                          "diningOption",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      required
                    >
                      <option value="" disabled>
                        Select option
                      </option>
                      <option value="INDOOR">Indoor</option>
                      <option value="OUTDOOR">Outdoor</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.numPersons}
                      onChange={(e) =>
                        updateRowField(
                          "restaurant",
                          index,
                          "numPersons",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Max number of people"
                      min="1"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.seatsAvailable}
                      onChange={(e) =>
                        updateRowField(
                          "restaurant",
                          index,
                          "seatsAvailable",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Number of available seats"
                      min="0"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        updateRowField("restaurant", index, "price", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeServiceRow("restaurant", index)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No restaurant services added yet. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  );
  

  const renderHotelFields = () => (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Hotel Services</h3>
        <button
          type="button"
          onClick={() => addServiceRow("hotel")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Hotel Room
        </button>
      </div>

      {hotelRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Room Type</th>
                <th className="border px-4 py-2 text-left">Amenities</th>
                <th className="border px-4 py-2 text-left">Stars</th>
                <th className="border px-4 py-2 text-left">No. of Rooms</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotelRows.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.roomType}
                      onChange={(e) =>
                        updateRowField(
                          "hotel",
                          index,
                          "roomType",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Standard, Deluxe, etc."
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.amenities}
                      onChange={(e) =>
                        updateRowField(
                          "hotel",
                          index,
                          "amenities",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="WiFi, Pool, etc."
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.hotelStars}
                      onChange={(e) =>
                        updateRowField(
                          "hotel",
                          index,
                          "hotelStars",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="1-5"
                      min="1"
                      max="5"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.noOfRooms}
                      onChange={(e) =>
                        updateRowField(
                          "hotel",
                          index,
                          "noOfRooms",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Number"
                      min="1"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        updateRowField("hotel", index, "price", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeServiceRow("hotel", index)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No hotel rooms added yet. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  );

  const renderCarFields = () => (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Car Services</h3>
        <button
          type="button"
          onClick={() => addServiceRow("car")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Car
        </button>
      </div>

      {carRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Car Model</th>
                <th className="border px-4 py-2 text-left">Car Type</th>
                <th className="border px-4 py-2 text-left">Capacity</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {carRows.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.carModel}
                      onChange={(e) =>
                        updateRowField("car", index, "carModel", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Toyota Camry, etc."
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.carType}
                      onChange={(e) =>
                        updateRowField("car", index, "carType", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Sedan, SUV, etc."
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.carCapacity}
                      onChange={(e) =>
                        updateRowField(
                          "car",
                          index,
                          "carCapacity",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Number of seats"
                      min="1"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        updateRowField("car", index, "price", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeServiceRow("car", index)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No cars added yet. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  );

  const renderGymFields = () => (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Gym Services</h3>
        <button
          type="button"
          onClick={() => addServiceRow("gym")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Gym Service
        </button>
      </div>

      {gymRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Facilities</th>
                <th className="border px-4 py-2 text-left">Membership Pass</th>
                <th className="border px-4 py-2 text-left">Operating Hours</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gymRows.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.gymFacilities}
                      onChange={(e) =>
                        updateRowField(
                          "gym",
                          index,
                          "gymFacilities",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Cardio, Weights, etc."
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                     <select
                      name="membershipTypes"
                      type="text"
                      value={row.membershipTypes}
                      onChange={(e) =>
                        updateRowField(
                          "gym",
                          index,
                          "membershipTypes",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Basic, Premium, etc."
                      required
                      >
                      <option value="" disabled selected>
                        Select pass
                      </option>
                      <option value="Day">One Day</option>
                      <option value="Month">One Month</option>
                      <option value="Year">One Year</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.operatingHours}
                      onChange={(e) =>
                        updateRowField(
                          "gym",
                          index,
                          "operatingHours",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="9AM-10PM"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        updateRowField("gym", index, "price", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeServiceRow("gym", index)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No gym services added yet. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  );

  const renderSalonFields = () => (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Salon Services</h3>
        <button
          type="button"
          onClick={() => addServiceRow("salon")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Salon Service
        </button>
      </div>

      {salonRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Specialty</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salonRows.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.salonSpecialty}
                      onChange={(e) =>
                        updateRowField(
                          "salon",
                          index,
                          "salonSpecialty",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Haircut, Facial, etc."
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        updateRowField("salon", index, "price", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeServiceRow("salon", index)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No salon services added yet. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  );

  const renderHallFields = () => (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Hall Services</h3>
        <button
          type="button"
          onClick={() => addServiceRow("hall")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Hall Service
        </button>
      </div>

      {hallRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Capacity</th>
                <th className="border px-4 py-2 text-left">Event Type</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hallRows.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.hallCapacity}
                      onChange={(e) =>
                        updateRowField(
                          "hall",
                          index,
                          "hallCapacity",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Number of people"
                      min="1"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.eventType}
                      onChange={(e) =>
                        updateRowField(
                          "hall",
                          index,
                          "eventType",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Wedding, Conference, etc."
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        updateRowField("hall", index, "price", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeServiceRow("hall", index)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No hall services added yet. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  );

  const renderActivityFields = () => (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Activity Services</h3>
        <button
          type="button"
          onClick={() => addServiceRow("activity")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Activity
        </button>
      </div>

      {activityRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Activity Type</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activityRows.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.activityType}
                      onChange={(e) =>
                        updateRowField(
                          "activity",
                          index,
                          "activityType",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Tour, Adventure, etc."
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        updateRowField(
                          "activity",
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeServiceRow("activity", index)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No Activity services added yet. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  );

  const renderFlightFields = () => (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Flight Services</h3>
        <button
          type="button"
          onClick={() => addServiceRow("flight")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Flight
        </button>
      </div>

      {flightRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Airline Name</th>
                <th className="border px-4 py-2 text-left">Flight Class</th>
                <th className="border px-4 py-2 text-left">Seats Available</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flightRows.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.airlineName}
                      onChange={(e) =>
                        updateRowField(
                          "flight",
                          index,
                          "airlineName",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Airline Name"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.flightClass}
                      onChange={(e) =>
                        updateRowField(
                          "flight",
                          index,
                          "flightClass",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Economy, Business, etc."
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.seatsAvailable}
                      onChange={(e) =>
                        updateRowField(
                          "flight",
                          index,
                          "seatsAvailable",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      min="1"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        updateRowField("flight", index, "price", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeServiceRow("flight", index)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No Flight services added yet. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  );

  const renderPlaygroundFields = () => (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Playground Services</h3>
        <button
          type="button"
          onClick={() => addServiceRow("playground")}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Playground
        </button>
      </div>

      {playgroundRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Playground Type</th>
                <th className="border px-4 py-2 text-left">Age Group</th>
                <th className="border px-4 py-2 text-left">Equipment</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {playgroundRows.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.playgroundType}
                      onChange={(e) =>
                        updateRowField(
                          "playground",
                          index,
                          "playgroundType",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Indoor, Outdoor, etc."
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.ageGroup}
                      onChange={(e) =>
                        updateRowField(
                          "playground",
                          index,
                          "ageGroup",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Toddler, Kids, Teens"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={row.equipment}
                      onChange={(e) =>
                        updateRowField(
                          "playground",
                          index,
                          "equipment",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="Slides, Swings, Climbing Wall"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        updateRowField(
                          "playground",
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      className="w-full p-1 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeServiceRow("playground", index)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            No Playground services added yet. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  );

  const renderServiceSpecificFields = () => {
    switch (formData.type.toLowerCase()) {
      case "hotel":
        return renderHotelFields();
      case "car":
        return renderCarFields();
      case "gym":
        return renderGymFields();
      case "salon":
        return renderSalonFields();
      case "hall":
        return renderHallFields();
      case "activity":
        return renderActivityFields();
      case "playground":
        return renderPlaygroundFields();
      case "flight":
        return renderFlightFields();
      case "restaurant":
        return renderRestaurantFields();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Create New Service
            </h2>
            <p className="mt-2 text-gray-600">
              Fill in the details below to create a new service listing.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md bg-white"
                  required
                >
                  <option value="">Select a type</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  placeholder="Describe your service"
                  required
                />
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <StarIcon className="w-4 h-4" />
                      Initial Rating
                    </span>
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="0.0"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    Location
                  </span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="" disabled selected>
                    Select a city in Qatar
                  </option>
                  <option value="Doha">Doha</option>
                  <option value="Al Wakrah">Al Wakrah</option>
                  <option value="Al Khor">Al Khor</option>
                  <option value="Al Rayyan">Al Rayyan</option>
                  <option value="Umm Salal">Umm Salal</option>
                  <option value="Al Daayen">Al Daayen</option>
                  <option value="Lusail">Lusail</option>
                  <option value="Mesaieed">Mesaieed</option>
                  <option value="Dukhan">Dukhan</option>
                  <option value="Al Shamal">Al Shamal</option>
                  <option value="Al Ruwais">Al Ruwais</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Available From
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    name="availableStartTime"
                    value={formData.availableStartTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Available Until
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    name="availableEndTime"
                    value={formData.availableEndTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
            </div>

            {renderServiceSpecificFields()}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Service..." : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
