import { NextResponse } from "next/server";
import { fetchFearGreed, fetchSolPrice } from "@/services/sentiment";

/**
 * GET /api/sentiment — Fear & Greed index + SOL price.
 * Both public, no key. Cache: F&G 1h, SOL 30s (handled at service level).
 */
export async function GET() {
  try {
    const [fearGreed, solPrice] = await Promise.all([
      fetchFearGreed(),
      fetchSolPrice(),
    ]);
    return NextResponse.json({ success: true, data: { fearGreed, solPrice } });
  } catch {
    return NextResponse.json(
      { success: false, data: { fearGreed: null, solPrice: null } },
      { status: 500 }
    );
  }
}
