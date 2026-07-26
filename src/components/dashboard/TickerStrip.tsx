"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { useTokenData } from "@/hooks/useTokenData";
import { formatBigUSD } from "@/lib/utils";

/**
 * TickerStrip — slim horizontal data tape below the hero.
 * Reserves a 50 px slot before live data arrives so the rest
 * of the page doesn't shift when metrics first resolve.
 */

function SparkBar({ values, up }: { values: number[]; up: boolean }) {
  const max = Math.max(...values, 1);
  return (
    <svg width={48} height={16} viewBox="0 0 48 16" aria-hidden>
      {values.map((v, i) => {
        const h = (v / max) * 14;
        return (
          <rect
            key={i}
            x={i * 9 + 2}
            y={15 - h}
            width={5}
            height={h}
            rx={1}
            fill={up ? "#00C853" : "#FF1744"}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
}

type Chip = { label: string; value: string; delta: number; spark: number[] };

export function TickerStrip() {
  const { data } = useTokenData();
  const m = data?.metrics;
  const hasReal = !!m && m.priceUsd > 0;

  // Skeleton placeholder so the slot has a stable height before live data lands
  if (!hasReal) {
    return (
      <div
        className="relative border-y border-white/[0.06] bg-obsidian/80 backdrop-blur-md"
        aria-hidden
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent" />
        <div className="flex h-[50px] items-center justify-center gap-2 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-terminal-dim">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
          </span>
          Awaiting first live ticks…
        </div>
      </div>
    );
  }

  const chips: Chip[] = [
    {
      label: "$ANSEM",
      value:
        m!.priceUsd < 0.01
          ? `$${m!.priceUsd.toExponential(2)}`
          : `$${m!.priceUsd.toLocaleString("en-US", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 6,
            })}`,
      delta: m!.priceChange24h ?? 0,
      spark: [1, 2, 1, 3, 4, 3, 5],
    },
    {
      label: "MARKET CAP",
      value: formatBigUSD(m!.marketCap ?? 0),
      delta: m!.priceChange24h ?? 0,
      spark: [2, 3, 2, 4, 5, 4, 6],
    },
    {
      label: "24H VOL",
      value: formatBigUSD(m!.volume24h ?? 0),
      delta: m!.priceChange24h ?? 0,
      spark: [3, 1, 4, 2, 5, 3, 4],
    },
    {
      label: "LIQUIDITY",
      value: formatBigUSD(m!.liquidityUsd ?? 0),
      delta: 0,
      spark: [4, 4, 4, 5, 4, 4, 5],
    },
    {
      label: "BUYS · 24H",
      value: `${m!.buys24h}`,
      delta: 0,
      spark: [2, 3, 4, 3, 5, 6, 5],
    },
    {
      label: "SELLS · 24H",
      value: `${m!.sells24h}`,
      delta: 0,
      spark: [3, 2, 3, 4, 3, 5, 3],
    },
  ];

  return (
    <div className="relative border-y border-white/[0.06] bg-obsidian/80 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent" />
      <div className="min-h-[52px] py-3">
        <Marquee speedSeconds={45}>
          {chips.map((c, i) => (
            <div
              key={`${c.label}-${i}`}
              className="flex items-center gap-3 font-mono text-xs"
            >
              <span className="font-bold uppercase tracking-[0.18em] text-terminal-dim">
                {c.label}
              </span>
              <span className="text-white">{c.value}</span>
              <SparkBar values={c.spark} up={c.delta >= 0} />
              <span
                className={
                  c.delta >= 0
                    ? "text-bull-up"
                    : c.delta < 0
                    ? "text-bull-down"
                    : "text-terminal-dim"
                }
              >
                {c.delta >= 0 ? (
                  <TrendingUp className="inline h-3 w-3" />
                ) : (
                  <TrendingDown className="inline h-3 w-3" />
                )}{" "}
                {c.delta.toFixed(2)}%
              </span>
              {i < chips.length - 1 && (
                <span aria-hidden className="mx-4 h-3 w-px bg-white/10" />
              )}
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
