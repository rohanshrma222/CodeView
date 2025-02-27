// app/api/webhooks/clerk/route.ts
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
  }

  // Get the headers
  const svix_id = req.headers.get("svix-id");
  const svix_signature = req.headers.get("svix-signature");
  const svix_timestamp = req.headers.get("svix-timestamp");

  // If there are no headers, error out
  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new NextResponse("No svix headers found", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(webhookSecret);
  
  let evt: WebhookEvent;
  
  try {
    // Verify the payload with the headers
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error occurred", { status: 400 });
  }

  const eventType = evt.type;
  
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data;
    const email = email_addresses[0].email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();
    
    try {
      // Check if the role is in public metadata, default to 'candidate' if not found
      // You would need to set this metadata when creating users in Clerk
      const roleFromMetadata = public_metadata?.role as string;
      const role = roleFromMetadata && (roleFromMetadata === 'interviewer' || roleFromMetadata === 'candidate') 
        ? roleFromMetadata 
        : 'candidate'; // Default role
      
      // Use Prisma client to create a new user
      await prisma.user.create({
        data: {
          clerkId: id,
          email,
          name,
          image: image_url,
          role, // Add the role field
        },
      });
      
      console.log(`User created: ${id} with role: ${role}`);
    } catch (error) {
      console.error("Error creating user:", error);
      return new NextResponse("Error creating user", { status: 500 });
    }
  }

  return new NextResponse("Webhook processed successfully", { status: 200 });
}