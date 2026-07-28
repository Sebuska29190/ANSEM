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

  const rawPairs = (await res.json()) as Array<
    TokenPair & { pairCreatedAt?: number }
  >;
  const pairs = (rawPairs ?? []).map(normalizePair);
  const topPair = pairs[0] ?? null;

  return {
    pairs,
    topPair,
    metrics: topPair ? buildMetrics(topPair) : null,
  };
}

/**
 * DexScreener returns `pairCreatedAt` (ms epoch); our TokenPair type exposes
 * it as `createdAt`. Map it so consumers (e.g. Tokenomics "Launched") work.
 */
function normalizePair(
  pair: TokenPair & { pairCreatedAt?: number }
): TokenPair {
  return {
    ...pair,
    createdAt: pair.createdAt ?? pair.pairCreatedAt ?? 0,
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

/**
 * SOL/USD price resolution.
 * ----------------------------------------------------------------------
 * Order of preference:
 *   1. Implied from the pair itself (priceUsd / priceNative) – this is
 *      the actual price the on-chain pool is trading at right now.
 *   2. CoinGecko public price (cached 5 min via Next data cache).
 *   3. Hardcoded fallback (~$150) – only if both above fail offline.
 *
 * priceNative in DexScreener = "how much SOL equals 1 base token".
 * So SOL/USD = priceUsd / priceNative. The previous implementation
 * multiplied them, which made the divisor ~1e-9 and produced the
 * absurd "hundreds-of-millions-SOL" rows in LiquidityActivity.
 */

interface SolPriceCache {
  price: number;
  exp: number;
}

const SOL_CACHE_TTL_MS = 5 * 60 * 1000;
let solCache: SolPriceCache = { price: 0, exp: 0 };

function chainImpliedSolPrice(pair: TokenPair): number | null {
  const priceUsd = Number.parseFloat(pair.priceUsd) || 0;
  const priceNative = Number.parseFloat(pair.priceNative) || 0;
  if (priceUsd > 0 && priceNative > 0) {
    const implied = priceUsd / priceNative;
    // Sanity: only accept if the implied SOL price is in a plausible band.
    if (implied > 1 && implied < 5000) return Number(implied.toFixed(4));
  }
  return null;
}

async function fetchCoinGeckoSolUsd(): Promise<number | null> {
  // Honour the in-process cache so we never spam CoinGecko.
  if (Date.now() < solCache.exp && solCache.price > 0) return solCache.price;

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { solana?: { usd?: number } };
    const p = json?.solana?.usd;
    if (typeof p === "number" && p > 0 && p < 5000) {
      solCache = { price: Number(p.toFixed(4)), exp: Date.now() + SOL_CACHE_TTL_MS };
      return solCache.price;
    }
  } catch {
    /* network error – keep going */
  }
  return null;
}

export async function resolveSolUsdPrice(pair?: TokenPair): Promise<number> {
  if (pair) {
    const chain = chainImpliedSolPrice(pair);
    if (chain !== null) return chain;
  }
  const cg = await fetchCoinGeckoSolUsd();
  if (cg !== null) return cg;
  // Last-resort fallback. Conservative August-2026 ballpark.
  return solCache.price > 0 ? solCache.price : 150;
}

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/**
 * Defensive sanitiser for any externally-resolved SOL/USD price.
 * Rejects NaN, Infinity, zero, negatives, and absurd values; falls
 * back to a conservative hardcoded estimate so the SOL column in
 * LiquidityActivity / Swaps can't ever look insane again.
 */
function sanitizeSolPrice(n: number): number {
  return Number.isFinite(n) && n > 1 && n < 5000 ? n : 150;
}

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

export function deriveSwapEvents(
  pair: TokenPair,
  solPriceUsd: number
): SwapEvent[] {
  const seed = getSeed(pair.pairAddress);
  const random = createSeededRandom(seed);
  const h24 = pair.txns?.h24 ?? { buys: 0, sells: 0 };
  const volume24h = pair.volume?.h24 ?? 0;
  const priceUsd = Number.parseFloat(pair.priceUsd) || 0;
  const baseSymbol = pair.baseToken?.symbol ?? "ANSEM";
  const quoteSymbol = pair.quoteToken?.symbol ?? "SOL";

  const totalSwaps = Math.max(h24.buys + h24.sells, 20);
  const averageUsd = volume24h / totalSwaps || 100;
  // Sanity-clamp the passed-in SOL price so a stale or bogus value
  // never explodes the SOL column again.
  const solPrice = sanitizeSolPrice(solPriceUsd);

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

export function deriveLiquidityEvents(
  pair: TokenPair,
  solPriceUsd: number
): LiquidityEvent[] {
  const seed = getSeed(`${pair.pairAddress}-liquidity`);
  const random = createSeededRandom(seed);
  const liquidityUsd = pair.liquidity?.usd ?? 0;
  const volume24h = pair.volume?.h24 ?? 0;
  const events: LiquidityEvent[] = [];

  const count = liquidityUsd > 0 ? 8 : 3;
  const solPrice =
    Number.isFinite(solPriceUsd) && solPriceUsd > 1 && solPriceUsd < 5000
      ? solPriceUsd
      : 150;

  for (let i = 0; i < count; i++) {
    // Per-event sizing: 0.05% – 0.5% of daily volume, varied per row
    const pctOfVolume = 0.0005 + random() * 0.0045;
    const baseline =
      volume24h > 0
        ? Math.max(20, volume24h * pctOfVolume)
        : Math.max(20, (liquidityUsd || 0) * 0.005);
    const variance = 0.6 + random() * 0.8; // 0.6 – 1.4

    const type: "added" | "removed" = random() > 0.35 ? "added" : "removed";
    const usdValue = baseline * variance;
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
