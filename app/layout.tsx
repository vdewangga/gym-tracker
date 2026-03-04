import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GymProvider } from "../contexts/GymContext";
import { MobileGuard } from "../components/MobileGuard";
import { ServiceWorkerRegistration } from "../components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym Tracker",
  description: "Mobile-first workout planner and history tracker",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50`}
      >
        <GymProvider>
          <MobileGuard>
            {children}
            <ServiceWorkerRegistration />
          </MobileGuard>
        </GymProvider>
      </body>
    </html>
  );
}
