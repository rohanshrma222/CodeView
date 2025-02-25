import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// Equivalent to syncUser mutation
export async function syncUser({
  name,
  email,
  clerkId,
  image
}: {
  name: string;
  email: string;
  clerkId: string;
  image?: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (existingUser) return existingUser;

  return await prisma.user.create({
    data: {
      name,
      email,
      clerkId,
      image,
      role: "candidate",
    }
  });
}

// Equivalent to getUsers query
export async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: "User is not authenticated" });
  }
  
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}

// API route handler for getUsers
export async function getUsersHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  return getUsers(req, res);
}

// Equivalent to getUserByClerkId query
export async function getUserByClerkId(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId }
  });
  
  return user;
}

// API route handler for getUserByClerkId
export async function getUserByClerkIdHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const clerkId = req.query.clerkId as string;
  
  if (!clerkId) {
    return res.status(400).json({ error: "clerkId is required" });
  }
  
  try {
    const user = await getUserByClerkId(clerkId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
}