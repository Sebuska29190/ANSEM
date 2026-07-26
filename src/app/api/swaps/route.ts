import { NextResponse } from "next/server";
import { fetchTokenData, deriveSwapEvents } from "../../../services/dexscreener";

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

    const events = deriveSwapEvents(topPair);

    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Swaps API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch swap data" },
      { status: 500 }
    );
  }
}
