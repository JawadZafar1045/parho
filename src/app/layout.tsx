import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Application Foundation",
  description: "Generic production-ready Next.js full-stack foundation",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
