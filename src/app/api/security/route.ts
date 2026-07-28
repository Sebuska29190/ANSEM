import { NextResponse } from "next/server";
import { fetchRiskReport } from "@/services/rugcheck";
import { ANSEM_ADDRESS } from "@/lib/constants";

/**
 * GET /api/security — RugCheck risk report. Public API, no key.
 * Cache: 1 hour.
 */
export async function GET() {
  try {
    const data = await fetchRiskReport(ANSEM_ADDRESS);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}
