"use client";

import { useEffect, useRef, useState } from "react";
import { useTokenData } from "@/hooks/useTokenData";
import { ANSEM_ADDRESS, ANSEM_PAIR_ADDRESS } from "@/lib/constants";
import { formatBigUSD } from "@/lib/utils";
import { Copy, Check, ArrowUpRight } from "lucide-react";

/**
 * CommandBar — sticky top price bar. Always visible.
 * Shows: symbol · LIVE · price (flash) · Δ24h · MC · CTA links · CA copy.
 */
export function CommandBar() {
  const { data } = useTokenData();
  const m = data?.metrics;
  const [copied, setCopied] = useState(false);
  const prevPrice = useRef<number | null>(null);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (!m) return;
    const p = m.priceUsd;
    if (prevPrice.current !== null && p !== prevPrice.current) {
      setFlash(p > prevPrice.current ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 700);
      prevPrice.current = p;
      return () => clearTimeout(t);
    }
    prevPrice.current = p;
  }, [m]);

  const copyCA = () => {
    navigator.clipboard.writeText(ANSEM_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const positive = (m?.priceChange24h ?? 0) >= 0;

  return (
    <div className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Left: identity */}
        <div className="flex items-center gap-2.5">
          <span className="font-display text-xs font-bold uppercase tracking-wide text-text">
            $ANSEM
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.15em] text-dim sm:inline">
            The Black Bull
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-up/30 bg-up/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-up">
            <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-up" />
            Live
          </span>
        </div>

        <div className="h-4 w-px bg-line" />

        {/* Center: price + delta + MC */}
        <div className="flex items-center gap-3 font-mono text-sm">
          <span
            className={`font-bold tabular-nums transition-colors duration-300 ${
              flash === "up"
                ? "text-up"
                : flash === "down"
                  ? "text-down"
                  : "text-text"
            }`}
          >
            {m
              ? m.priceUsd < 0.01
                ? `$${m.priceUsd.toExponential(2)}`
                : `$${m.priceUsd.toFixed(4)}`
              : "—"}
          </span>
          {m && (
            <span
              className={`text-xs font-medium ${positive ? "text-up" : "text-down"}`}
            >
              {positive ? "▲" : "▼"} {Math.abs(m.priceChange24h ?? 0).toFixed(2)}%
            </span>
          )}
          <span className="hidden text-xs text-dim md:inline">
            MC {formatBigUSD(m?.marketCap ?? null)}
          </span>
        </div>

        {/* Right: actions */}
        <div className="ml-auto flex items-center gap-2">
          <a
            href={`https://jup.ag/swap/SOL-${ANSEM_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 rounded-[2px] bg-ember px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-ember-deep sm:inline-flex"
          >
            Trade
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <a
            href={`https://dexscreener.com/solana/${ANSEM_PAIR_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 rounded-[2px] border border-line px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-dim transition-colors hover:border-ember/40 hover:text-text sm:inline-flex"
          >
            Chart
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <button
            onClick={copyCA}
            className="inline-flex items-center gap-1 rounded-[2px] border border-line px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-dim transition-colors hover:border-gold/40 hover:text-gold"
            aria-label="Copy contract address"
          >
            {copied ? <Check className="h-3 w-3 text-up" /> : <Copy className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "CA"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
