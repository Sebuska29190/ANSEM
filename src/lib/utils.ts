import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Standard tailwind-merge helper used everywhere we combine class names. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Wallet / signature truncator.
 *   "9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump"
 * →  "9cRC…pump"
 */
export function truncateWallet(w: string | null | undefined, head = 4, tail = 4): string {
  if (!w) return "—";
  if (w.length <= head + tail) return w;
  return `${w.slice(0, head)}…${w.slice(-tail)}`;
}

/** Format a USD-ish big number for tickers (K / M / B with 2 dp). */
export function formatBigUSD(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toLocaleString("en-US")}`;
}

/** Compact age label like "12s", "5m", "3h". */
export function timeAgo(ts: number, now: number = Date.now()): string {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
