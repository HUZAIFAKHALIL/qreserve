import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Function to send service rejection email
async function sendServiceRejectionEmail(service, rejectionReason) {
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
        subject: "Service Rejection Without Seller Contact",
        text: `A service was rejected without a valid seller email.
        
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
      subject: "Service Rejection Notification",
      text: `Dear ${seller.name || 'Seller'},

We regret to inform you that your service "${service.name}" has been rejected.

Service Details:
- Type: ${service.type}
- Name: ${service.name}
- Location: ${service.location || 'Not specified'}

Rejection Reason: ${rejectionReason || 'No specific reason provided'}

Our team has reviewed your service and determined that it does not meet our current requirements. 
Please review the details and make necessary improvements before resubmitting.

If you have any questions or need clarification, please contact our support team.

Thank you for your understanding,
QReserve Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Service Rejection Notification</h2>
          <p>Dear ${seller.name || 'Seller'},</p>
          <p>We regret to inform you that your service "${service.name}" has been rejected.</p>
          
          <h3>Service Details:</h3>
          <ul>
            <li><strong>Type:</strong> ${service.type}</li>
            <li><strong>Name:</strong> ${service.name}</li>
            <li><strong>Location:</strong> ${service.location || 'Not specified'}</li>
          </ul>
          
          <p><strong>Rejection Reason:</strong> ${rejectionReason || 'No specific reason provided'}</p>
          
          <p>Our team has reviewed your service and determined that it does not meet our current requirements. 
          Please review the details and make necessary improvements before resubmitting.</p>
          
          <p>If you have any questions or need clarification, please contact our support team.</p>
          
          <p>Thank you for your understanding,<br>QReserve Team</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${seller.email} for service ${service.name}`);

  } catch (error) {
    console.error("Error in sendServiceRejectionEmail:", error);
  }
}

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

  // Try to parse the rejection reason from the request body
  let rejectionReason = '';
  try {
    const body = await req.json();
    rejectionReason = body.rejectionReason || '';
  } catch (error) {
    console.warn("No rejection reason provided in the request body");
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

    // Update the service with isRejected set to true
    const updatedService = await prisma.service.update({
      where: { id: id },
      data: { 
        isApproved: false,  // Ensure it's not approved
        isRejected: true    // Set rejection status to true
      },
    });

    console.log("Service updated:", updatedService);

    // Send rejection email (without awaiting to prevent blocking)
    sendServiceRejectionEmail(updatedService, rejectionReason).catch(console.error);

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