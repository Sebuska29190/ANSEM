"use client";

import { Droplets, ExternalLink } from "lucide-react";
import { useTokenData } from "@/hooks/useTokenData";
import type { TokenPair } from "@/types";
import { Panel } from "@/components/ui/Panel";

/**
 * LiquidityPools — real pool depth from DexScreener.
 * No demo fallback: if data isn't there, we say so.
 */

function formatReserve(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toLocaleString("en-US")}`;
}

export function LiquidityPools() {
  const { data, isLoading } = useTokenData();
  const rows: TokenPair[] = (data?.pairs ?? []).slice(0, 5);
  const maxLiq = Math.max(...rows.map((r) => r.liquidity?.usd ?? 0), 1);

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-info" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-dim">
            Liquidity Pools
          </span>
        </div>
        <span className="rounded-[2px] border border-line px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-dim">
          Solana
        </span>
      </div>

      <ul className="divide-y divide-line/60">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <li key={i} className="h-16 animate-pulse bg-raised/40" />
          ))
        ) : rows.length === 0 ? (
          <li className="px-5 py-10 text-center text-sm text-dim">
            No pool data available right now.
          </li>
        ) : (
          rows.map((p) => {
            const liq = p.liquidity?.usd ?? 0;
            const pct = Math.min(100, Math.round((liq / maxLiq) * 100));
            const change = p.priceChange?.h24 ?? 0;
            return (
              <li
                key={p.pairAddress}
                className="group flex items-center justify-between gap-3 p-4 transition-colors hover:bg-raised/50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-text transition-colors hover:text-info"
                    >
                      {p.baseToken?.symbol ?? "ANSEM"}
                      <span className="text-mute">/</span>
                      <span className="font-medium text-dim">
                        {p.quoteToken?.symbol ?? "SOL"}
                      </span>
                      <ExternalLink className="h-2.5 w-2.5 text-dim opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                    <span className="rounded-[2px] border border-line px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-dim">
                      {p.dexId}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 w-24 overflow-hidden rounded-full bg-raised">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-info to-ember"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-dim">
                      {pct}% depth
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold text-text">
                    {formatReserve(liq)}
                  </div>
                  <div
                    className={`font-mono text-[10px] ${
                      change >= 0 ? "text-up" : "text-down"
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
      <div className="border-t border-line px-5 py-2 text-[10px] text-dim">
        Live pool depth via DexScreener.
      </div>
    </Panel>
  );
}
