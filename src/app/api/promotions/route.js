// app/api/promotions/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const userId = searchParams.get('userId');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let promotions = [];
    let userDiscounts = null;

    // Get all promotions matching the filter criteria
    const whereClause = {};
    
    if (activeOnly) {
      whereClause.isActive = true;
      whereClause.OR = [
        { startDate: null },
        { startDate: { lte: new Date() } }
      ];
      whereClause.OR2 = [
        { endDate: null },
        { endDate: { gte: new Date() } }
      ];
    }

    if (serviceId) {
      whereClause.OR = [
        { serviceId: parseInt(serviceId) },
        { serviceId: null } // Global promotions
      ];
    }

    promotions = await prisma.promotion.findMany({
      where: whereClause,
      include: {
        service: true
      }
    });

    // Get user-specific discounts if userId is provided
    if (userId) {
      userDiscounts = {
        signupDiscount: await prisma.signupDiscount.findUnique({
          where: { userId: parseInt(userId), isUsed: false }
        }),
        loyaltyDiscount: await prisma.loyaltyDiscount.findUnique({
          where: { userId: parseInt(userId) }
        })
      };
    }

    return NextResponse.json({ 
      promotions,
      userDiscounts
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, discount, discountType, startDate, endDate, serviceId, isActive } = body;

    // Validate required fields
    if (!title || discount === undefined || discount === null || !discountType) {
      return NextResponse.json(
        { error: "Title, discount, and discountType are required" },
        { status: 400 }
      );
    }

    // Create new promotion
    const promotion = await prisma.promotion.create({
      data: {
        title,
        description,
        discount: parseFloat(discount),
        discountType,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        serviceId: serviceId ? parseInt(serviceId) : null,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json({ 
      message: "Promotion created successfully",
      promotion 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating promotion:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, description, discount, discountType, startDate, endDate, serviceId, isActive } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "Promotion ID is required" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (discount !== undefined) updateData.discount = parseFloat(discount);
    if (discountType !== undefined) updateData.discountType = discountType;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (serviceId !== undefined) updateData.serviceId = serviceId ? parseInt(serviceId) : null;
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    // Update promotion
    const promotion = await prisma.promotion.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json({ 
      message: "Promotion updated successfully",
      promotion 
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Promotion ID is required" },
        { status: 400 }
      );
    }

    // Delete promotion
    await prisma.promotion.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      message: "Promotion deleted successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}