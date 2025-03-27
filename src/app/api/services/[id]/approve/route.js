import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';


const prisma = new PrismaClient();


async function sendServiceApprovalEmail(service) {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    // Find seller information (adjust based on your actual schema)
    const seller = await prisma.user.findUnique({
      where: { id: service.sellerId },
      select: { email: true, name: true }
    });

    // If no seller found, use a fallback email
    if (!seller || !seller.email) {
      console.warn(`No email found for seller ID: ${service.sellerId}`);
      
      const fallbackMailOptions = {
        from: "no-reply@qreserve.com",
        to: "support@qreserve.com",
        subject: "Service Approval Without Seller Contact",
        text: `A service was approved without a valid seller email.
        
Service Details:
- ID: ${service.id}
- Type: ${service.type}
- Name: ${service.name}
- Seller ID: ${service.sellerId}`
      };

      try {
        await transporter.sendMail(fallbackMailOptions);
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
      subject: "Service Approval Confirmation",
      text: `Dear ${seller.name || 'Seller'},

Congratulations! Your service "${service.name}" has been approved.

Service Details:
- Type: ${service.type}
- Name: ${service.name}
- Location: ${service.location || 'Not specified'}

Status: Approved

Your service is now live on QReserve. You can now start receiving bookings and managing your service.

Thank you for using QReserve!

Best regards,
QReserve Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Service Approval Confirmation</h2>
          <p>Dear ${seller.name || 'Seller'},</p>
          <p>Congratulations! Your service "${service.name}" has been approved.</p>
          
          <h3>Service Details:</h3>
          <ul>
            <li><strong>Type:</strong> ${service.type}</li>
            <li><strong>Name:</strong> ${service.name}</li>
            <li><strong>Location:</strong> ${service.location || 'Not specified'}</li>
          </ul>
          
          <p><strong>Status:</strong> Approved</p>
          
          <p>Your service is now live on QReserve. You can now start receiving bookings and managing your service.</p>
          
          <p>Thank you for using QReserve!</p>
          
          <p>Best regards,<br>QReserve Team</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${seller.email} for service ${service.name}`);

  } catch (error) {
    console.error("Error in sendServiceApprovalEmail:", error);
  }
}



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
    // Fetch the service before updating to get full details
    const existingService = await prisma.service.findUnique({
      where: { id: id }
    });

    if (!existingService) {
      return new Response(
        JSON.stringify({ error: "Service not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update service approval status
    const updatedService = await prisma.service.update({
      where: { id: id },
      data: { 
        isApproved: true,
        isRejected: false 
      },
    });

    console.log("Service updated:", updatedService);

    // Send approval email (without awaiting to prevent blocking)
    sendServiceApprovalEmail(updatedService).catch(console.error);

    return new Response(JSON.stringify({ 
      message: "Service approved successfully", 
      service: updatedService 
    }), {
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
