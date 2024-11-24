const { PrismaClient } = require("@prisma/client");
const { services } = require("../src/data/services.json");

const prisma = new PrismaClient();

async function addServicesFromJson() {
  try {
    // const services = JSON.parse(data);
    // Insert services into the Service table
    const createdServices = await prisma.service.createMany({
      data: services,
    });

    console.log("Services added successfully:", createdServices);
  } catch (error) {
    console.error("Error adding services:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the function
addServicesFromJson();
