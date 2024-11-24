import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to validate and parse numbers
const validateNumber = (value, defaultValue) =>
  value === "" || isNaN(value) ? defaultValue : parseFloat(value);

export async function GET(request) {
  const url = new URL(request.url);
  const queryParams = new URLSearchParams(url.search);

  console.log("url: ", url);
  console.log("query params: ", queryParams);
  // Get query parameters with default values
  const query = queryParams.get("query") || ""; // Search text
  const location = queryParams.get("location") || "";
  const minPrice = validateNumber(queryParams.get("minPrice"), 0.0);
  const maxPrice = validateNumber(queryParams.get("maxPrice"), 1000.0);
  const rating = validateNumber(queryParams.get("rating"), 0.0);

  console.log(query, location, minPrice, maxPrice, rating);
  try {
    // Define filters and conditions
    const filters = {};
    const conditions = [];

    // Search text filter
    if (query) {
      conditions.push({
        OR: [
          { type: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      });
    }

    // Location filter (partial match)
    if (location) {
      conditions.push({
        location: { contains: location, mode: "insensitive" },
      });
    }

    // Price range filter
    conditions.push({
      price: { gte: minPrice, lte: maxPrice },
    });

    // Rating filter
    if (rating > 0) {
      conditions.push({ rating: { gte: rating } });
    }

    // Apply the conditions if any
    if (conditions.length > 0) {
      filters.AND = conditions;
    }

    // Query the database using Prisma
    const items = await prisma.service.findMany({
      where: filters,
      orderBy: { createdAt: "desc" }, // Optional: Order by creation date
    });

    // Return successful response
    return new Response(JSON.stringify({ success: true, data: items }), {
      status: 200,
    });
  } catch (error) {
    // Handle any errors during query execution
    console.error("Error fetching search results:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
