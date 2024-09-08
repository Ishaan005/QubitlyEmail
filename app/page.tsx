"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      createUser(
        user.id,
        user.firstName,
        user.lastName,
        user.primaryEmailAddress?.emailAddress
      );
    }
  }, [isSignedIn, user]);

  async function createUser(
    userId: string,
    firstName: string | null,
    lastName: string | null,
    email: string | undefined
  ) {
    if (!email) {
      console.error('User email is undefined');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name: `${firstName || ''} ${lastName || ''}`.trim(),
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      console.log('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">Welcome to Qubitly Email</h1>
      <p className="text-lg mb-8">Create and manage your emails effortlessly.</p>
      {!isSignedIn ? (
        <div className="flex space-x-4">
          <Button asChild>
            <a href="/sign-in">Sign In</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/sign-up">Sign Up</a>
          </Button>
        </div>
      ) : (
        <Button asChild>
          <a href="/dashboard">Go to Dashboard</a>
        </Button>
      )}
    </div>
  );
}