import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// Equivalent to addComment mutation
export async function addComment(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const { interviewId, content, rating } = req.body;
  
  if (!interviewId || !content || rating === undefined) {
    return res.status(400).json({ error: "interviewId, content, and rating are required" });
  }
  
  try {
    const comment = await prisma.comment.create({
      data: {
        interviewId,
        content,
        rating,
        interviewerId: userId
      }
    });
    
    return res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
}

// Direct function version for server components/actions
export async function addCommentDirect({
  interviewId,
  content,
  rating,
  interviewerId
}: {
  interviewId: string;
  content: string;
  rating: number;
  interviewerId: string;
}) {
  const comment = await prisma.comment.create({
    data: {
      interviewId,
      content,
      rating,
      interviewerId
    }
  });
  
  return comment;
}

// Equivalent to getComments query
export async function getComments(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const interviewId = req.query.interviewId as string;
  
  if (!interviewId) {
    return res.status(400).json({ error: "interviewId is required" });
  }
  
  try {
    const comments = await prisma.comment.findMany({
      where: { interviewId }
    });
    
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
}

// Direct function version for server components/actions
export async function getCommentsDirect(interviewId: string) {
  const comments = await prisma.comment.findMany({
    where: { interviewId }
  });
  
  return comments;
}