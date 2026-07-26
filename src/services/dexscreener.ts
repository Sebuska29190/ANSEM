import {
  DEXSCREENER_TOKEN_API,
  DEXSCREENER_PAIRS_API,
  ANSEM_ADDRESS,
} from "../lib/constants";
import type { TokenPair, TokenMetrics } from "../types";

export interface DexScreenerTokenData {
  pairs: TokenPair[];
  topPair: TokenPair | null;
  metrics: TokenMetrics | null;
}

function buildMetrics(pair: TokenPair): TokenMetrics {
  const liquidityUsd = pair.liquidity?.usd ?? null;
  const volume24h = pair.volume?.h24 ?? null;
  const priceChange24h = pair.priceChange?.h24 ?? null;

  return {
    priceUsd: Number.parseFloat(pair.priceUsd) || 0,
    marketCap: pair.marketCap ?? null,
    fdv: pair.fdv ?? null,
    liquidityUsd,
    volume24h,
    priceChange24h,
    buys24h: pair.txns?.h24?.buys ?? 0,
    sells24h: pair.txns?.h24?.sells ?? 0,
    pairAddress: pair.pairAddress,
    baseSymbol: pair.baseToken?.symbol ?? "ANSEM",
    quoteSymbol: pair.quoteToken?.symbol ?? "SOL",
    dexId: pair.dexId,
    updatedAt: Date.now(),
  };
}

export async function fetchTokenData(): Promise<DexScreenerTokenData> {
  const res = await fetch(`${DEXSCREENER_TOKEN_API}/${ANSEM_ADDRESS}`, {
    next: { revalidate: 15 },
  });

  if (!res.ok) {
    throw new Error(`DexScreener token API error: ${res.status}`);
  }

  const pairs = (await res.json()) as TokenPair[];
  const topPair = pairs?.[0] ?? null;

  return {
    pairs: pairs ?? [],
    topPair,
    metrics: topPair ? buildMetrics(topPair) : null,
  };
}

export async function fetchTokenPairs(): Promise<TokenPair[]> {
  const res = await fetch(`${DEXSCREENER_PAIRS_API}/${ANSEM_ADDRESS}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`DexScreener pairs API error: ${res.status}`);
  }

  return ((await res.json()) as TokenPair[]) ?? [];
}

export function getLatestSwapEvents(): never[] {
  // DexScreener free API does not expose a real-time swap feed endpoint.
  // This is a placeholder for future integration with Helius WebSocket or Birdeye trades.
  return [];
}
