import { NextResponse } from "next/server";
import { fetchTokenData } from "@/services/dexscreener";
import { generateAINews } from "@/services/deepseek";
import { addNewsItem, getNewsHistory } from "@/lib/news-store";
import type { AINewsItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STALE_MS = 25 * 60 * 1000;
const MAX_VISIBLE = 10;

/**
 * GET /api/news
 * ------------------------------------------------------------------
 * Returns the rolling news history (newest first, capped).
 *
 * Behaviour:
 *  - If the store is empty → generate one item right now so the
 *    dashboard never shows the empty state on first load.
 *  - If the top item is older than 25 min → top up with a new one.
 *  - Always returns an array. Always in English (deepseek.ts
 *    enforces; deterministic English fallback when API is down).
 */
export async function GET() {
  try {
    let items = await getNewsHistory();

    const top = items[0];
    const stale = !top || Date.now() - top.createdAt > STALE_MS;

    if (stale) {
      const { metrics } = await fetchTokenData();

      // Even if metrics are unavailable we still want *something*
      // English to display, so generateAINews handles zeros fine.
      const fresh = await generateAINews({
        priceUsd: metrics?.priceUsd ?? 0,
        priceChange24h: metrics?.priceChange24h ?? null,
        volume24h: metrics?.volume24h ?? null,
        liquidityUsd: metrics?.liquidityUsd ?? null,
      });

      items = await addNewsItem(fresh);
    }

    const visible = items.slice(0, MAX_VISIBLE);
    return NextResponse.json(visible, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("AI News API error:", error);
    // Last-resort: synthesise one English item on the fly so the
    // UI never has an empty state.
    try {
      const fallback = await generateAINews({
        priceUsd: 0,
        priceChange24h: null,
        volume24h: null,
        liquidityUsd: null,
      });
      const items = await addNewsItem(fallback);
      return NextResponse.json(items.slice(0, MAX_VISIBLE) as AINewsItem[]);
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch AI news" },
        { status: 500 }
      );
    }
  }
}
