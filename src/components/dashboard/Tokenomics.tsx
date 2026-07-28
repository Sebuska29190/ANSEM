"use client";

import { ExternalLink } from "lucide-react";
import { useHolders } from "@/hooks/useHolders";
import { useTokenData } from "@/hooks/useTokenData";
import { ANSEM_ADDRESS } from "@/lib/constants";
import { Panel } from "@/components/ui/Panel";
import { NumberTicker } from "@/components/ui/NumberTicker";

/**
 * Tokenomics — real supply, launch date, and top holders from Solscan.
 * Holder count is REAL (data.total), top holders show % with a bar.
 */

function fmtAmount(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function Tokenomics() {
  const { data, isLoading } = useHolders();
  const { data: tokenData } = useTokenData();

  const holders = data?.data;
  const pairCreatedAt = tokenData?.topPair?.createdAt;
  const launchDate = pairCreatedAt
    ? new Date(pairCreatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Supply card */}
      <Panel className="lg:col-span-4">
        <div className="border-b border-line px-5 py-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-dim">
            Supply
          </span>
        </div>
        <div className="space-y-5 p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dim">
              Total Supply
            </p>
            <p className="mt-1 font-mono text-3xl font-bold text-text">
              1.0B
            </p>
            <p className="mt-0.5 text-[10px] text-dim">ANSEM · 9 decimals</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dim">
              Holders
            </p>
            {isLoading ? (
              <div className="mt-1 h-8 w-32 animate-pulse rounded-[2px] bg-raised" />
            ) : holders ? (
              <NumberTicker
                value={holders.total}
                format={(v) => v.toLocaleString("en-US")}
                size="lg"
                className="mt-1"
              />
            ) : (
              <a
                href={`https://solscan.io/token/${ANSEM_ADDRESS}#holders`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 font-mono text-sm text-info hover:underline"
              >
                View on Solscan <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dim">
              Launched
            </p>
            <p className="mt-1 font-mono text-sm font-medium text-text">
              {launchDate ?? "—"}
            </p>
          </div>
        </div>
      </Panel>

      {/* Top holders table */}
      <Panel className="overflow-hidden lg:col-span-8">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-dim">
            Top Holders
          </span>
          <a
            href={`https://solscan.io/token/${ANSEM_ADDRESS}#holders`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-info transition-colors hover:text-text"
          >
            All holders <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="max-h-[380px] overflow-y-auto">
          <table className="w-full font-mono text-xs">
            <thead className="sticky top-0 z-[1] bg-panel">
              <tr className="text-left text-[10px] font-bold uppercase tracking-[0.18em] text-dim">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-right">Value</th>
                <th className="px-4 py-2 text-right w-1/4">%</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-t border-line/50">
                    {[...Array(5)].map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 w-16 animate-pulse rounded-[2px] bg-raised" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !holders || holders.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-dim">
                    Holder data unavailable.
                  </td>
                </tr>
              ) : (
                holders.items.map((h) => (
                  <tr
                    key={h.address}
                    className="border-t border-line/50 transition-colors hover:bg-raised/50"
                  >
                    <td className="px-4 py-3 text-dim">{h.rank}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://solscan.io/account/${h.owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-text transition-colors hover:text-info"
                      >
                        {h.owner.slice(0, 4)}…{h.owner.slice(-4)}
                        <ExternalLink className="h-2.5 w-2.5 text-dim" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right text-text">
                      {fmtAmount(h.amount / Math.pow(10, h.decimals))}
                    </td>
                    <td className="px-4 py-3 text-right text-dim">
                      ${h.value >= 1e6 ? `${(h.value / 1e6).toFixed(2)}M` : h.value >= 1e3 ? `${(h.value / 1e3).toFixed(1)}K` : h.value.toFixed(0)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1 w-20 overflow-hidden rounded-full bg-raised">
                          <div
                            className="h-full bg-ember"
                            style={{ width: `${Math.min(h.percentage, 100)}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-text">
                          {h.percentage.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line px-5 py-2 text-[10px] text-dim">
          Real holder distribution via Solana Tracker.
        </div>
      </Panel>
    </div>
  );
}
