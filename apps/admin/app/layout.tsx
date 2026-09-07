import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "../components/shell/app-shell";

export const metadata: Metadata = {
  title: "Hitsanat Kifl - Admin Portal",
  description: "Children's Ministry Administrative Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="am" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
