import type { Metadata } from "next";
import { Space_Mono, Syne, Inter, Permanent_Marker, Bebas_Neue } from "next/font/google";

import "./globals.css";
import Script from "next/script";

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

const marker = Permanent_Marker({

  subsets: ["latin"],
  variable: "--font-marker",
  weight: ["400"]
});

const industrial = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-industrial",
  weight: ["400"]
});


export const metadata: Metadata = {
  title: "PitchSlap",
  description: "AI roast engine for cold emails.",
  icons: {
    icon: "/icon.png",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-SDPPJ99H53";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className={`${heading.variable} ${body.variable} ${simple.variable} ${marker.variable} ${industrial.variable} font-body antialiased`}>

        {children}
      </body>
    </html>
  );
}

