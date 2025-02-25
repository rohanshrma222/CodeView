"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import Navbar from "@/components/ui/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import './globals.css';

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Your logic here
  //   setIsLoading(false); // Set loading to false after the effect runs
  // }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>; // Render a loading state while checking auth
  // }

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
          <div className="min-h-screen bg-gradient-to-r from-gray-800 to-black">
            <Navbar />
            <main className="">{children}</main>
          </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
