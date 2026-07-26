"use client";

import { motion } from "framer-motion";
import { Sparkles, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { useAINews } from "@/hooks/useAINews";

/**
 * AINewsFeed — hacker-terminal feed rendered as a typographic card stack.
 * Each card shows: sentiment chip · timestamp · monospace content.
 * Loader is a shimmering skeleton stack. Empty state is direct copy.
 */

function timeAgo(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function SentimentIcon({ s }: { s: "bullish" | "bearish" | "neutral" }) {
  if (s === "bullish") return <ThumbsUp className="h-3 w-3 text-bull-up" />;
  if (s === "bearish") return <ThumbsDown className="h-3 w-3 text-bull-down" />;
  return <Minus className="h-3 w-3 text-terminal-dim" />;
}

function sentimentChipClass(s: "bullish" | "bearish" | "neutral") {
  return s === "bullish"
    ? "bg-bull-up/10 text-bull-up ring-bull-up/30"
    : s === "bearish"
    ? "bg-bull-down/10 text-bull-down ring-bull-down/30"
    : "bg-white/[0.04] text-terminal-dim ring-white/[0.06]";
}

export function AINewsFeed() {
  const { data: news, isLoading } = useAINews();

  return (
    <section className="glass-panel flex h-[420px] flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-terminal-dim">
            AI Intelligence
          </span>
        </div>
        <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-gold">
          Daily · DeepSeek
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-4 pr-2">
        {isLoading ? (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-white/[0.03]" />
            ))}
          </>
        ) : !news || news.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-terminal-dim">
            <Sparkles className="mb-2 h-6 w-6 text-gold/40" />
            Awaiting first AI briefing.
            <br />
            <span className="mt-1 text-xs">
              Scheduled function publishes every 4 hours.
            </span>
          </div>
        ) : (
          news.slice(0, 6).map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-gold/30 hover:bg-gold/[0.03]"
            >
              <header className="mb-2 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] ring-1 ${sentimentChipClass(
                    item.sentiment,
                  )}`}
                >
                  <SentimentIcon s={item.sentiment} />
                  {item.sentiment}
                </span>
                <time
                  dateTime={new Date(item.createdAt).toISOString()}
                  className="font-mono text-[10px] text-terminal-dim"
                >
                  {timeAgo(item.createdAt)}
                </time>
              </header>
              <p className="text-sm leading-relaxed text-white">
                {item.content}
              </p>
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
}
