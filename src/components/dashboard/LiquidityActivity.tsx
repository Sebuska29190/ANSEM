"use client";

import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { useLiquidity } from "@/hooks/useLiquidity";
import { ANSEM_ADDRESS } from "@/lib/constants";
import { truncateWallet, timeAgo } from "@/lib/utils";

/**
 * LiquidityActivity — recent on-chain pool adds/removes.
 * Companion panel to SwapTable.
 */

function usd(n: number) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toLocaleString("en-US")}`;
}

export function LiquidityActivity() {
  const { data, isLoading } = useLiquidity();
  const items = (data ?? []).slice(0, 12);

  return (
    <section className="glass-panel overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="h-4 w-4 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-terminal-dim">
            Liquidity Activity
          </span>
        </div>
        <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-gold">
          24h
        </span>
      </div>

      <ul className="max-h-[420px] divide-y divide-white/[0.04] overflow-y-auto">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <li key={i} className="h-14 animate-pulse bg-white/[0.02]" />
          ))
        ) : items.length === 0 ? (
          <li className="px-5 py-10 text-center text-sm text-terminal-dim">
            No liquidity events in window.
          </li>
        ) : (
          items.map((e) => (
            <li
              key={e.txSignature}
              className={`flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-white/[0.025] ${
                e.type === "added"
                  ? "border-l-2 border-l-bull-up/40"
                  : "border-l-2 border-l-bull-down/40"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    e.type === "added"
                      ? "bg-bull-up/10 text-bull-up"
                      : "bg-bull-down/10 text-bull-down"
                  }`}
                >
                  {e.type === "added" ? (
                    <Plus className="h-3.5 w-3.5" />
                  ) : (
                    <Minus className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="font-mono text-xs text-white">
                    {e.solAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
                    <span className="text-terminal-dim">SOL</span>
                    <span className="text-terminal-dim"> · </span>
                    {(e.tokenAmount / 1e6).toFixed(2)}M{" "}
                    <span className="text-terminal-dim">ANSEM</span>
                  </div>
                  <div className="font-mono text-[10px] text-terminal-dim">
                    {truncateWallet(e.wallet)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-white">{usd(e.usdValue)}</div>
                <div className="font-mono text-[10px] text-terminal-dim">
                  {timeAgo(e.timestamp)}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className="border-t border-white/[0.06] px-5 py-2 text-[10px] text-terminal-dim">
        <a
          href={`https://solscan.io/token/${ANSEM_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-ember"
        >
          Verify on Solscan →
        </a>
      </div>
    </section>
  );
}
