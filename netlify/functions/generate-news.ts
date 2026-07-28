import { schedule } from "@netlify/functions";
import { fetchTokenData } from "../../src/services/dexscreener";
import { generateAINews } from "../../src/services/deepseek";
import { addNewsItem, getNewsHistory } from "../../src/lib/news-store";

/**
 * Scheduled background job — runs every 30 minutes.
 *
 * Reads the current history, skips if a fresh item (<25m) exists,
 * otherwise pulls the latest metrics from DexScreener and appends
 * a new English news item to the shared store.
 *
 * The store mirrors to Netlify Blobs so the /api/news endpoint can
 * hydrate on cold starts.
 */
export const handler = schedule("*/30 * * * *", async () => {
  try {
    const existing = await getNewsHistory();
    const top = existing[0];
    if (top && Date.now() - top.createdAt < 25 * 60 * 1000) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, skipped: true }),
      };
    }

    const { metrics } = await fetchTokenData();
    if (!metrics) {
      return {
        statusCode: 503,
        body: JSON.stringify({ error: "Token metrics not available" }),
      };
    }

    const fresh = await generateAINews({
      priceUsd: metrics.priceUsd,
      priceChange24h: metrics.priceChange24h,
      volume24h: metrics.volume24h,
      liquidityUsd: metrics.liquidityUsd,
    });

    await addNewsItem(fresh);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    console.error("Scheduled function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate AI news" }),
    };
  }
});
