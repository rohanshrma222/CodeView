// app/api/users/[clerkId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserByClerkId } from '../route';


export async function GET(
  request: NextRequest,
  { params }: { params: { clerkId: string } }
) {
  const clerkId = params.clerkId;
  
  try {
    const user = await getUserByClerkId(clerkId);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}