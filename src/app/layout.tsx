import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ANSEM.AI — Solana Token Terminal",
  description:
    "Live ANSEM token dashboard with real-time price, charts, swaps, liquidity and AI-generated news on Solana.",
  metadataBase: new URL("https://ansemlive.netlify.app"),
  openGraph: {
    title: "ANSEM.AI — Solana Token Terminal",
    description: "Live ANSEM token dashboard with real-time data and AI news.",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@blknoiz06",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-ansem min-h-screen`}
      >
        <div className="bg-overlay noise-overlay min-h-screen">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
