"use client";

import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';

export function Header({ className }: { className?: string }) {
    const { isSignedIn } = useAuth();
  
    return (
      <header className={`flex justify-between items-center p-4 bg-background border-b ${className}`}>
        <div className="flex items-center">
          <Link href={isSignedIn ? "/dashboard" : "/"} className="text-2xl font-bold">
            Qubitly
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-foreground hover:text-primary">
                Dashboard
              </Link>
              <Link href="/editor/new" className="text-foreground hover:text-primary">
                Editor
              </Link>
              <Link href="/settings" className="text-foreground hover:text-primary">
                Settings
              </Link>
              <Link href="/feedback" className="text-foreground hover:text-primary">
                Support
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-foreground hover:text-primary">
                Sign In
              </Link>
              <Link href="/sign-up" className="text-foreground hover:text-primary">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>
    );
  }