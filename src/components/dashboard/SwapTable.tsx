"use client";

import { ArrowDownRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { useSwaps } from "@/hooks/useSwaps";
import { useTokenData } from "@/hooks/useTokenData";
import { truncateWallet, timeAgo } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";

/**
 * SwapTable — REAL on-chain swap transactions from Solscan Pro v2.
 * Each row: BUY/SELL chip · amount in/out · USD · wallet (→ Solscan) · age.
 * Includes a real buy/sell pressure bar derived from DexScreener 24h txns.
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

export function SwapTable() {
  const { data, isLoading } = useSwaps();
  const { data: tokenData } = useTokenData();
  const all = data ?? [];

  const buys = tokenData?.metrics?.buys24h ?? 0;
  const sells = tokenData?.metrics?.sells24h ?? 0;
  const total = buys + sells;
  const buyRatio = total ? Math.round((buys / total) * 100) : 50;

  return (
    <Panel className="overflow-hidden">
      {/* Header + pressure bar */}
      <div className="border-b border-line px-5 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-dim">
            Live Swaps
          </span>
          <span className="font-mono text-[10px] text-dim">
            {all.length > 0 ? `${all.length} real txns` : "on-chain feed"}
          </span>
        </div>
        {total > 0 && (
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-dim">
              <span className="text-up">{buys} buys</span>
              <span className="font-mono">{buyRatio}% buy pressure</span>
              <span className="text-down">{sells} sells</span>
            </div>
            <div className="mt-1.5 flex h-1 w-full overflow-hidden rounded-full bg-raised">
              <div
                className="h-full bg-up transition-all duration-700"
                style={{ width: `${buyRatio}%` }}
              />
              <div
                className="h-full bg-down transition-all duration-700"
                style={{ width: `${100 - buyRatio}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="max-h-[480px] overflow-y-auto">
        <table className="w-full font-mono text-xs">
          <thead className="sticky top-0 z-[1] bg-panel">
            <tr className="text-left text-[10px] font-bold uppercase tracking-[0.18em] text-dim">
              <th className="px-4 py-2">Side</th>
              <th className="px-4 py-2">Amount In → Out</th>
              <th className="px-4 py-2 text-right">USD</th>
              <th className="hidden px-4 py-2 md:table-cell">Wallet</th>
              <th className="px-4 py-2 text-right">Age</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-t border-line/50">
                  {[...Array(5)].map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 w-16 animate-pulse rounded-[2px] bg-raised" />
                    </td>
                  ))}
                </tr>
              ))
            ) : all.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-dim"
                >
                  No recent swaps. The on-chain feed is unavailable right now.
                </td>
              </tr>
            ) : (
              all.slice(0, 25).map((s) => (
                <tr
                  key={s.txHash}
                  className="border-t border-line/50 transition-colors hover:bg-raised/50"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-[2px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        s.type === "buy"
                          ? "bg-up/10 text-up"
                          : "bg-down/10 text-down"
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
                  <td className="px-4 py-3 text-text">
                    {fmt(s.amountIn, 4)} <span className="text-dim">{s.tokenIn}</span>
                    <span className="text-mute"> → </span>
                    {fmt(s.amountOut, 4)} <span className="text-dim">{s.tokenOut}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-text">{usd(s.usdValue)}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <a
                      href={`https://solscan.io/account/${s.wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-dim transition-colors hover:text-info"
                    >
                      {truncateWallet(s.wallet)}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={`https://solscan.io/tx/${s.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dim transition-colors hover:text-info"
                    >
                      {timeAgo(s.timestamp)}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-line px-5 py-2 text-[10px] text-dim">
        Real on-chain transactions via Solana Tracker. Click a wallet or age to inspect on Solscan.
      </div>
    </Panel>
  );
}
