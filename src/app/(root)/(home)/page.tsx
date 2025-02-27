"use client";
import GetGreeting from "@/components/ui/getGreeting";
import { useUserRole } from "@/hooks/useUserRole";

export default function Home() {
  const { role } = useUserRole();
  const isInterviewer = role === "interviewer";
  return (
   <div className="container max-w-7xl mx-auto p-6 bg-slate-400 mt-4">
    
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-white bg-clip-text text-transparent">
          <GetGreeting />
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? "Manage your interviews and review candidates effectively"
            : "Access your upcoming interviews and preparations"}
        </p>
      </div>
   </div>
  );
}
