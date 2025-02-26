"use client"

import {SparkleIcon } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
// import { useUserRole } from "@/hooks/useUserRole";

function DasboardBtn() {
  const { user, isLoaded } = useUser();
  const [isInterviewer, setIsInterviewer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch the user data from your API using the clerk user ID
        const response = await fetch(`/api/users/${user.id}`);
        
        if (response.ok) {
          const userData = await response.json();
          setIsInterviewer(userData.role === 'interviewer');
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [user, isLoaded]);

  // Don't render anything while loading or if user is not an interviewer
  if (isLoading || !isInterviewer) {
    return null;
  }
  return (
    <Link href={"/dashboard"}>
        <Button className="gap-2 font-medium" size={"sm"}>
            <SparkleIcon className="size-4" />
            Dashboard
        </Button>
    </Link>
  )
}

export default DasboardBtn