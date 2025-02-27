// hooks/useUserRole.ts
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export function useUserRole() {
  const { user } = useUser(); // Get logged-in user from Clerk
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    async function fetchUserRole() {
      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch role");

        const data: { role?: string } = await response.json();
        setRole(data.role ?? null);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user?.id]);

  return { role, loading };
}
