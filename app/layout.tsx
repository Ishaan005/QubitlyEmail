import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Header } from '@/components/Header';
import 'prismjs/themes/prism.css'

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Qubitly Email",
  description: "An AI Email HTML Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body>
          <Header className = "h-16" />
          <main>{children}</main>
          <Toaster />
          <Analytics />
          <SpeedInsights/>
        </body>
      </html>
    </ClerkProvider>
  );
}