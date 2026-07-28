"use client";

import { useState } from "react";
import { Maximize2, RefreshCw, ExternalLink, CandlestickChart } from "lucide-react";
import { ANSEM_PAIR_ADDRESS } from "@/lib/constants";
import { Panel } from "@/components/ui/Panel";

/**
 * TradingViewChart — DexScreener official embed for the ANSEM/SOL pair.
 * No fake canvas fallback — the iframe IS the chart.
 */
export function TradingViewChart() {
  const [key, setKey] = useState(0);
  const [loaded, setLoaded] = useState(false);

  return (
    <Panel className="relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-3">
          <CandlestickChart className="h-4 w-4 text-ember" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-dim">
            Live Chart · DEX
          </span>
          <span className="font-mono text-xs text-text">$ANSEM / SOL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setLoaded(false); setKey((k) => k + 1); }}
            className="rounded-[2px] border border-line p-1.5 text-dim transition-colors hover:border-ember/40 hover:text-text"
            aria-label="Refresh chart"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <a
            href={`https://dexscreener.com/solana/${ANSEM_PAIR_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2px] border border-line p-1.5 text-dim transition-colors hover:border-ember/40 hover:text-text"
            aria-label="Open on DexScreener"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => {
              const el = document.getElementById("ansem-chart-frame");
              el?.requestFullscreen?.().catch(() => {});
            }}
            className="rounded-[2px] border border-line p-1.5 text-dim transition-colors hover:border-ember/40 hover:text-text"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative h-[420px] w-full">
        {/* Skeleton while iframe loads */}
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-panel">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ember" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
              Loading chart…
            </span>
          </div>
        )}
        <iframe
          id="ansem-chart-frame"
          key={`ds-${key}`}
          title="ANSEM DexScreener Chart"
          src={`https://dexscreener.com/solana/${ANSEM_PAIR_ADDRESS}?embed=1&theme=dark&info=0`}
          className="absolute inset-0 h-full w-full border-0 bg-transparent"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </Panel>
  );
}
