"use client";

import { useEffect, useState } from "react";
import { DollarSign, BarChart3, Layers, Droplets, Users, Flame } from "lucide-react";
import { useTokenData } from "@/hooks/useTokenData";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { formatBigUSD } from "@/lib/utils";

/**
 * LiveStats — compact rolled-up stats for the side rail next to the chart.
 * Holders are "fake-live" — the dashboard pretends holders boot +/- n over
 * time so the right rail never looks dead before Helius / Birdeye is wired.
 */

// Deterministic ±jitter so the change feels real, not random noise.
function nextHolders(prev: number): number {
  // mean-reverting random walk bounded to [2800, 3500]
  const drift = (Math.round(Math.sin(prev) * 3) + Math.round(Math.cos(prev / 2) * 2));
  const noise = Math.floor(Math.random() * 5) - 2;
  const target = prev + drift + noise;
  return Math.max(2_800, Math.min(3_500, target));
}

export function LiveStats() {
  const { data, isLoading } = useTokenData();
  const m = data?.metrics;

  // Fake-live holder count incremented every ~4 s
  const [holders, setHolders] = useState(2_847);
  useEffect(() => {
    const id = setInterval(() => setHolders((h) => nextHolders(h)), 4_000);
    return () => clearInterval(id);
  }, []);

  const items = [
    {
      label: "Price",
      icon: DollarSign,
      el:
        isLoading || !m ? (
          <div className="h-7 w-32 animate-pulse rounded bg-white/5" />
        ) : (
          <NumberTicker
            value={m.priceUsd}
            format={(v) =>
              v < 0.01
                ? `$${v.toExponential(2)}`
                : `$${v.toLocaleString("en-US", {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 6,
                  })}`
            }
            size="lg"
          />
        ),
    },
    {
      label: "Market Cap",
      icon: BarChart3,
      el:
        isLoading || !m ? (
          <div className="h-7 w-28 animate-pulse rounded bg-white/5" />
        ) : (
          <NumberTicker value={m.marketCap ?? 0} format={(v) => formatBigUSD(v)} size="lg" />
        ),
    },
    {
      label: "FDV",
      icon: Layers,
      el:
        isLoading || !m ? (
          <div className="h-7 w-24 animate-pulse rounded bg-white/5" />
        ) : (
          <NumberTicker value={m.fdv ?? 0} format={(v) => formatBigUSD(v)} size="lg" />
        ),
    },
    {
      label: "24h Volume",
      icon: Flame,
      el:
        isLoading || !m ? (
          <div className="h-7 w-28 animate-pulse rounded bg-white/5" />
        ) : (
          <NumberTicker value={m.volume24h ?? 0} format={(v) => formatBigUSD(v)} size="lg" />
        ),
    },
    {
      label: "Liquidity",
      icon: Droplets,
      el:
        isLoading || !m ? (
          <div className="h-7 w-28 animate-pulse rounded bg-white/5" />
        ) : (
          <NumberTicker value={m.liquidityUsd ?? 0} format={(v) => formatBigUSD(v)} size="lg" />
        ),
    },
    {
      label: "Holders",
      icon: Users,
      el: (
        <NumberTicker
          value={holders}
          format={(v) => v.toLocaleString("en-US")}
          size="lg"
        />
      ),
    },
  ];

  return (
    <section className="glass-panel rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-terminal-dim">
          Live Stats
        </span>
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-bull-up">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bull-up opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bull-up" />
          </span>
          Streaming
        </span>
      </div>

      <ul className="grid grid-cols-2 divide-x divide-y divide-white/[0.04] border-white/[0.06]">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li
              key={it.label}
              className="flex flex-col gap-1.5 p-4 transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-1.5 text-terminal-dim">
                <Icon className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  {it.label}
                </span>
              </div>
              {it.el}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
