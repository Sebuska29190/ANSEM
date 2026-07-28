"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Zap } from "lucide-react";
import { useTokenData } from "@/hooks/useTokenData";
import { ANSEM_ADDRESS, ANSEM_PAIR_ADDRESS } from "@/lib/constants";
import { MoneyTicker } from "@/components/ui/NumberTicker";
import { BullEmblem } from "./BullEmblem";

const LINKS = {
  jupiter: `https://jup.ag/swap/SOL-${ANSEM_ADDRESS}`,
  dexscreener: `https://dexscreener.com/solana/${ANSEM_PAIR_ADDRESS}`,
  solscan: `https://solscan.io/token/${ANSEM_ADDRESS}`,
  x: "https://x.com/blackbullsol",
};

/**
 * Masthead — asymmetric terminal hero. Left: identity + CTAs. Right: bull + price.
 * Opens the page with price, not a slogan.
 */
export function Hero() {
  const { data, isLoading } = useTokenData();
  const m = data?.metrics;
  const positive = (m?.priceChange24h ?? 0) >= 0;

  return (
    <header className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-hero-radial" />
      <div className="absolute inset-0 -z-10 terminal-grid opacity-30" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pt-16 pb-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pt-20 lg:pb-16">
        {/* LEFT: identity */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-[2px] border border-ember/30 bg-ember/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ember"
          >
            <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-ember" />
            Solana · PumpSwap · Mainnet
          </motion.div>

          <motion.h1
            className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight text-text sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            The{" "}
            <span className="text-gradient-ember">Black</span>{" "}
            Bull
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex flex-wrap items-center gap-3 font-mono text-sm text-dim"
          >
            <span className="font-bold text-gold">$ANSEM</span>
            <span className="text-mute">·</span>
            <span className="text-xs">
              CA {ANSEM_ADDRESS.slice(0, 6)}…{ANSEM_ADDRESS.slice(-4)}
            </span>
            <span className="text-mute">·</span>
            <span className="text-xs">9 decimals</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href={LINKS.jupiter}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-[2px] bg-ember px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-ember-sm transition-all hover:-translate-y-px hover:shadow-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              <Zap className="h-3.5 w-3.5" />
              Trade $ANSEM
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={LINKS.dexscreener}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[2px] border border-line bg-panel px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-dim transition-colors hover:border-ember/40 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              DexScreener
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={LINKS.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[2px] border border-line bg-panel px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-dim transition-colors hover:border-gold/40 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              @blackbullsol
            </a>
          </motion.div>
        </div>

        {/* RIGHT: bull emblem + big price */}
        <div className="flex flex-col items-center justify-center gap-6 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <BullEmblem size={260} />
          </motion.div>

          <div className="text-center">
            {isLoading || !m ? (
              <div className="mx-auto h-14 w-56 animate-pulse rounded-[2px] bg-raised" />
            ) : (
              <MoneyTicker value={m.priceUsd} size="display" />
            )}
            {m && (
              <span
                className={`mt-2 inline-block rounded-[2px] px-2.5 py-1 font-mono text-sm font-bold ${
                  positive
                    ? "bg-up/10 text-up ring-1 ring-up/20"
                    : "bg-down/10 text-down ring-1 ring-down/20"
                }`}
              >
                {positive ? "▲" : "▼"} {Math.abs(m.priceChange24h ?? 0).toFixed(2)}% 24h
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-ember/30 to-transparent" />
    </header>
  );
}
