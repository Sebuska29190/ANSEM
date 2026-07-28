import type { Metadata, Viewport } from "next";
import { Unbounded, JetBrains_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/Providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

/**
 * Root layout for the ANSEM Token Terminal.
 * Typography: Unbounded (display) + JetBrains Mono (data) + IBM Plex Sans (body).
 */

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-unbounded",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ansemlive.netlify.app"),
  title: "ANSEM — The Black Bull Terminal | Solana",
  description:
    "Live ANSEM token terminal on Solana. Real-time price, on-chain swaps, holders, security audit, and the official $ANSEM dashboard powered by DexScreener and Solscan.",
  applicationName: "ANSEM Terminal",
  keywords: [
    "ANSEM",
    "The Black Bull",
    "Solana",
    "memecoin",
    "token terminal",
    "pump.fun",
    "PumpSwap",
    "DexScreener",
  ],
  authors: [{ name: "blackbullsol" }],
  openGraph: {
    title: "ANSEM — The Black Bull Terminal",
    description:
      "Premium Solana token terminal for $ANSEM. Live data, real swaps, on-chain intelligence.",
    url: "https://ansemlive.netlify.app",
    siteName: "ANSEM Terminal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANSEM — The Black Bull Terminal",
    description: "$ANSEM live data, swaps, holders and security in one place.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0908",
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
      className={`${unbounded.variable} ${jetbrains.variable} ${ibmPlex.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg text-text antialiased noise-overlay">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
