import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Intent Analyzer",
  description:
    "Real-time customer-support intent classification for Bitext messages across 27 intents and 11 categories.",
};

export const viewport: Viewport = {
  themeColor: "#f6f6f4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
