import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chat Assistant",
  description:
    "A real-time AI chatbot with streaming responses built using Next.js and WebSockets.",
  openGraph: {
    title: "AI Chat Assistant",
    description: "Real-time AI chatbot with live streaming responses.",
    images: [
      {
        url: "/og.png", // local image (or remove images entirely)
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chat Assistant",
    description: "Real-time AI chatbot with streaming responses.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
