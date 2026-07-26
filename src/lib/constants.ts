export const ANSEM_ADDRESS =
  process.env.NEXT_PUBLIC_ANSEM_ADDRESS ??
  "9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ansem.vercel.app";

export const DEXSCREENER_TOKEN_API =
  "https://api.dexscreener.com/tokens/v1/solana";

export const DEXSCREENER_PAIRS_API =
  "https://api.dexscreener.com/token-pairs/v1/solana";

export const REFRESH_INTERVAL = 15_000; // 15s

export const NEWS_CACHE_KEY = "ansem:ai-news";
