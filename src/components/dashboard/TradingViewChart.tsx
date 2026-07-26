"use client";

import { useEffect, useRef, useState } from "react";
import {
  Maximize2, RefreshCw, ExternalLink, CandlestickChart,
} from "lucide-react";
import { ANSEM_ADDRESS } from "@/lib/constants";

/**
 * TradingViewChart
 * ------------------------------------------------------
 * Real TradingView isn't free for memecoins, but DexScreener
 * offers a high-fidelity embed for any Solana pair. We use
 * their official embed URL plus our own lightweight-charts
 * canvas underneath as an offline / pre-load fallback.
 *
 * Uses lightweight-charts v5 API: addSeries(SeriesDefinition, options).
 * Type-safe — no `any` casts.
 */

type Mode = "candle" | "line";
type UTCTimestamp = import("lightweight-charts").UTCTimestamp;

export function TradingViewChart({
  initialMode = "candle",
}: {
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [key, setKey] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    (async () => {
      if (!canvasRef.current) return;
      try {
        const lc = await import("lightweight-charts");
        const { createChart, CandlestickSeries, LineSeries } = lc as unknown as typeof import("lightweight-charts") & {
          CandlestickSeries: import("lightweight-charts").SeriesDefinition<"Candlestick">;
          LineSeries: import("lightweight-charts").SeriesDefinition<"Line">;
        };

        const instance = createChart(canvasRef.current, {
          layout: {
            background: { color: "transparent" },
            textColor: "#6B6B70",
            fontFamily: "var(--font-geist-mono), monospace",
          },
          grid: {
            vertLines: { color: "rgba(255,255,255,0.025)" },
            horzLines: { color: "rgba(255,255,255,0.025)" },
          },
          crosshair: { mode: 0 },
          rightPriceScale: { borderColor: "rgba(255,255,255,0.06)" },
          timeScale: { borderColor: "rgba(255,255,255,0.06)", timeVisible: true },
          autoSize: true,
        });

        const now = Math.floor(Date.now() / 1000) as UTCTimestamp;

        if (mode === "candle") {
          const series = instance.addSeries(CandlestickSeries, {
            upColor: "#00C853",
            downColor: "#FF1744",
            borderVisible: false,
            wickUpColor: "#00C853",
            wickDownColor: "#FF1744",
          });
          series.setData(
            Array.from({ length: 60 }, (_, i) => {
              const base = 0.0005 + Math.sin(i / 6) * 0.00015;
              const open = base;
              const close = base + Math.sin(i / 4) * 0.00008;
              const hi = Math.max(open, close) + 0.00004;
              const lo = Math.min(open, close) - 0.00004;
              return {
                time: (now - (60 - i) * 3600) as UTCTimestamp,
                open,
                high: hi,
                low: lo,
                close,
              };
            }),
          );
        } else {
          const series = instance.addSeries(LineSeries, {
            color: "#FF4500",
            lineWidth: 2,
          });
          series.setData(
            Array.from({ length: 60 }, (_, i) => ({
              time: (now - (60 - i) * 3600) as UTCTimestamp,
              value: 0.0005 + Math.sin(i / 6) * 0.00015,
            })),
          );
        }

        cleanup = () => {
          try {
            instance.remove();
          } catch {
            /* ignore */
          }
        };
      } catch {
        /* canvas fallback unavailable — iframe covers it */
      }
    })();

    return () => {
      try {
        cleanup?.();
      } catch {
        /* noop */
      }
    };
  }, [mode, key]);

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
          <div className="flex rounded-lg border border-white/[0.06] p-0.5 text-[10px] font-bold uppercase tracking-[0.18em]">
            {(["candle", "line"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md px-2 py-1 transition-colors ${
                  mode === m
                    ? "bg-ember/15 text-ember"
                    : "text-terminal-dim hover:text-white"
                }`}
                aria-pressed={mode === m}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={() => setKey((k) => k + 1)}
            className="rounded-lg border border-white/[0.06] p-1.5 text-terminal-dim transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Refresh chart"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <a
            href={`https://dexscreener.com/solana/${ANSEM_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/[0.06] p-1.5 text-terminal-dim transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Open on DexScreener"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => {
              const el = canvasRef.current?.parentElement;
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
          key={`ds-${key}`}
          title="ANSEM DexScreener Chart"
          src={`https://dexscreener.com/solana/${ANSEM_ADDRESS}?embed=1&theme=dark&info=0`}
          className="absolute inset-0 h-full w-full border-0 bg-transparent"
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
        <div
          ref={canvasRef}
          className="pointer-events-none absolute inset-0"
          aria-hidden
        />
      </div>
    </section>
  );
}
