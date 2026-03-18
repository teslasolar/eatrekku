import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EaTrekku えあとれっく — History in Panels",
  description:
    "Every historical moment is a manga page. AI-powered manga panel generator that turns history into dramatic visual storytelling.",
  keywords: ["manga", "history", "AI", "educational", "manga generator", "historical manga"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
