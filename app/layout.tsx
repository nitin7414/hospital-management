import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
