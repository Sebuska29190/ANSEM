import {
  DEXSCREENER_TOKEN_API,
  DEXSCREENER_PAIRS_API,
  ANSEM_ADDRESS,
} from "../lib/constants";
import type {
  TokenPair,
  TokenMetrics,
  SwapEvent,
  LiquidityEvent,
} from "../types";

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

// Seeded random helpers so the same pair data yields the same events on
// every render / API call. This avoids React hydration jitter and keeps the
// feed stable between polls. The seed includes the current UTC day so the
// feed stays consistent throughout the day but refreshes daily.
function getSeed(base: string): string {
  const day = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  return `${base}-${day}`;
}

function createSeededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function solPriceFromPair(pair: TokenPair): number {
  const priceUsd = Number.parseFloat(pair.priceUsd) || 0;
  const priceNative = Number.parseFloat(pair.priceNative) || 0;
  if (priceUsd > 0 && priceNative > 0) {
    return priceUsd * priceNative;
  }
  return 150;
}

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function generateWallet(seed: string, index: number): string {
  const random = createSeededRandom(`${seed}-wallet-${index}`);
  // Solana addresses are base58-encoded 32-byte public keys and typically
  // 43-44 characters long. This produces a visually plausible address while
  // still being representative rather than real.
  let wallet = "";
  for (let i = 0; i < 44; i++) {
    wallet += BASE58_ALPHABET[Math.floor(random() * BASE58_ALPHABET.length)];
  }
  return wallet;
}

function generateTxHash(seed: string, index: number): string {
  const random = createSeededRandom(`${seed}-tx-${index}`);
  let hash = "";
  for (let i = 0; i < 88; i++) {
    // Solana transaction signatures are base58-encoded 64-byte hashes and
    // usually ~87-88 characters long.
    hash += BASE58_ALPHABET[Math.floor(random() * BASE58_ALPHABET.length)];
  }
  return hash;
}

export function deriveSwapEvents(pair: TokenPair): SwapEvent[] {
  const seed = getSeed(pair.pairAddress);
  const random = createSeededRandom(seed);
  const h24 = pair.txns?.h24 ?? { buys: 0, sells: 0 };
  const volume24h = pair.volume?.h24 ?? 0;
  const priceUsd = Number.parseFloat(pair.priceUsd) || 0;
  const baseSymbol = pair.baseToken?.symbol ?? "ANSEM";
  const quoteSymbol = pair.quoteToken?.symbol ?? "SOL";

  const totalSwaps = Math.max(h24.buys + h24.sells, 20);
  const averageUsd = volume24h / totalSwaps || 1000;
  const solPrice = solPriceFromPair(pair);

  const events: SwapEvent[] = [];
  let index = 0;

  const makeEvent = (type: "buy" | "sell") => {
    const variance = 0.5 + random() * 1.5;
    const usdValue = Math.max(averageUsd * variance, 10);

    const solAmount = usdValue / solPrice;
    const tokenAmount = usdValue / Math.max(priceUsd, 1e-9);
    const now = Date.now();
    const ageMs = random() * 24 * 60 * 60 * 1000;

    const isBuy = type === "buy";
    events.push({
      txHash: generateTxHash(seed, index),
      type,
      amountIn: Number((isBuy ? solAmount : tokenAmount).toFixed(6)),
      amountOut: Number((isBuy ? tokenAmount : solAmount).toFixed(6)),
      tokenIn: isBuy ? quoteSymbol : baseSymbol,
      tokenOut: isBuy ? baseSymbol : quoteSymbol,
      usdValue: Number(usdValue.toFixed(2)),
      wallet: generateWallet(seed, index),
      timestamp: now - ageMs,
    });
    index++;
  };

  for (let i = 0; i < Math.min(h24.buys, 100); i++) makeEvent("buy");
  for (let i = 0; i < Math.min(h24.sells, 100); i++) makeEvent("sell");

  if (events.length === 0) {
    for (let i = 0; i < 10; i++) makeEvent(random() > 0.5 ? "buy" : "sell");
  }

  return events
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 100);
}

export function deriveLiquidityEvents(pair: TokenPair): LiquidityEvent[] {
  const seed = getSeed(`${pair.pairAddress}-liquidity`);
  const random = createSeededRandom(seed);
  const liquidityUsd = pair.liquidity?.usd ?? 0;
  const volume24h = pair.volume?.h24 ?? 0;
  const events: LiquidityEvent[] = [];

  // Scale representative liquidity events relative to daily volume rather
  // than total liquidity, which avoids unrealistically large numbers.
  const baseUsd = volume24h > 0 ? volume24h / 24 : liquidityUsd / 100 || 5000;

  const count = liquidityUsd > 0 ? 8 : 3;

  for (let i = 0; i < count; i++) {
    const type: "added" | "removed" = random() > 0.35 ? "added" : "removed";
    const variance = 0.3 + random() * 1.4;
    const usdValue = Math.max(baseUsd * variance, 50);
    const solPrice = solPriceFromPair(pair);
    const priceUsd = Number.parseFloat(pair.priceUsd) || 1;

    events.push({
      type,
      pair: `${pair.baseToken?.symbol ?? "ANSEM"}/${pair.quoteToken?.symbol ?? "SOL"}`,
      solAmount: Number((usdValue / solPrice).toFixed(6)),
      tokenAmount: Number((usdValue / priceUsd).toFixed(4)),
      usdValue: Number(usdValue.toFixed(2)),
      wallet: generateWallet(seed, i),
      txSignature: generateTxHash(seed, i),
      timestamp: Date.now() - random() * 7 * 24 * 60 * 60 * 1000,
    });
  }

  return events.sort((a, b) => b.timestamp - a.timestamp);
}
