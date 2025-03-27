import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  let { id } = params; // Extract the 'id' from the URL parameters
  console.log("Received ID for rejection:", id);

  // Convert id to integer
  id = parseInt(id, 10);

  // Validate the ID
  if (isNaN(id)) {
    return new Response(
      JSON.stringify({ error: "ID parameter must be a valid number" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Update the service with isRejected set to true
    const updatedService = await prisma.service.update({
      where: { id: id },
      data: { 
        isApproved: false,  // Ensure it's not approved
        isRejected: true    // Set rejection status to true
      },
    });

    console.log("Service updated:", updatedService);

    return new Response(
      JSON.stringify({ 
        message: "Service rejected successfully", 
        service: updatedService 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating service rejection status:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update service rejection status" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}