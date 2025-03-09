import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function GET(req, res) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const reservations = await prisma.reservationItem.findMany({
      where: {
        startTime: {
          gte: tomorrow,
          lt: new Date(tomorrow.getTime() + 86400000),
        },
      },
      include: { reservation: { include: { user: true } } },
    });

    if (reservations.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No reservations found for tomorrow.",
        }),
        {
          status: 200,
        }
      );
    }

   const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send emails
    for (const item of reservations) {
      const user = item.reservation.user;
      const startDate = new Date(item.startTime).toLocaleDateString("en-US");

      const mailOptions = {
        from: "no-reply@qreserve.com",
        to: user.email,
        cc: "sarmadjamal2002@gmail.com",
        subject: "⏳ Reminder: Your Reservation Starts Tomorrow!",
        text: `Hello ${user.name},\n\n📅 Your reservation is starting soon!\n\n🗓 Start Date: ${startDate}\n\nWe look forward to seeing you!\n\nBest Regards,\nQReserve Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to: ${user.email}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Reminder emails sent successfully!",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending reminder emails:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to send emails." }),
      { status: 500 }
    );
  }
}
