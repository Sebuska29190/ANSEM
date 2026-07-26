import { NextResponse } from "next/server";
import { fetchTokenData, deriveLiquidityEvents } from "../../../services/dexscreener";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { topPair } = await fetchTokenData();

    if (!topPair) {
      return NextResponse.json(
        { error: "No pair data available" },
        { status: 503 }
      );
    }

    const events = deriveLiquidityEvents(topPair);

    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Liquidity API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch liquidity data" },
      { status: 500 }
    );
  }
}
