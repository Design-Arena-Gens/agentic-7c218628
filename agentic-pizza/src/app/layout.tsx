import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Agentic Pizza Studio",
  description:
    "Craft elevated artisan pizzas with real-time pricing, curated presets, and lightning-fast delivery orchestration.",
  metadataBase: new URL("https://agentic-7c218628.vercel.app"),
  openGraph: {
    title: "Agentic Pizza Studio",
    description:
      "Build and launch your dream pizza with seasonal toppings and agentic fulfillment.",
    url: "https://agentic-7c218628.vercel.app",
    siteName: "Agentic Pizza Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic Pizza Studio",
    description:
      "Chef-crafted presets, real-time totals, and agentic delivery orchestration.",
  },
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
        {children}
      </body>
    </html>
  );
}
