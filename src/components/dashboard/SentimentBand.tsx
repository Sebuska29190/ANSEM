"use client";

import { Gauge, Coins, Activity } from "lucide-react";
import { useSentiment } from "@/hooks/useSentiment";
import { useTokenData } from "@/hooks/useTokenData";
import { formatBigUSD } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";

/**
 * SentimentBand — slim horizontal strip: Fear & Greed + SOL price + 24h stats.
 */

function fgColor(value: number) {
  if (value >= 55) return "text-up";
  if (value <= 45) return "text-down";
  return "text-gold";
}

export function SentimentBand() {
  const { data } = useSentiment();
  const { data: tokenData } = useTokenData();
  const m = tokenData?.metrics;
  const fg = data?.data?.fearGreed;
  const solPrice = data?.data?.solPrice;

  return (
    <Panel>
      <div className="grid grid-cols-1 divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {/* Fear & Greed */}
        <div className="flex items-center gap-4 px-5 py-4">
          <Gauge className="h-5 w-5 shrink-0 text-dim" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dim">
              Crypto Fear &amp; Greed
            </p>
            {fg ? (
              <div className="mt-1 flex items-baseline gap-2">
                <span className={`font-mono text-2xl font-bold ${fgColor(fg.value)}`}>
                  {fg.value}
                </span>
                <span className="text-xs text-dim">{fg.label}</span>
              </div>
            ) : (
              <p className="mt-1 font-mono text-sm text-dim">—</p>
            )}
          </div>
          {fg && (
            <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-raised">
              <div
                className={`h-full ${fgColor(fg.value).replace("text-", "bg-")}`}
                style={{ width: `${fg.value}%` }}
              />
            </div>
          )}
        </div>

        {/* SOL price */}
        <div className="flex items-center gap-4 px-5 py-4">
          <Coins className="h-5 w-5 shrink-0 text-info" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dim">
              SOL / USD
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-info">
              {solPrice !== null && solPrice !== undefined
                ? `$${solPrice.toFixed(2)}`
                : "—"}
            </p>
          </div>
        </div>

        {/* 24h stats */}
        <div className="flex items-center gap-4 px-5 py-4">
          <Activity className="h-5 w-5 shrink-0 text-ember" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dim">
              24h Activity
            </p>
            {m ? (
              <p className="mt-1 font-mono text-sm text-text">
                <span className="text-up">{m.buys24h.toLocaleString()} buys</span>
                <span className="mx-1.5 text-mute">/</span>
                <span className="text-down">{m.sells24h.toLocaleString()} sells</span>
                <span className="ml-2 text-dim">
                  vol {formatBigUSD(m.volume24h)}
                </span>
              </p>
            ) : (
              <p className="mt-1 font-mono text-sm text-dim">—</p>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}
