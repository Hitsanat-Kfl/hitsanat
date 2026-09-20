import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Hitsanat Kifl - Children's Ministry",
  description:
    "Spiritual education and community building at Haramaya University Gibi Gubae - Orthodox Tewahedo Student Association",
  keywords: ["Hitsanat", "Children's Ministry", "Haramaya University", "Ethiopian Orthodox"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="am" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
