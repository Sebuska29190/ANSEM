"use client";

import { DollarSign, BarChart3, Layers, Flame, Droplets, Users, ExternalLink } from "lucide-react";
import { useTokenData } from "@/hooks/useTokenData";
import { useHolders } from "@/hooks/useHolders";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { formatBigUSD } from "@/lib/utils";
import { ANSEM_ADDRESS } from "@/lib/constants";
import { Panel } from "@/components/ui/Panel";

/**
 * LiveStats — compact rolled-up stats for the side rail next to the chart.
 * Holder count is REAL via Solscan (falls back to a Solscan link).
 */
export function LiveStats() {
  const { data, isLoading } = useTokenData();
  const { data: holdersData } = useHolders();
  const m = data?.metrics;
  const holderCount = holdersData?.data?.total;

  const items = [
    {
      label: "Price",
      icon: DollarSign,
      el:
        isLoading || !m ? (
          <div className="h-7 w-32 animate-pulse rounded-[2px] bg-raised" />
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
          <div className="h-7 w-28 animate-pulse rounded-[2px] bg-raised" />
        ) : (
          <NumberTicker value={m.marketCap ?? 0} format={(v) => formatBigUSD(v)} size="lg" />
        ),
    },
    {
      label: "FDV",
      icon: Layers,
      el:
        isLoading || !m ? (
          <div className="h-7 w-24 animate-pulse rounded-[2px] bg-raised" />
        ) : (
          <NumberTicker value={m.fdv ?? 0} format={(v) => formatBigUSD(v)} size="lg" />
        ),
    },
    {
      label: "24h Volume",
      icon: Flame,
      el:
        isLoading || !m ? (
          <div className="h-7 w-28 animate-pulse rounded-[2px] bg-raised" />
        ) : (
          <NumberTicker value={m.volume24h ?? 0} format={(v) => formatBigUSD(v)} size="lg" />
        ),
    },
    {
      label: "Liquidity",
      icon: Droplets,
      el:
        isLoading || !m ? (
          <div className="h-7 w-28 animate-pulse rounded-[2px] bg-raised" />
        ) : (
          <NumberTicker value={m.liquidityUsd ?? 0} format={(v) => formatBigUSD(v)} size="lg" />
        ),
    },
    {
      label: "Holders",
      icon: Users,
      el: holderCount ? (
        <NumberTicker
          value={holderCount}
          format={(v) => v.toLocaleString("en-US")}
          size="lg"
        />
      ) : (
        <a
          href={`https://solscan.io/token/${ANSEM_ADDRESS}#holders`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-mono text-sm font-bold text-info transition-colors hover:text-text"
        >
          Solscan
          <ExternalLink className="h-3.5 w-3.5 text-dim transition-colors group-hover:text-text" />
        </a>
      ),
    },
  ];

  return (
    <Panel>
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-dim">
          Live Stats
        </span>
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-up">
          <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-up" />
          Streaming
        </span>
      </div>

      <ul className="grid grid-cols-2 divide-x divide-y divide-line/60">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li
              key={it.label}
              className="flex flex-col gap-1.5 p-4 transition-colors hover:bg-raised/50"
            >
              <div className="flex items-center gap-1.5 text-dim">
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
    </Panel>
  );
}
