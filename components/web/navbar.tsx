import React from 'react';
import Link from "next/link";
import { buttonVariants } from '../ui/button';
import { ModeToggle } from './theme.toggle';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight">NextPro</span>
        </Link>

      
        <div className="hidden md:flex items-center space-x-1">
          <Link 
            href="/" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            Home
          </Link>
          <Link 
            href="/blog" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            Blog
          </Link>
          <Link 
            href="/create" 
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            Create
          </Link>
        </div>

       
        <div className="flex items-center space-x-2">
          <ModeToggle />
          
          <div className="hidden sm:flex items-center space-x-2">
            <Link 
              href="/signup"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Sign Up
            </Link>
            <Link 
              href="/login"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-accent rounded-md">
            <svg 
              className="h-5 w-5" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;