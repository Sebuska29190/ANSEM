"use client";

import { useMemo } from "react";
import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTokenData } from "@/hooks/useTokenData";
import { useSentiment } from "@/hooks/useSentiment";
import { formatBigUSD } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";

/**
 * MarketBrief — rule-based market commentary generated from REAL metrics.
 * Zero API keys, always works. Replaces the DeepSeek AI news feed.
 */
export function MarketBrief() {
  const { data } = useTokenData();
  const { data: sentiment } = useSentiment();
  const m = data?.metrics;
  const fg = sentiment?.data?.fearGreed;

  const brief = useMemo(() => {
    if (!m) return null;

    const delta = m.priceChange24h ?? 0;
    const buys = m.buys24h ?? 0;
    const sells = m.sells24h ?? 0;
    const total = buys + sells;
    const buyRatio = total ? (buys / total) * 100 : 50;
    const volLiq =
      m.volume24h && m.liquidityUsd ? m.volume24h / m.liquidityUsd : null;

    let sentimentLabel: "bullish" | "bearish" | "neutral" = "neutral";
    if (delta > 3 && buyRatio >= 52) sentimentLabel = "bullish";
    else if (delta < -3 && buyRatio <= 48) sentimentLabel = "bearish";

    const lines: string[] = [];

    // Price action
    if (delta > 5) {
      lines.push(
        `$ANSEM is up ${delta.toFixed(1)}% over 24h, trading at ${formatBigUSD(m.marketCap)} market cap.`
      );
    } else if (delta < -5) {
      lines.push(
        `$ANSEM is down ${Math.abs(delta).toFixed(1)}% over 24h, holding a ${formatBigUSD(m.marketCap)} market cap.`
      );
    } else {
      lines.push(
        `$ANSEM is consolidating (${delta >= 0 ? "+" : ""}${delta.toFixed(1)}% 24h) at a ${formatBigUSD(m.marketCap)} market cap.`
      );
    }

    // Flow pressure
    if (buyRatio >= 55) {
      lines.push(
        `Buy-side pressure dominates: ${buys.toLocaleString()} buys vs ${sells.toLocaleString()} sells (${Math.round(buyRatio)}% buy ratio).`
      );
    } else if (buyRatio <= 45) {
      lines.push(
        `Sell-side pressure leads: ${sells.toLocaleString()} sells vs ${buys.toLocaleString()} buys (${Math.round(100 - buyRatio)}% sell ratio).`
      );
    } else {
      lines.push(
        `Order flow is balanced: ${buys.toLocaleString()} buys vs ${sells.toLocaleString()} sells.`
      );
    }

    // Volume vs liquidity
    if (volLiq !== null) {
      if (volLiq > 1) {
        lines.push(
          `24h volume (${formatBigUSD(m.volume24h)}) is ${volLiq.toFixed(1)}× the ${formatBigUSD(m.liquidityUsd)} liquidity pool — high turnover.`
        );
      } else {
        lines.push(
          `24h volume (${formatBigUSD(m.volume24h)}) sits at ${(volLiq * 100).toFixed(0)}% of ${formatBigUSD(m.liquidityUsd)} pool liquidity.`
        );
      }
    }

    // Macro sentiment
    if (fg) {
      lines.push(`Broader market sentiment: ${fg.label} (${fg.value}/100).`);
    }

    return { sentimentLabel, lines };
  }, [m, fg]);

  const icon =
    brief?.sentimentLabel === "bullish" ? (
      <TrendingUp className="h-3.5 w-3.5 text-up" />
    ) : brief?.sentimentLabel === "bearish" ? (
      <TrendingDown className="h-3.5 w-3.5 text-down" />
    ) : (
      <Minus className="h-3.5 w-3.5 text-dim" />
    );

  const badge =
    brief?.sentimentLabel === "bullish"
      ? "bg-up/10 text-up ring-1 ring-up/20"
      : brief?.sentimentLabel === "bearish"
        ? "bg-down/10 text-down ring-1 ring-down/20"
        : "bg-raised text-dim ring-1 ring-line";

  return (
    <Panel className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-dim">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          Market Brief
        </span>
        {brief && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${badge}`}
          >
            {icon}
            {brief.sentimentLabel}
          </span>
        )}
      </div>

      <div className="flex-1 space-y-4 p-5">
        {!brief ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded-[2px] bg-raised" />
            ))}
          </div>
        ) : (
          brief.lines.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed text-text/90">
              <span className="mr-2 font-mono text-[10px] font-bold text-ember">
                {String(i + 1).padStart(2, "0")}
              </span>
              {line}
            </p>
          ))
        )}
      </div>

      <div className="border-t border-line px-5 py-2 text-[10px] text-dim">
        Rule-based commentary from live on-chain metrics. Not financial advice.
      </div>
    </Panel>
  );
}
