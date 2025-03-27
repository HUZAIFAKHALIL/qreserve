import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");

  if (!sellerId) {
    return new Response(
      JSON.stringify({ message: "sellerId is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Fetch all services by seller
    const services = await prisma.service.findMany({
      where: { sellerId: parseInt(sellerId) }
    });

    
    const pendingServices = services.filter(service => (!service.isApproved  && !service.isRejected));
    const approvedServices = services.filter(service => (service.isApproved && !service.isRejected));
    const rejectedServices = services.filter(service => (!service.isApproved && service.isRejected));

    return new Response(
      JSON.stringify({ 
        pending: pendingServices,
        approved: approvedServices,
        rejected: rejectedServices,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching seller's services:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching services" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
