import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();


export async function PATCH(req, { params }) {
  const { id } = params;

  try {

    const { startTime, endTime, isPublic = false, isFilled = false, newUserId } = await req.json();

    console.log("isFilled:", isFilled);


    const existingItem = await prisma.reservationItem.findUnique({
      where: { id: parseInt(id) },
      include: {
        reservation: {
          include: { user: true }, 
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Reservation item not found" }, { status: 404 });
    }

    let updatedItem, newItem;
    let newReservation, newUser = null;

    if (isFilled) {
      const newPrice = existingItem.price / 2;


      updatedItem = await prisma.reservationItem.update({
        where: { id: parseInt(id) },
        data: { price: newPrice, isFilled: true },
      });


      newUser = await prisma.user.findUnique({ where: { id: parseInt(newUserId) } });

      if (!newUser) {
        return NextResponse.json({ error: "New user not found" }, { status: 404 });
      }

      // **Create a new reservation for the new user**
      newReservation = await prisma.reservation.create({
        data: {
          userId: parseInt(newUserId),
          status: "pending",
          totalPrice: newPrice, // New reservation starts with half-price
        },
      });

      newItem = await prisma.reservationItem.create({
        data: {
          reservationId: newReservation.id, // Link to the new reservation
          serviceId: existingItem.serviceId, // Same service
          price: newPrice, // Half price for the new user
          startTime: existingItem.startTime,
          endTime: existingItem.endTime,
          // isFilled: true, // Set the new item as filled
        },
      });
    } else {
     
      updatedItem = await prisma.reservationItem.update({
        where: { id: parseInt(id) },
        data: {
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
      });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const startDate = new Date(existingItem.startTime).toLocaleDateString("en-US");
    const endDate = new Date(existingItem.endTime).toLocaleDateString("en-US");

    if (existingItem.reservation?.user?.email) {
      const originalUserMailOptions = {
        from: "no-reply@qreserve.com",
        to: existingItem.reservation.user.email,
        cc: "huzaifa.hado@gmail.com",
        subject: "📅 Reservation Updated ✔️",
        text: `Hello ${existingItem.reservation.user.name},\n\n🔔 Your reservation has been updated! 🔔\n\n📅 Start Date: ${startDate}\n🕒 End Date: ${endDate}\n💰 Price: $${updatedItem.price.toFixed(2)}\n\nThank you for using QReserve!\n\nBest Regards,\nQReserve Team`,
      };

      await transporter.sendMail(originalUserMailOptions);
    }

    if (newUser && newUser.email) {
      const newUserMailOptions = {
        from: "no-reply@qreserve.com",
        to: newUser.email,
        cc: "huzaifa.hado@gmail.com",
        subject: "🎉 Reservation confirmation!",
        text: `Hello ${newUser.name},\n\n🎊 A new reservation has been assigned to you! 🎊\n\n📅 Start Date: ${startDate}\n🕒 End Date: ${endDate}\n💰 Price: $${newItem.price.toFixed(2)}\n\nPlease check your reservations for details.\n\nThank you for using QReserve!\n\nBest Regards,\nQReserve Team`,
      };

      await transporter.sendMail(newUserMailOptions);
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating reservation item:", error);
    return NextResponse.json({ error: "Failed to update reservation item" }, { status: 500 });
  }
}





// DELETE delete a reservation item
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Check if the reservation item exists
    const reservationItem = await prisma.reservationItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!reservationItem) {
      return NextResponse.json(
        { error: "Reservation item not found" },
        { status: 404 }
      );
    }

    // Get the associated reservation ID before deletion
    const reservationId = reservationItem.reservationId;

    // Delete the reservation item
    await prisma.reservationItem.delete({
      where: { id: parseInt(id) },
    });

    // Check if any other reservation items exist for the same reservation
    const remainingItems = await prisma.reservationItem.findMany({
      where: { reservationId },
    });

    if (remainingItems.length === 0) {
      // No more items exist; delete the parent reservation
      await prisma.reservation.delete({
        where: { id: reservationId },
      });
    }

    return NextResponse.json(
      { message: "Reservation item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting reservation item:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation item" },
      { status: 500 }
    );
  }
}
