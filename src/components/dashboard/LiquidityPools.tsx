"use client";

import { Droplets } from "lucide-react";
import { useTokenData } from "@/hooks/useTokenData";
import type { TokenPair } from "@/types";

/**
 * LiquidityPools — top 5 pools for ANSEM on Solana.
 * Renders each as a row with a small horizontal distribution bar.
 */

function formatReserve(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toLocaleString("en-US")}`;
}

// Demo rows so the section never looks empty before data lands
const DEMO: TokenPair[] = [
  {
    pairAddress: "demo-raydium",
    chainId: "solana",
    dexId: "Raydium",
    url: "https://dexscreener.com/solana/demo-raydium",
    baseToken: { address: "ANSEM", name: "ANSEM", symbol: "ANSEM" },
    quoteToken: { address: "SOL", name: "Solana", symbol: "SOL" },
    priceNative: "0.00001",
    priceUsd: "0.000018",
    txns: {
      m5: { buys: 0, sells: 0 },
      h1: { buys: 0, sells: 0 },
      h6: { buys: 0, sells: 0 },
      h24: { buys: 0, sells: 0 },
    },
    volume: { h24: 0 },
    priceChange: { h24: 4.2 },
    liquidity: { usd: 184_312, base: 9.4e6, quote: 612 },
    fdv: 18_000,
    marketCap: 18_000,
  },
  {
    pairAddress: "demo-orca",
    chainId: "solana",
    dexId: "Orca",
    url: "https://dexscreener.com/solana/demo-orca",
    baseToken: { address: "ANSEM", name: "ANSEM", symbol: "ANSEM" },
    quoteToken: { address: "USDC", name: "USD Coin", symbol: "USDC" },
    priceNative: "0.00021",
    priceUsd: "0.000017",
    txns: {
      m5: { buys: 0, sells: 0 },
      h1: { buys: 0, sells: 0 },
      h6: { buys: 0, sells: 0 },
      h24: { buys: 0, sells: 0 },
    },
    volume: { h24: 0 },
    priceChange: { h24: -1.8 },
    liquidity: { usd: 76_540, base: 4.1e6, quote: 7_652 },
    fdv: 17_000,
    marketCap: 17_000,
  },
  {
    pairAddress: "demo-pump",
    chainId: "solana",
    dexId: "Pump.fun",
    url: "https://pump.fun/demo-pump",
    baseToken: { address: "ANSEM", name: "ANSEM", symbol: "ANSEM" },
    quoteToken: { address: "SOL", name: "Solana", symbol: "SOL" },
    priceNative: "0.00001",
    priceUsd: "0.000016",
    txns: {
      m5: { buys: 0, sells: 0 },
      h1: { buys: 0, sells: 0 },
      h6: { buys: 0, sells: 0 },
      h24: { buys: 0, sells: 0 },
    },
    volume: { h24: 0 },
    priceChange: { h24: 8.4 },
    liquidity: { usd: 22_180, base: 1.2e6, quote: 78 },
    fdv: 16_000,
    marketCap: 16_000,
  },
];

export function LiquidityPools() {
  const { data, isLoading } = useTokenData();
  const isReal = data?.pairs && data.pairs.length > 0;

  const rows: TokenPair[] = isReal ? data!.pairs.slice(0, 5) : DEMO;
  const maxLiq = Math.max(...rows.map((r) => r.liquidity?.usd ?? 0), 1);

  return (
    <section className="glass-panel overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-ember" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-terminal-dim">
            Liquidity Pools
          </span>
        </div>
        <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-terminal-dim">
          Solana
        </span>
      </div>

      <ul className="divide-y divide-white/[0.04]">
        {isLoading && isReal ? (
          [...Array(3)].map((_, i) => (
            <li key={i} className="h-16 animate-pulse bg-white/[0.02]" />
          ))
        ) : (
          rows.map((p) => {
            const liq = p.liquidity?.usd ?? 0;
            const pct = Math.min(100, Math.round((liq / maxLiq) * 100));
            const change = p.priceChange?.h24 ?? 0;
            return (
              <li
                key={p.pairAddress}
                className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-white">
                      {p.baseToken?.symbol ?? "ANSEM"}
                    </span>
                    <span className="text-terminal-dim">/</span>
                    <span className="text-terminal-dim">
                      {p.quoteToken?.symbol ?? "SOL"}
                    </span>
                    <span className="rounded-full border border-white/[0.06] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-terminal-dim">
                      {p.dexId}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 w-24 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-ember to-gold"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-terminal-dim">
                      {pct}% depth
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-white">
                    {formatReserve(liq)}
                  </div>
                  <div
                    className={`font-mono text-[10px] ${
                      change >= 0 ? "text-bull-up" : "text-bull-down"
                    }`}
                  >
                    {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
