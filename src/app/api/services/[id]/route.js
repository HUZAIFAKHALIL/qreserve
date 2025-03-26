import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(request, { params }) {
  try {
    const { id } = params;
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
      include: {
        seller: true,
      },
    });

    if (!service) {
      return new Response(
        JSON.stringify({ message: "Service not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    let specificService = null;

    switch (service.type) {
      case "hotel":
        specificService = await prisma.hotelService.findMany({ where: { serviceId: service.id } });
        break;
      case "car":
        specificService = await prisma.carService.findMany({ where: { serviceId: service.id } });
        break;
      case "gym":
        specificService = await prisma.gymService.findMany({ where: { serviceId: service.id } });
        break;
      case "salon":
        specificService = await prisma.salonService.findMany({ where: { serviceId: service.id } });
        break;
      case "hall":
        specificService = await prisma.hallService.findMany({ where: { serviceId: service.id } });
        break;
      case "activity":
        specificService = await prisma.activityService.findMany({ where: { serviceId: service.id } });
        break;
      case "flight":
        specificService = await prisma.flightService.findMany({ where: { serviceId: service.id } });
        break;
      case "playground":
        specificService = await prisma.playgroundService.findMany({ where: { serviceId: service.id } });
        break;
      case "restaurant":
        specificService = await prisma.restaurantService.findMany({ where: { serviceId: service.id } });
        break;
      default:
        return new Response(
          JSON.stringify({ message: "Invalid service type" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({ service, specificService }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error fetching service:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching service", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

