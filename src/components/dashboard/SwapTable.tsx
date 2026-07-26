"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useSwaps } from "@/hooks/useSwaps";
import type { SwapEvent } from "@/types";
import { truncateWallet, timeAgo } from "@/lib/utils";

/**
 * SwapTable — high-density terminal-style feed of recent on-chain swaps.
 * Each row: BUY/SELL chip · amount in/out · USD · wallet (mono) · age.
 * Top 25 only (perf) + buyer rows get a faint green wash, sellers faint red.
 */

function fmt(n: number, dp = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

function usd(n: number | null) {
  if (n === null || n === undefined) return "—";
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${fmt(n, 2)}`;
}

export function SwapTable({ swaps: extra }: { swaps?: SwapEvent[] } = {}) {
  const { data, isLoading } = useSwaps();
  const all = data ?? extra ?? [];

  return (
    <section className="glass-panel overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-terminal-dim">
          Recent Swaps
        </span>
        <span className="font-mono text-[10px] text-terminal-dim">
          {all ? `${all.length} txns` : "—"}
        </span>
      </div>

      <div className="max-h-[480px] overflow-y-auto">
        <table className="w-full font-mono text-xs">
          <thead className="sticky top-0 z-[1] bg-obsidian/80 backdrop-blur">
            <tr className="text-left text-[10px] font-bold uppercase tracking-[0.18em] text-terminal-dim">
              <th className="px-4 py-2">Side</th>
              <th className="px-4 py-2">Amount In → Out</th>
              <th className="px-4 py-2 text-right">USD</th>
              <th className="px-4 py-2 hidden md:table-cell">Wallet</th>
              <th className="px-4 py-2 text-right">Age</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-t border-white/[0.03]">
                  {[...Array(5)].map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
                    </td>
                  ))}
                </tr>
              ))
            ) : all.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-terminal-dim">
                  No swap data yet. Streaming soon.
                </td>
              </tr>
            ) : (
              all.slice(0, 25).map((s) => (
                <tr
                  key={s.txHash}
                  className={`border-t border-white/[0.03] transition-colors hover:bg-white/[0.025] ${
                    s.type === "buy"
                      ? "hover:border-bull-up/20"
                      : "hover:border-bull-down/20"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        s.type === "buy"
                          ? "bg-bull-up/10 text-bull-up"
                          : "bg-bull-down/10 text-bull-down"
                      }`}
                    >
                      {s.type === "buy" ? (
                        <ArrowUpRight className="h-2.5 w-2.5" />
                      ) : (
                        <ArrowDownRight className="h-2.5 w-2.5" />
                      )}
                      {s.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white">
                    {fmt(s.amountIn, 4)} <span className="text-terminal-dim">{s.tokenIn}</span>
                    <span className="text-terminal-dim"> → </span>
                    {fmt(s.amountOut, 4)} <span className="text-terminal-dim">{s.tokenOut}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-white">{usd(s.usdValue)}</td>
                  <td className="hidden px-4 py-3 text-terminal-dim md:table-cell">
                    {truncateWallet(s.wallet)}
                  </td>
                  <td className="px-4 py-3 text-right text-terminal-dim">
                    {timeAgo(s.timestamp)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-white/[0.06] px-5 py-2 text-[10px] text-terminal-dim">
        Representative feed derived from 24h DexScreener aggregates, not individual on-chain transactions.
      </div>
    </section>
  );
}
