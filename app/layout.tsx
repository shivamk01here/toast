import type { Metadata } from "next";
import { Space_Mono, Syne, Inter } from "next/font/google";
import "./globals.css";

const heading = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["700", "800"]
});

const body = Space_Mono({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "700"]
});

const simple = Inter({
  subsets: ["latin"],
  variable: "--font-simple",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "PitchSlap",
  description: "AI roast engine for cold emails.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} ${simple.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
