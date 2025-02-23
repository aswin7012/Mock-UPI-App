import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "../components/Providers";
import { Inter } from "next/font/google";
import { AppbarClient } from "../components/AppbarClient";
import * as React from "react"; // Add this import
import type { JSX } from "react"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet",
  description: "Simple wallet app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <div className="min-w-screen min-h-screen bg-[#ebe6e6]">
            <AppbarClient />
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}
