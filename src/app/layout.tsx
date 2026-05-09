import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import VersionChecker from "@/components/VersionChecker";
import PageTransition from "@/components/PageTransition";
import LuxuryCursor from "@/components/LuxuryCursor";
import ScrollReveal from "@/components/ScrollReveal";
import AmbientParticles from "@/components/AmbientParticles";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Parfumerie Les 2 As | L'Excellence Olfactive",
  description: "Découvrez notre collection exclusive de parfums de luxe. Une expérience sensorielle unique pour lui et pour elle.",
  other: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-luxury-black">
        <LuxuryCursor />
        <AmbientParticles />
        <ScrollReveal />
        <VersionChecker />
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
