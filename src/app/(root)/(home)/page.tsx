"use client";
import ActionCard from "@/components/ActionCard";
import GetGreeting from "@/components/ui/getGreeting";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import Router, { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter()

  const { role } = useUserRole();
  const isInterviewer = role === "interviewer";

  const interviews = useQuery(api.interviews.getMyInterviews);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  const handleQuickAction = (title:string) =>{
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };
  return (
   <div className="container max-w-7xl mx-auto p-6  mt-4">
    
      <div className="rounded-lg  p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-white bg-clip-text text-transparent">
          <GetGreeting />
        </h1>
        <p className="text-muted-foreground mt-8">
          {isInterviewer ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {QUICK_ACTIONS.map((action) => (
                    <ActionCard
                      key={action.title}
                      action={action}
                      onClick={() => handleQuickAction(action.title)}
                    />
                  ))}
                </div>
      
                {/* <MeetingModal
                  isOpen={showModal}
                  onClose={() => setShowModal(false)}
                  title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
                  isJoinMeeting={modalType === "join"}
                /> */}
              </>
            )
            : "Access your upcoming interviews and preparations"}
        </p>
      </div>
   </div>
  );
}
