import { schedule } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { fetchTokenData } from "../../src/services/dexscreener";
import { generateAINews } from "../../src/services/deepseek";
import { parseJsonSafe } from "../../src/lib/blobs";
import type { AINewsItem } from "../../src/types";

export const handler = schedule("*/30 * * * *", async () => {
  try {
    const { metrics } = await fetchTokenData();

    if (!metrics) {
      return {
        statusCode: 503,
        body: JSON.stringify({ error: "Token metrics not available" }),
      };
    }

    const store = getStore("ai-news");
    const cached = await store.get("latest");
    const existing = parseJsonSafe<AINewsItem>(cached);

    // Skip if we already generated news in the last 25 minutes
    if (existing && Date.now() - existing.createdAt < 25 * 60 * 1000) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, skipped: true, news: existing }),
      };
    }

    const news = await generateAINews({
      priceUsd: metrics.priceUsd,
      priceChange24h: metrics.priceChange24h,
      volume24h: metrics.volume24h,
      liquidityUsd: metrics.liquidityUsd,
    });

    await store.setJSON("latest", news);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, news }),
    };
  } catch (error) {
    console.error("Scheduled function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate AI news" }),
    };
  }
});
