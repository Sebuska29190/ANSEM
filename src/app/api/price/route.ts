import { NextResponse } from "next/server";
import { fetchTokenData } from "@/services/dexscreener";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchTokenData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Price API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch token data" },
      { status: 500 }
    );
  }
}
