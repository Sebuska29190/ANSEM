import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import "./globals.css";

/**
 * Root layout for the ANSEM Token Terminal.
 * Sets metadata + fonts (using the locally shipped Geist woff files)
 * and the providers tree.
 */

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ansemlive.netlify.app"),
  title: "ANSEM — The Black Bull Terminal | Solana",
  description:
    "Live ANSEM token terminal on Solana. Real-time price, on-chain swaps, liquidity pools, AI-curated news, and the official $ANSEM dashboard powered by DexScreener, Helius and DeepSeek.",
  applicationName: "ANSEM Terminal",
  keywords: [
    "ANSEM",
    "The Black Bull",
    "Solana",
    "memecoin",
    "token terminal",
    "pump.fun",
    "Raydium",
    "DexScreener",
  ],
  authors: [{ name: "blknoiz06" }],
  openGraph: {
    title: "ANSEM — The Black Bull Terminal",
    description:
      "Premium Solana token terminal for $ANSEM. Live data, AI news, and on-chain intelligence.",
    url: "https://ansemlive.netlify.app",
    siteName: "ANSEM Terminal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANSEM — The Black Bull Terminal",
    description: "$ANSEM live data, swaps, liquidity and AI news in one place.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink text-ink antialiased noise-overlay">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
