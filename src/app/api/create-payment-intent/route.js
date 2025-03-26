import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10" // Use the latest API version
  });

export async function POST(request) {
    try {
   
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error("Stripe secret key is not defined");
            return NextResponse.json(
              { error: "Server configuration error" },
              { status: 500 }
            );
          }

      const body = await request.json();
        console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      console.log("Received payment intent request:", body);
  
      const { amount, currency = "qar", metadata } = body;
  
      // Validate amount
      if (!amount || amount <= 0) {
        console.error("Invalid amount:", amount);
        return NextResponse.json(
          { error: "Invalid amount" },
          { status: 400 }
        );
      }
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), 
        currency: currency.toLowerCase(),
        metadata: metadata || {},
        payment_method_types: ['card'],
      });
  
      return NextResponse.json({ 
        clientSecret: paymentIntent.client_secret 
      }, { status: 200 });
    } catch (error) {
      console.error("Detailed error creating payment intent:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create payment intent" },
        { status: 500 }
      );
    }
  }