import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle PATCH request to edit a reservation item
export async function PATCH(req, { params }) {
  const { id } = params;
  const { startTime, endTime } = await req.json();

  try {
    // Update the reservation item in the database
    const updatedItem = await prisma.reservationItem.update({
      where: {
        id: parseInt(id), // Find the item by its ID
      },
      data: {
        startTime: new Date(startTime), // Update the start time
        endTime: new Date(endTime), // Update the end time
      },
    });

    // Return the updated reservation item
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating reservation item:", error);
    return NextResponse.json(
      { error: "Failed to update reservation item" },
      { status: 500 }
    );
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
