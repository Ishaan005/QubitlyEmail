import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const amount = session.amount_total ? Math.floor(session.amount_total / 50) : 0; // 50 cents per credit

    if (userId && amount) {
      await prisma.user.update({
        where: { userId },
        data: {
          credits: {
            increment: amount,
          },
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}