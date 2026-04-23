import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hospital Management System",
  description: "Production-ready hospital management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
            <Link href="/" className="text-sm font-semibold tracking-tight sm:text-base">
              Hospital Management System
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
