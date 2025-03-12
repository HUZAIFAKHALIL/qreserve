import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  const { id } = params;  
  
  if (!id) {
    return NextResponse.json(
      { error: 'ID is required' },
      { status: 400 }
    );
  }

  const userId = parseInt(id, 10);

  try {
    console.log(`Attempting to delete chat messages for user with ID: ${id}`);
    
    const deleteResult = await prisma.chatMessage.deleteMany({
      where: {
        userId: userId 
      }
    });

    console.log(`Deleted ${deleteResult.count} messages for user ${id}`);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted ${deleteResult.count} chat messages` 
    });
  } catch (error) {
    console.error('Error deleting chat data:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat data', details: error.message },
      { status: 500 }
    );
  }
}