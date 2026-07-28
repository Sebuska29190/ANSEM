"use client";

import { useState } from "react";
import {
  Maximize2, RefreshCw, ExternalLink, CandlestickChart,
} from "lucide-react";
import { ANSEM_PAIR_ADDRESS } from "@/lib/constants";

/**
 * TradingViewChart
 * ------------------------------------------------------
 * DexScreener official embed for the ANSEM/SOL pair.
 * No fake canvas fallback — the iframe IS the chart.
 */

export function TradingViewChart() {
  const [key, setKey] = useState(0);

  return (
    <section className="glass-panel relative overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-3">
          <CandlestickChart className="h-4 w-4 text-ember" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-terminal-dim">
            Live Chart · DEX
          </span>
          <span className="font-mono text-xs text-white">$ANSEM / SOL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="rounded-lg border border-white/[0.06] p-1.5 text-terminal-dim transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Refresh chart"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <a
            href={`https://dexscreener.com/solana/${ANSEM_PAIR_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/[0.06] p-1.5 text-terminal-dim transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Open on DexScreener"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => {
              const el = document.getElementById("ansem-chart-frame");
              el?.requestFullscreen?.().catch(() => {});
            }}
            className="rounded-lg border border-white/[0.06] p-1.5 text-terminal-dim transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative h-[420px] w-full">
        <iframe
          id="ansem-chart-frame"
          key={`ds-${key}`}
          title="ANSEM DexScreener Chart"
          src={`https://dexscreener.com/solana/${ANSEM_PAIR_ADDRESS}?embed=1&theme=dark&info=0`}
          className="absolute inset-0 h-full w-full border-0 bg-transparent"
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </section>
  );
}
