import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hitsanat Kifl - Children's Ministry",
  description: "Children's Ministry Management and Community Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="am" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
