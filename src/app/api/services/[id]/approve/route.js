import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  let { id } = params; // Extract the 'id' from the URL parameters
  console.log("Received ID for approval:", id);

  id = parseInt(id, 10);

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
    const updatedService = await prisma.service.update({
      where: { id: id },
      data: { isApproved: true },
    });

    console.log("Service updated:", updatedService);

    return new Response(JSON.stringify({ message: "Service approved successfully", service: updatedService }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update service approval status" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
