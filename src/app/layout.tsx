import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/src/components/ui/sonner";
import GoogleOAuthProviderClient from "@/src/components/GoogleOAuthProviderClient";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yomu",
  description: "Platform gamifikasi literasi informasi untuk membaca, kuis, forum, clan, dan leaderboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProviderClient>
          {children}
          <Toaster />
        </GoogleOAuthProviderClient>
      </body>
    </html>
  );
}
