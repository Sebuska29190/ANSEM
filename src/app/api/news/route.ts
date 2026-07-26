import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { fetchTokenData } from "@/services/dexscreener";
import { generateAINews } from "@/services/deepseek";
import { parseJsonSafe } from "@/lib/blobs";
import type { AINewsItem } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore("ai-news");
    const cached = await store.get("latest");
    let news = parseJsonSafe<AINewsItem>(cached);

    if (!news) {
      const { metrics } = await fetchTokenData();

      if (!metrics) {
        return NextResponse.json(
          { error: "Token metrics not available" },
          { status: 503 }
        );
      }

      news = await generateAINews({
        priceUsd: metrics.priceUsd,
        priceChange24h: metrics.priceChange24h,
        volume24h: metrics.volume24h,
        liquidityUsd: metrics.liquidityUsd,
      });

      await store.setJSON("latest", news);
    }

    return NextResponse.json([news], {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("AI News API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI news" },
      { status: 500 }
    );
  }
}
