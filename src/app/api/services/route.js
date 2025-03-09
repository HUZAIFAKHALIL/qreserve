import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getServiceInclude(serviceType) {
  switch (serviceType) {
    case "hotel":
      return { hotelServices: true };
    case "car":
      return { carServices: true };
    case "gym":
      return { gymServices: true };
    case "salon":
      return { salonServices: true };
    case "hall":
      return { hallServices: true };
    case "activity":
      return { activityServices: true };
    case "flight":
      return { flightServices: true };
    case "playground":
      return { playgroundServices: true };
    default:
      return {}; // Return no additional relations for an unknown type
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const serviceType = searchParams.get("serviceType");

  if (!serviceType) {
    return new Response(
      JSON.stringify({ message: "serviceType is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const services = await prisma.service.findMany({
      where: {
        type: serviceType,
      },
      include: getServiceInclude(serviceType)
    });

    const transformedServices = services.map(service => {
      const specificServiceKey = Object.keys(service).find(key => key.endsWith("Services"));
      const { [specificServiceKey]: specificService, ...rest } = service;
      return {
        ...rest,
        specificService: specificService || null, 
      };
    });
    return new Response(JSON.stringify(transformedServices), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching services" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


export async function POST(request) {
  try {
    const body = await request.json();
    const { service, specificServices } = body;

    // Validate required fields
    if (!service.sellerId || !service.type || !service.name) {
      return new Response(
        JSON.stringify({ message: "sellerId, type, and name are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create base Service
    const newService = await prisma.service.create({
      data: {
        sellerId: service.sellerId,
        type: service.type,
        name: service.name,
        description: service.description,
        location: service.location,
        rating: service.rating ?? null,
        isApproved: false, // Admin approval required
      },
    });

    // Insert into the respective service-specific model
    if (specificServices.length > 0) {
      switch (service.type) {
        case "hotel":
          await prisma.hotelService.createMany({
            data: specificServices.map(row => ({
              serviceId: newService.id,
              roomType: row.roomType,
              amenities: row.amenities ?? null,
              hotelStars: row.hotelStars ? parseInt(row.hotelStars) : null,
              noOfRooms: row.noOfRooms ? parseInt(row.noOfRooms) : null,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "car":
          await prisma.carService.createMany({
            data: specificServices.map(row => ({
              serviceId: newService.id,
              carModel: row.carModel,
              carType: row.carType,
              carCapacity: row.carCapacity ? parseInt(row.carCapacity) : 0,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "gym":
          await prisma.gymService.createMany({
            data: specificServices.map(row => ({
              serviceId: newService.id,
              gymFacilities: row.gymFacilities ?? null,
              membershipTypes: row.membershipTypes ?? null,
              operatingHours: row.operatingHours ?? null,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "salon":
          await prisma.salonService.createMany({
            data: specificServices.map(row => ({
              serviceId: newService.id,
              salonSpecialty: row.salonSpecialty,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "hall":
          await prisma.hallService.createMany({
            data: specificServices.map(row => ({
              serviceId: newService.id,
              hallCapacity: row.hallCapacity ? parseInt(row.hallCapacity) : 0,
              eventType: row.eventType,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "activity":
          await prisma.activityService.createMany({
            data: specificServices.map(row => ({
              serviceId: newService.id,
              activityType: row.activityType,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "flight":
          await prisma.flightService.createMany({
            data: specificServices.map(row => ({
              serviceId: newService.id,
              airlineName: row.airlineName,
              flightClass: row.flightClass,
              seatsAvailable: row.seatsAvailable ? parseInt(row.seatsAvailable) : 0,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "playground":
          await prisma.playgroundService.createMany({
            data: specificServices.map(row => ({
              serviceId: newService.id,
              playgroundType: row.playgroundType,
              ageGroup: row.ageGroup ?? null,
              equipment: row.equipment ?? null,
              price: parseFloat(row.price),
            })),
          });
          break;

        default:
          return new Response(
            JSON.stringify({ message: "Invalid service type" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
      }
    }

    return new Response(
      JSON.stringify({ message: "Service created successfully", service: newService }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error creating service:", error);
    return new Response(
      JSON.stringify({ message: "Error creating service", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

