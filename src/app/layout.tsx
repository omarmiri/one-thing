import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { appUrl } from "@/lib/ids";
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
  // Without this Next resolves relative og:image paths against localhost:$PORT in production.
  metadataBase: new URL(appUrl()),
  title: "OneThing — sell your one product",
  description: "Snap a photo, and AI builds a one-product shop that takes PayPal payments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
