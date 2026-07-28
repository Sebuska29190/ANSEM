/**
 * Sentiment services — Fear & Greed Index + SOL price.
 * Both are public, no key required.
 */

export interface FearGreed {
  value: number;
  label: string;
  timestamp: number;
}

export async function fetchFearGreed(): Promise<FearGreed | null> {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=1", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: Array<{ value: string; value_classification: string; timestamp: string }>;
    };

    const item = json.data?.[0];
    if (!item) return null;

    return {
      value: Number(item.value),
      label: item.value_classification,
      timestamp: Number(item.timestamp),
    };
  } catch {
    return null;
  }
}

/**
 * SOL price via CoinGecko — public, no key required.
 * (Jupiter Price API now requires an API key.)
 */
export async function fetchSolPrice(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;

    const json = (await res.json()) as {
      solana?: { usd?: number };
    };

    return json.solana?.usd ?? null;
  } catch {
    return null;
  }
}
