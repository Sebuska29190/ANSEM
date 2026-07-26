import { NextResponse } from "next/server";
import { fetchTokenData } from "@/services/dexscreener";
import { generateAINews } from "@/services/deepseek";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { metrics } = await fetchTokenData();

    if (!metrics) {
      return NextResponse.json(
        { error: "Token metrics not available" },
        { status: 503 }
      );
    }

    const news = await generateAINews({
      priceUsd: metrics.priceUsd,
      priceChange24h: metrics.priceChange24h,
      volume24h: metrics.volume24h,
      liquidityUsd: metrics.liquidityUsd,
    });

    return NextResponse.json([news], {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("AI News API error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI news" },
      { status: 500 }
    );
  }
}
