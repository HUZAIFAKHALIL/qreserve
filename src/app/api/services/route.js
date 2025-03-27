// src\app\api\services\route.js
import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';

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
    case "restaurant":
      return { RestaurantService: true }; 
    default:
      return {}; // Return no additional relations for an unknown type
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  console.log(searchParams, "djang");
  const serviceType = searchParams.get("serviceType");

  console.log(serviceType);

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
    // Add a preliminary check to see if any services exist
    const serviceCount = await prisma.service.count({
      where: { type: serviceType },
    });
    console.log(`Number of ${serviceType} services:`, serviceCount);

    const services = await prisma.service.findMany({
      where: {
        type: serviceType,
      },
      include: getServiceInclude(serviceType),
    });

    console.log('Raw services:', JSON.stringify(services, null, 2));

    const transformedServices = services.map((service) => {
      const specificServiceKey = Object.keys(service).find((key) =>
        key.endsWith("Services")
      );
      const { [specificServiceKey]: specificService, ...rest } = service;
      return {
        ...rest,
        specificService: specificService || null,
      };
    });

    console.log(
      "Transformed services:",
      JSON.stringify(transformedServices, null, 2)
    );

    return new Response(JSON.stringify(transformedServices), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Detailed Error fetching services:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching services",
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function sendServiceCreationEmail(service) {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Check if sellerId exists and is valid
  if (!service.sellerId) {
    console.error("No seller ID provided");
    return;
  }

  try {
    // Attempt to find seller information
    // Note: You'll need to adjust this based on your actual Prisma schema
    const seller = await prisma.user.findUnique({
      where: { id: service.sellerId },
      select: { email: true, name: true }
    });

    // If no seller found, use a fallback email
    if (!seller || !seller.email) {
      console.warn(`No email found for seller ID: ${service.sellerId}`);
      
      // Fallback email options
      const mailOptions = {
        from: "no-reply@qreserve.com",
        to: "support@qreserve.com", // Fallback email
        subject: "Service Submission Without Seller Email",
        text: `A service was submitted without a valid seller email.
        
Service Details:
- ID: ${service.id}
- Type: ${service.type}
- Name: ${service.name}
- Seller ID: ${service.sellerId}`
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (fallbackError) {
        console.error("Error sending fallback email:", fallbackError);
      }
      
      return;
    }

    // Prepare email options
    const mailOptions = {
      from: "no-reply@qreserve.com",
      to: seller.email,
      cc: "huzaifa.hado@gmail.com",
      subject: "Service Submission Confirmation",
      text: `Dear ${seller.name || 'Seller'},

Your service "${service.name}" has been submitted successfully and is currently pending admin approval.

Service Details:
- Type: ${service.type}
- Name: ${service.name}
- Location: ${service.location || 'Not specified'}

Status: Waiting for Admin Review

Our team will review your service and notify you once it is approved or if any changes are required.

Thank you for using QReserve!

Best regards,
QReserve Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Service Submission Confirmation</h2>
          <p>Dear ${seller.name || 'Seller'},</p>
          <p>Your service "${service.name}" has been submitted successfully and is currently pending admin approval.</p>
          
          <h3>Service Details:</h3>
          <ul>
            <li><strong>Type:</strong> ${service.type}</li>
            <li><strong>Name:</strong> ${service.name}</li>
            <li><strong>Location:</strong> ${service.location || 'Not specified'}</li>
          </ul>
          
          <p><strong>Status:</strong> Waiting for Admin Review</p>
          
          <p>Our team will review your service and notify you once it is approved or if any changes are required.</p>
          
          <p>Thank you for using QReserve!</p>
          
          <p>Best regards,<br>QReserve Team</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${seller.email} for service ${service.name}`);

  } catch (error) {
    console.error("Error in sendServiceCreationEmail:", error);
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
        isRejected: false,
      },
    });

    // Insert into the respective service-specific model
    if (specificServices.length > 0) {
      switch (service.type) {
        case "hotel":
          await prisma.hotelService.createMany({
            data: specificServices.map((row) => ({
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
            data: specificServices.map((row) => ({
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
            data: specificServices.map((row) => ({
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
            data: specificServices.map((row) => ({
              serviceId: newService.id,
              salonSpecialty: row.salonSpecialty,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "hall":
          await prisma.hallService.createMany({
            data: specificServices.map((row) => ({
              serviceId: newService.id,
              hallCapacity: row.hallCapacity ? parseInt(row.hallCapacity) : 0,
              eventType: row.eventType,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "activity":
          await prisma.activityService.createMany({
            data: specificServices.map((row) => ({
              serviceId: newService.id,
              activityType: row.activityType,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "flight":
          await prisma.flightService.createMany({
            data: specificServices.map((row) => ({
              serviceId: newService.id,
              airlineName: row.airlineName,
              flightClass: row.flightClass,
              seatsAvailable: row.seatsAvailable
                ? parseInt(row.seatsAvailable)
                : 0,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "playground":
          await prisma.playgroundService.createMany({
            data: specificServices.map((row) => ({
              serviceId: newService.id,
              playgroundType: row.playgroundType,
              ageGroup: row.ageGroup ?? null,
              equipment: row.equipment ?? null,
              price: parseFloat(row.price),
            })),
          });
          break;

        case "restaurant":
          await prisma.restaurantService.createMany({
            data: specificServices.map((row) => ({
              serviceId: newService.id,
              diningOption: row.diningOption,
              numPersons: row.numPersons ? parseInt(row.numPersons) : 0,
              seatsAvailable: row.seatsAvailable
                ? parseInt(row.seatsAvailable)
                : 0,
              price: parseFloat(row.price || 0),
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

    sendServiceCreationEmail(newService).catch(console.error);

    
    return new Response(
      JSON.stringify({
        message: "Service created successfully",
        service: newService,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating service:", error);
    return new Response(
      JSON.stringify({
        message: "Error creating service",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
