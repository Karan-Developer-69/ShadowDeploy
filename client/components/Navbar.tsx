import { SignedIn, SignedOut,  SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { GitCompare } from 'lucide-react';
import { Button } from './ui/button';
import React from 'react';
const Navbar = ():React.ReactNode => {
  return <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-netural-950/50 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#8E1616] rounded-lg flex items-center justify-center">
          <GitCompare className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">ShadowDeploy</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#engine" className="hover:text-white transition-colors">How it Works</a>
        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
      </div>
      <div className="flex items-center gap-4">
        <div>
            <SignedOut>
                <div className='flex items-center gap-4'>
                    <SignInButton>
                        <Button className="text-white hover:text-zinc-200 font-semibold rounded-full px-6">
                           Login
                        </Button>
                    </SignInButton>
                    <SignUpButton> 
                        <Button className="bg-white text-black hover:bg-zinc-200 font-semibold rounded-full px-6">
                            Get Started
                        </Button>
                    </SignUpButton>
                </div>
            </SignedOut>
            <SignedIn>
              <UserButton />
        </SignedIn>
        </div>
        
      </div>
    </div>
  </nav>
}

export default Navbar;