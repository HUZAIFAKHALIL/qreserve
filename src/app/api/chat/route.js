import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Groq from 'groq-sdk';

const prisma = new PrismaClient();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Simple local responses for common queries when API is unavailable
const fallbackResponses = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! Welcome to our support chat.",
    "Greetings! What can I assist you with?"
  ],
  help: [
    "I'm here to help with booking inquiries, account issues, and general questions.",
    "You can ask me about our services, booking process, or account management."
  ],
  booking: [
    "To make a booking, please provide the service you're interested in and your preferred date and time.",
    "Our booking system is available 24/7. Let me know which service you'd like to book."
  ],
  default: [
    "I apologize, but I'm currently experiencing connection issues. Please try again later or contact our support team directly.",
    "Thanks for your message. Our system is currently under maintenance. Please try again in a few minutes.",
    "I'm sorry, I couldn't process your request right now. Please try again or email support@yourservice.com."
  ]
};

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (/hello|hi|hey|greetings/i.test(lowerMessage)) {
    return getRandomResponse(fallbackResponses.greeting);
  } else if (/help|support|assist/i.test(lowerMessage)) {
    return getRandomResponse(fallbackResponses.help);
  } else if (/book|schedule|appointment|reservation/i.test(lowerMessage)) {
    return getRandomResponse(fallbackResponses.booking);
  } else {
    return getRandomResponse(fallbackResponses.default);
  }
}

function getRandomResponse(responses) {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}

export async function POST(request) {
  try {
    const { userId, message } = await request.json();
    
    const userID = parseInt(userId, 10);
    
    if (isNaN(userID)) {
      return NextResponse.json(
        { error: 'Invalid User ID format' },
        { status: 400 }
      );
    }
    
    // Store user message in the database
    const userMessage = await prisma.chatMessage.create({
      data: {
        message,
        isBot: false,
        user: {
          connect: { id: userID }  // Connect to existing user instead of just passing userID
        }
      },
    });
    
    let botResponse;
    
    try {
      // Try to get response from Groq
      const completion = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
          {role: "system", content: "You are an Expert and helpful customer support assistant for a qReserve Platform. \n Your name is Joel"},
          {role: "user", content: message}
        ],
      });
      
      botResponse = completion.choices[0].message.content;
    } catch (apiError) {
      console.error('Groq API error:', apiError);
      
      botResponse = getFallbackResponse(message);
    }
    
    // Store bot response in the database
    const botMessage = await prisma.chatMessage.create({
      data: {
        message: botResponse,
        isBot: true,
        user: {
          connect: { id: userID }  // Connect to existing user here too
        }
      },
    });
    
    return NextResponse.json({ 
      userMessage, 
      botMessage 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}




export async function GET(request) {
  const url = new URL(request.url);
  const userIdStr = url.searchParams.get('userId');
  
  console.log('GET request URL:', request.url);
  console.log('UserId from query (string):', userIdStr);
  
  if (!userIdStr) {
    console.log('No userId provided in request');
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  // Convert userId to an integer
  const userId = parseInt(userIdStr, 10);
  console.log('UserId converted to integer:', userId);
  
  if (isNaN(userId)) {
    return NextResponse.json(
      { error: 'Invalid User ID format' },
      { status: 400 }
    );
  }
  
  try {
    console.log('Querying database for userId:', userId);
    const chatHistory = await prisma.chatMessage.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    
    console.log(`Found ${chatHistory.length} messages for userId: ${userId}`);
    
    return NextResponse.json({ chatHistory });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history', details: error.message },
      { status: 500 }
    );
  }
}