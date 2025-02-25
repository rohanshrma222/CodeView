import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// Equivalent to getAllInterviews query
export async function getAllInterviews(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const interviews = await prisma.interview.findMany();
    return res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return res.status(500).json({ error: "Failed to fetch interviews" });
  }
}

// Direct function version for server components/actions
export async function getAllInterviewsDirect() {
  const interviews = await prisma.interview.findMany();
  return interviews;
}

// Equivalent to getMyInterviews query
export async function getMyInterviews(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(200).json([]);
  }
  
  try {
    const interviews = await prisma.interview.findMany({
      where: { candidateId: userId }
    });
    
    return res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return res.status(500).json({ error: "Failed to fetch interviews" });
  }
}

// Direct function version for server components/actions
export async function getMyInterviewsDirect(userId: string) {
  if (!userId) return [];
  
  const interviews = await prisma.interview.findMany({
    where: { candidateId: userId }
  });
  
  return interviews;
}

// Equivalent to getInterviewByStreamCallId query
export async function getInterviewByStreamCallId(streamCallId: string) {
  const interview = await prisma.interview.findUnique({
    where: { streamCallId }
  });
  
  return interview;
}

// API route handler for getInterviewByStreamCallId
export async function getInterviewByStreamCallIdHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const streamCallId = req.query.streamCallId as string;
  
  if (!streamCallId) {
    return res.status(400).json({ error: "streamCallId is required" });
  }
  
  try {
    const interview = await getInterviewByStreamCallId(streamCallId);
    
    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }
    
    return res.status(200).json(interview);
  } catch (error) {
    console.error("Error fetching interview:", error);
    return res.status(500).json({ error: "Failed to fetch interview" });
  }
}

// Equivalent to createInterview mutation
export async function createInterview(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const { 
    title, 
    description, 
    startTime, 
    status, 
    streamCallId, 
    candidateId, 
    interviewerIds 
  } = req.body;
  
  try {
    // Create interview
    const interview = await prisma.interview.create({
      data: {
        title,
        description,
        startTime,
        status,
        streamCallId,
        candidateId,
        // Assuming you have an interviewers relation or storing as JSON
        interviewerIds
      }
    });
    
    return res.status(201).json(interview);
  } catch (error) {
    console.error("Error creating interview:", error);
    return res.status(500).json({ error: "Failed to create interview" });
  }
}

// Direct function version for server components/actions
export async function createInterviewDirect({
  title,
  description,
  startTime,
  status,
  streamCallId,
  candidateId,
  interviewerIds
}: {
  title: string;
  description?: string;
  startTime: number;
  status: string;
  streamCallId: string;
  candidateId: string;
  interviewerIds: string[];
}) {
  const interview = await prisma.interview.create({
    data: {
      title,
      description,
      startTime,
      status,
      streamCallId,
      candidateId,
      interviewerIds
    }
  });
  
  return interview;
}

// Equivalent to updateInterviewStatus mutation
export async function updateInterviewStatus(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { id, status } = req.body;
  
  if (!id || !status) {
    return res.status(400).json({ error: "id and status are required" });
  }
  
  try {
    const interview = await prisma.interview.update({
      where: { id },
      data: {
        status,
        ...(status === "completed" ? { endTime: new Date().getTime() } : {})
      }
    });
    
    return res.status(200).json(interview);
  } catch (error) {
    console.error("Error updating interview status:", error);
    return res.status(500).json({ error: "Failed to update interview status" });
  }
}

// Direct function version for server components/actions
export async function updateInterviewStatusDirect(id: string, status: string) {
  const interview = await prisma.interview.update({
    where: { id },
    data: {
      status,
      ...(status === "completed" ? { endTime: new Date().getTime() } : {})
    }
  });
  
  return interview;
}