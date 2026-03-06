import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
  title: "Yomu Frontend",
  description: "Simple auth frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProviderClient>{children}</GoogleOAuthProviderClient>
      </body>
    </html>
  );
}
