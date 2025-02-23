import { NextResponse } from "next/server";
import { Webhook } from "svix";
import prisma from "@/lib/prisma";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Extract Svix headers
  const svix_id = req.headers.get("svix-id");
  const svix_signature = req.headers.get("svix-signature");
  const svix_timestamp = req.headers.get("svix-timestamp");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  // Read the request body
  const payload = await req.text();
  
  // Verify the webhook signature
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const eventType = evt.type;
  console.log("Received event:", eventType);

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses?.[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim() || "Unknown";

    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          name,
          email,
          image: image_url,
        },
        create: {
          clerkId: id,
          name,
          email,
          image: image_url,
          role: "candidate", // Default role (modify as needed)
        },
      });

      console.log("User synced successfully:", { id, email });
    } catch (error) {
      console.error("Error syncing user:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  } else {
    console.log(`Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}

export const dynamic = "force-dynamic";
