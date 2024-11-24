import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  let { id } = params; // Extract the 'id' from the URL parameters
  console.log("id is: ", id);

  // Check if the id is valid, and convert it to an integer
  id = parseInt(id, 10);

  // Validate if id is a valid number
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
    // Fetch the service based on the extracted 'id'
    const service = await prisma.service.findUnique({
      where: { id: id },
    });

    console.log("Service is: ", service);

    if (!service) {
      return new Response(JSON.stringify({ error: "Service not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(service), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch service details" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
