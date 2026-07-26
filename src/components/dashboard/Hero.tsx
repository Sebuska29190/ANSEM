"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ArrowUpRight, Zap, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { useTokenData } from "@/hooks/useTokenData";
import { ANSEM_ADDRESS } from "@/lib/constants";
import { formatBigUSD } from "@/lib/utils";
import { BullEmblem } from "./BullEmblem";
import { MoneyTicker, NumberTicker } from "@/components/ui/NumberTicker";

/**
 * Hero
 * ------------------------------------------------------
 * Full-bleed black/orange terminal hero.
 */

const LINKS = {
  dexscreener: `https://dexscreener.com/solana/${ANSEM_ADDRESS}`,
  birdeye:     `https://birdeye.so/token/${ANSEM_ADDRESS}?chain=solana`,
  solscan:     `https://solscan.io/token/${ANSEM_ADDRESS}`,
  pump:        `https://pump.fun/${ANSEM_ADDRESS}`,
  raydium:     `https://raydium.io/swap/?inputMint=sol&outputMint=${ANSEM_ADDRESS}`,
  jupiter:     `https://jup.ag/swap/SOL-${ANSEM_ADDRESS}`,
  x:           "https://x.com/blknoiz06",
};

export function Hero() {
  const { data, isLoading } = useTokenData();
  const m = data?.metrics;
  const pricePositive = (m?.priceChange24h ?? 0) >= 0;
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel pending copy-feedback timer on unmount (no setState after unmount)
  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const copyCA = useCallback(() => {
    navigator.clipboard.writeText(ANSEM_ADDRESS);
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  }, []);

  const buy = m?.buys24h ?? 0;
  const sell = m?.sells24h ?? 0;
  const buyRatio = useMemo(() => {
    const t = buy + sell;
    return t ? Math.round((buy / t) * 100) : 50;
  }, [buy, sell]);

  return (
    <header className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-hero-radial" />
      <div className="absolute inset-0 -z-10 terminal-grid opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] h-[640px] w-[640px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,69,0,0.35) 0%, rgba(255,69,0,0.05) 45%, transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pt-28 pb-24 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pt-32 lg:pb-32">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-ember"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
            </span>
            Mainnet · Live Terminal
          </motion.div>

          <motion.h1
            className="font-black uppercase leading-[0.85] tracking-tighter text-white"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {["The", "Black", "Bull"].map((w, i) => (
              <motion.span
                key={w + i}
                className="mr-4 inline-block text-6xl sm:mr-6 sm:text-7xl md:text-[8rem]"
                variants={{
                  hidden: { opacity: 0, y: 50, filter: "blur(8px)" },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {w === "Black" ? <span className="text-gradient-ember">{w}</span> : w}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-4 flex items-center gap-3"
          >
            <span className="font-mono text-2xl font-bold text-gold">$ANSEM</span>
            <span className="text-xs uppercase tracking-[0.2em] text-terminal-dim">
              ca · {ANSEM_ADDRESS.slice(0, 6)}…{ANSEM_ADDRESS.slice(-4)}
            </span>
          </motion.div>

          {/* Hero price block — CLS-safe via matching min-width */}
          <div className="mt-10 flex items-end gap-6">
            <div className="min-w-[18rem] md:min-w-[24rem] max-w-full">
              {isLoading || !m ? (
                <div className="h-20 w-72 animate-pulse rounded-lg bg-white/5" />
              ) : (
                <MoneyTicker value={m.priceUsd} size="display" />
              )}
            </div>
            {!isLoading && m && (
              <div className="pb-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${
                    pricePositive
                      ? "bg-bull-up/10 text-bull-up ring-1 ring-bull-up/30"
                      : "bg-bull-down/10 text-bull-down ring-1 ring-bull-down/30"
                  }`}
                >
                  {pricePositive ? "▲" : "▼"}{" "}
                  {Math.abs(m.priceChange24h ?? 0).toFixed(2)}%
                  <span className="ml-2 text-[10px] font-medium uppercase tracking-wider text-terminal-dim">
                    24h
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Glass stats row */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Market Cap", value: m?.marketCap ?? null },
              { label: "FDV", value: m?.fdv ?? null },
              { label: "24h Volume", value: m?.volume24h ?? null },
              { label: "Liquidity", value: m?.liquidityUsd ?? null },
            ].map((s) => (
              <div key={s.label} className="glass-panel rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-terminal-dim">
                  {s.label}
                </p>
                {isLoading || s.value === null ? (
                  <div className="mt-2 h-5 w-24 animate-pulse rounded bg-white/5" />
                ) : (
                  <NumberTicker
                    value={s.value}
                    format={(v) => formatBigUSD(v)}
                    size="md"
                    className="mt-1"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Buy/Sell ratio bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-terminal-dim">
              <span>Buy Pressure</span>
              <span className="font-mono">{buyRatio}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: "50%" }}
                animate={{ width: `${buyRatio}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-bull-up via-ember to-bull-down"
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-terminal-dim">
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-bull-up" /> {buy} buys
              </span>
              <span className="inline-flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-bull-down" /> {sell} sells
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={LINKS.jupiter}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-ember px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-ember transition-transform hover:-translate-y-0.5 animate-ember-pulse"
            >
              <Zap className="h-4 w-4" />
              Trade $ANSEM
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={LINKS.dexscreener}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-colors hover:border-ember/60 hover:bg-ember/10"
            >
              <Activity className="h-4 w-4" />
              DexScreener
            </a>
            <button
              onClick={copyCA}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-colors hover:border-gold/60 hover:bg-gold/10"
              aria-label="Copy contract address"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-bull-up" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy CA
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: bull emblem */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <BullEmblem size={340} />
          </motion.div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
    </header>
  );
}
