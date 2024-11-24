import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        type: serviceType, // Filter based on serviceType
      },
    });

    return new Response(JSON.stringify(services), {
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
