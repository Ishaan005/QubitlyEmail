"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          ATTENTION: Email Marketers and Business Owners
        </h1>
        <h2 className="text-3xl font-semibold mb-8">
          Finally, a Way to Create Stunning HTML Emails Without Coding Skills or Expensive Designers
        </h2>
        <p className="text-xl mb-12">
          Discover how our AI-powered Email HTML Generator can help you create professional, responsive emails in minutes - not hours or days.
        </p>
        <ul className="text-left mb-12 space-y-4">
          <li className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <span>The little-known secret to boosting your email open rates by up to 35%</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <span>Why your current email design process is costing you time and money</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <span>How to create mobile-responsive emails that look great on any device</span>
          </li>
        </ul>
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg mb-12">
          <h3 className="text-2xl font-semibold mb-4">The Problem:</h3>
          <p className="text-lg mb-4">
            Are you tired of spending hours wrestling with HTML code or paying expensive designers for every email campaign? Do you struggle to create emails that look professional and drive results? You&apos;re not alone.
          </p>
          <p className="text-lg">
            Most businesses waste valuable time and resources on email design, leading to delayed campaigns, inconsistent branding, and poor engagement rates.
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg mb-12">
          <h3 className="text-2xl font-semibold mb-4">The Solution:</h3>
          <p className="text-lg">
            Introducing Qubitly Email - Your AI-powered Email HTML Generator. Create beautiful, responsive HTML emails in minutes with just a few clicks. No coding required.
          </p>
        </div>
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Benefits:</h3>
          <ul className="text-left space-y-4">
            <li className="flex items-center">
              <ArrowRight className="h-6 w-6 text-blue-500 mr-2" />
              <span>Save hours of design time with AI-generated templates</span>
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-6 w-6 text-blue-500 mr-2" />
              <span>Ensure consistent branding across all your email campaigns</span>
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-6 w-6 text-blue-500 mr-2" />
              <span>Boost engagement with professionally designed, responsive emails</span>
            </li>
            <li className="flex items-center">
              <ArrowRight className="h-6 w-6 text-blue-500 mr-2" />
              <span>Reduce costs by eliminating the need for external designers</span>
            </li>
          </ul>
        </div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-lg mb-12">
          <h3 className="text-2xl font-semibold mb-4">Flexible Pricing:</h3>
          <p className="text-lg mb-4">
            Sign up for free and only pay for what you use. No commitments, no subscriptions.
          </p>  
          <p className="text-lg mb-4">
            Generate emails for just $0.50 per credit.
          </p>
          <p className="text-sm text-gray-400">
            *Start creating professional emails today without any upfront costs!
          </p>
        </div>  
        {!isSignedIn ? (
          <div className="flex flex-col space-y-4">
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full text-lg">
              <a href="/sign-up">Get Started Now - It's Free!</a>
            </Button>
            <p className="text-sm text-gray-400">
              Already have an account? <a href="/sign-in" className="text-blue-400 hover:underline">Sign In</a>
            </p>
          </div>
        ) : (
          <Button asChild className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg">
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        )}
      <p className="mt-8 text-sm text-gray-400">
        Don&apos;t let poor email design hold your business back. Take action now and start creating emails that convert!
      </p>
      </div>
    </div>
  );
}