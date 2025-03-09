import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    
    // Store user message in the database
    const userMessage = await prisma.chatMessage.create({
      data: {
        userId,
        message,
        isBot: false,
      },
    });
    
    let botResponse;
    
    try {
      // Try to get response from OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: "You are a helpful customer support assistant for our service booking platform."},
          {role: "user", content: message}
        ],
      });
      
      botResponse = completion.choices[0].message.content;
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      
      // Fall back to local response generator
      botResponse = getFallbackResponse(message);
    }
    
    // Store bot response in the database
    const botMessage = await prisma.chatMessage.create({
      data: {
        userId,
        message: botResponse,
        isBot: true,
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

// Get chat history for a user
export async function GET(request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const chatHistory = await prisma.chatMessage.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    
    return NextResponse.json({ chatHistory });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}