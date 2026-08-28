import type { Metadata } from "next";
import { Outfit, Caveat } from "next/font/google";
import "./globals.css";
import { Preloader } from "@/components/ui/Preloader";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "For Ketali",
  description: "Get well soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${caveat.variable} antialiased selection:bg-rose-100 selection:text-rose-900 bg-white bg-dot-grid text-zinc-900`}
      >
        <Preloader />
        {children}
      </body>
    </html>
  );
}
