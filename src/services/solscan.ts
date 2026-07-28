/**
 * Solana Tracker Data API — server-side service.
 * Provides real holders (count + top list) and real swap transactions.
 * Requires SOLANATRACKER_API_KEY env var. Falls back to empty/null if missing.
 * Free tier: 2,500 req/month, 3 req/sec.
 */

const BASE = "https://data.solanatracker.io";

function headers(): Record<string, string> {
  const key = process.env.SOLANATRACKER_API_KEY;
  if (!key) return {};
  return { "x-api-key": key, Accept: "application/json" };
}

function hasKey(): boolean {
  return !!process.env.SOLANATRACKER_API_KEY;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SolscanHolder {
  address: string;
  owner: string;
  amount: number;
  amountStr: string;
  decimals: number;
  rank: number;
  value: number;
  percentage: number;
}

export interface SolscanHoldersResult {
  total: number;
  items: SolscanHolder[];
}

export interface SolscanSwap {
  txId: string;
  blockTime: number;
  activityType: string;
  fromAddress: string;
  platform: string;
  token1: string;
  token1Decimals: number;
  amount1: number;
  token2: string;
  token2Decimals: number;
  amount2: number;
}

// ─── Holders ─────────────────────────────────────────────────────────────────

export async function fetchHolders(
  mint: string,
  pageSize = 20
): Promise<SolscanHoldersResult | null> {
  if (!hasKey()) return null;

  const url = `${BASE}/tokens/${mint}/holders`;
  const res = await fetch(url, { headers: headers(), next: { revalidate: 300 } });

  if (!res.ok) return null;

  const json = (await res.json()) as {
    total?: number;
    accounts?: Array<{
      wallet: string;
      amount: number;
      value?: { quote?: number; usd?: number };
      percentage?: number;
    }>;
  };

  if (!json.accounts) return null;

  const items: SolscanHolder[] = json.accounts.slice(0, pageSize).map((raw, i) => ({
    address: raw.wallet,
    owner: raw.wallet,
    amount: raw.amount,
    amountStr: raw.amount.toLocaleString("en-US", { maximumFractionDigits: 0 }),
    decimals: 0, // amounts already human-readable from Solana Tracker
    rank: i + 1,
    value: raw.value?.usd ?? 0,
    percentage: raw.percentage ?? 0,
  }));

  return { total: json.total ?? items.length, items };
}

// ─── Trades (Swaps) ──────────────────────────────────────────────────────────

export async function fetchRecentSwaps(
  mint: string,
  limit = 20
): Promise<SolscanSwap[]> {
  if (!hasKey()) return [];

  const url = `${BASE}/trades/${mint}`;
  const res = await fetch(url, { headers: headers(), next: { revalidate: 60 } });

  if (!res.ok) return [];

  const json = (await res.json()) as {
    trades?: Array<{
      tx: string;
      amount: number;
      priceUsd: number;
      volume: number;
      volumeSol: number;
      type: string;
      wallet: string;
      time: number;
      program: string;
      pools?: string[];
    }>;
  };

  if (!json.trades) return [];

  return json.trades.slice(0, limit).map((raw) => ({
    txId: raw.tx,
    blockTime: Math.floor(raw.time / 1000),
    activityType: raw.type === "buy" ? "ACTIVITY_TOKEN_SWAP" : "ACTIVITY_TOKEN_SWAP",
    fromAddress: raw.wallet,
    platform: raw.program ?? "jupiter",
    token1: mint,
    token1Decimals: 0, // amounts already human-readable from Solana Tracker
    amount1: raw.amount,
    token2: "So11111111111111111111111111111111111111112",
    token2Decimals: 0, // volumeSol already human-readable
    amount2: raw.volumeSol,
  }));
}
