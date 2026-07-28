import { NextResponse } from "next/server";
import { fetchHolders } from "@/services/solscan";
import { ANSEM_ADDRESS } from "@/lib/constants";

/**
 * GET /api/holders — real holder count + top holders from Solscan Pro v2.
 * Cache: 5 minutes. Falls back to null if no API key.
 */
export async function GET() {
  try {
    const data = await fetchHolders(ANSEM_ADDRESS, 20);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}
