import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
   <div className="m-10">
    <h1>
      HI I AM ROHAN
    </h1>
    <SignedOut>
            <SignInButton />
            login
          </SignedOut>
   </div>
  );
}
