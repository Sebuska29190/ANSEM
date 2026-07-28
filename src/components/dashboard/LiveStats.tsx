"use client";

import { DollarSign, BarChart3, Layers, Droplets, Users, Flame, ExternalLink } from "lucide-react";
import { useTokenData } from "@/hooks/useTokenData";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { formatBigUSD } from "@/lib/utils";
import { ANSEM_ADDRESS } from "@/lib/constants";

/**
 * LiveStats — compact rolled-up stats for the side rail next to the chart.
 * Holders link out to Solscan (DexScreener API doesn't expose holder count).
 */

export function LiveStats() {
  const { data, isLoading } = useTokenData();
  const m = data?.metrics;

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
        <a
          href={`https://solscan.io/token/${ANSEM_ADDRESS}#holders`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-mono text-lg font-bold text-white transition-colors hover:text-ember"
        >
          View on Solscan
          <ExternalLink className="h-3.5 w-3.5 text-terminal-dim transition-colors group-hover:text-ember" />
        </a>
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
