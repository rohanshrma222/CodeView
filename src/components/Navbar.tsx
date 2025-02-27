import React, { useEffect, useState } from 'react'
import { ModeToggle } from './ModeToggle'
import Link from 'next/link'
import { CodeIcon } from 'lucide-react'
import { SignedIn, UserButton } from '@clerk/nextjs'
import DasboardBtn from './DasboardBtn'


function Navbar() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <nav className="border-b border-white  mx-[160px]">
      <div className='flex justify-center h-16  px-2 pt-3 container mx-auto '>
       <Link href="/" className="flex items-center gap-2 font-semibold text-2xl mr-7 font-mono hover:opacity-70 transition-opacity">
          <CodeIcon className="size-8 text-white" />
          <span className="bg-white bg-clip-text ">
            CodeView
          </span>
        </Link>

        <div className="flex items-center space-x-4 ml-auto gap-6">     
          <SignedIn>
            <DasboardBtn /> 
            <ModeToggle />
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}

export default Navbar