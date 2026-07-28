import { NextResponse } from "next/server";
import { fetchRecentSwaps } from "@/services/solscan";
import { fetchSolPrice } from "@/services/sentiment";
import { ANSEM_ADDRESS } from "@/lib/constants";
import type { SwapEvent } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/swaps — REAL swap transactions from Solscan Pro v2.
 * Maps defi activities to SwapEvent. Buy = SOL→ANSEM, Sell = ANSEM→SOL.
 * USD value computed from the SOL leg using Jupiter price.
 */
export async function GET() {
  try {
    const [rawSwaps, solPriceUsd] = await Promise.all([
      fetchRecentSwaps(ANSEM_ADDRESS, 20),
      fetchSolPrice(),
    ]);

    const SOL_MINT = "So11111111111111111111111111111111111111112";

    const events: SwapEvent[] = rawSwaps
      .map((s) => {
        const amt1 = s.amount1 / Math.pow(10, s.token1Decimals);
        const amt2 = s.amount2 / Math.pow(10, s.token2Decimals);

        const ansemIsToken1 = s.token1 === ANSEM_ADDRESS;
        const ansemIsToken2 = s.token2 === ANSEM_ADDRESS;
        if (!ansemIsToken1 && !ansemIsToken2) return null;

        // token1 → token2: token1 is spent, token2 is received.
        const type: SwapEvent["type"] = ansemIsToken1 ? "sell" : "buy";

        const solLeg =
          s.token1 === SOL_MINT ? amt1 : s.token2 === SOL_MINT ? amt2 : null;
        const usdValue =
          solLeg !== null && solPriceUsd !== null
            ? solLeg * solPriceUsd
            : null;

        return {
          txHash: s.txId,
          type,
          amountIn: ansemIsToken1 ? amt1 : amt2,
          amountOut: ansemIsToken1 ? amt2 : amt1,
          tokenIn: ansemIsToken1 ? "ANSEM" : "SOL",
          tokenOut: ansemIsToken1 ? "SOL" : "ANSEM",
          usdValue,
          wallet: s.fromAddress,
          timestamp: s.blockTime * 1000,
        } satisfies SwapEvent;
      })
      .filter((e): e is SwapEvent => e !== null);

    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
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
