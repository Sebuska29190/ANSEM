/**
 * Solscan Pro API v2 — server-side service.
 * Provides real holders (count + top list) and real swap transactions.
 * Requires SOLSCAN_API_KEY env var. Falls back to empty/null if missing.
 */

const BASE = "https://pro-api.solscan.io/v2.0";

function headers(): Record<string, string> {
  const key = process.env.SOLSCAN_API_KEY;
  if (!key) return {};
  return { token: key, Accept: "application/json" };
}

function hasKey(): boolean {
  return !!process.env.SOLSCAN_API_KEY;
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

  const url = `${BASE}/token/holders?address=${mint}&page=1&page_size=${pageSize}`;
  const res = await fetch(url, { headers: headers(), next: { revalidate: 300 } });

  if (!res.ok) return null;

  const json = (await res.json()) as {
    success: boolean;
    data?: { total: number; items: Array<Record<string, unknown>> };
  };

  if (!json.success || !json.data) return null;

  const items: SolscanHolder[] = (json.data.items ?? []).map((raw) => ({
    address: String(raw.address ?? ""),
    owner: String(raw.owner ?? ""),
    amount: Number(raw.amount ?? 0),
    amountStr: String(raw.amount_str ?? "0"),
    decimals: Number(raw.decimals ?? 0),
    rank: Number(raw.rank ?? 0),
    value: Number(raw.value ?? 0),
    percentage: Number(raw.percentage ?? 0),
  }));

  return { total: json.data.total, items };
}

// ─── Defi Activities (Swaps) ─────────────────────────────────────────────────

export async function fetchRecentSwaps(
  mint: string,
  limit = 20
): Promise<SolscanSwap[]> {
  if (!hasKey()) return [];

  const params = new URLSearchParams({
    address: mint,
    page: "1",
    page_size: String(limit),
    sort_by: "block_time",
    sort_order: "desc",
  });
  params.append("activity_type[]", "ACTIVITY_TOKEN_SWAP");
  params.append("activity_type[]", "ACTIVITY_AGG_TOKEN_SWAP");

  const url = `${BASE}/token/defi/activities?${params.toString()}`;
  const res = await fetch(url, { headers: headers(), next: { revalidate: 60 } });

  if (!res.ok) return [];

  const json = (await res.json()) as {
    success: boolean;
    data?: Array<Record<string, unknown>>;
  };

  if (!json.success || !json.data) return [];

  return json.data.map((raw) => {
    const routers = (raw.routers ?? {}) as Record<string, unknown>;
    return {
      txId: String(raw.trans_id ?? ""),
      blockTime: Number(raw.block_time ?? 0),
      activityType: String(raw.activity_type ?? ""),
      fromAddress: String(raw.from_address ?? ""),
      platform: String(raw.platform ?? ""),
      token1: String(routers.token1 ?? ""),
      token1Decimals: Number(routers.token1_decimals ?? 0),
      amount1: Number(routers.amount1 ?? 0),
      token2: String(routers.token2 ?? ""),
      token2Decimals: Number(routers.token2_decimals ?? 0),
      amount2: Number(routers.amount2 ?? 0),
    };
  });
}
