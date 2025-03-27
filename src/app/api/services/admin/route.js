// src\app\api\services\admin\route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(request) {

  try {
    
    const services = await prisma.service.findMany({});

    const pendingServices = services.filter(service => (!service.isApproved  && !service.isRejected));
    const approvedServices = services.filter(service => (service.isApproved && !service.isRejected));
    const rejectedServices = services.filter(service => (!service.isApproved && service.isRejected));

    
    return new Response(
      JSON.stringify({ 
        pending: pendingServices,
        approved: approvedServices, 
        rejected: rejectedServices
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
