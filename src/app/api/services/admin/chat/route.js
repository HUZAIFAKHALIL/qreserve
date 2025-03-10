// G:\react\sarmadWork\qreverse\src\app\api\admin\chats\route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Get conversations grouped by user
    const chatData = await prisma.chatMessage.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group messages by userId
    const conversations = {};
    chatData.forEach(message => {
      if (!conversations[message.userId]) {
        conversations[message.userId] = {
          user: message.user,
          messages: []
        };
      }
      conversations[message.userId].messages.push(message);
    });

    return NextResponse.json({ conversations: Object.values(conversations) });
  } catch (error) {
    console.error('Error fetching chat data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat data', details: error.message },
      { status: 500 }
    );
  }
}
