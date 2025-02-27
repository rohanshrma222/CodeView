"use client"

import {SparkleIcon } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/useUserRole";
// import { useUserRole } from "@/hooks/useUserRole";

function DasboardBtn() {
    const { role, loading } = useUserRole();
    const isInterviewer = role === "interviewer";
  
    if (!isInterviewer && loading) return null;
    if (loading || !isInterviewer) {
      return null;
    }
    return (
      <Link href={"/dashboard"}>
        <Button className="gap-2 font-medium" size={"sm"}>
          <SparkleIcon className="size-4" />
          Dashboard
        </Button>
      </Link>
    );
}

export default DasboardBtn