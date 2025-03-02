"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import Navbar from "@/components/Navbar";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import './globals.css';
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Your logic here
    setIsLoading(false); // Set loading to false after the effect runs
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading state while checking auth
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SignedIn>
            <div className="min-h-screen">
              <Navbar />
              <main className="">{children}</main>
            </div>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
