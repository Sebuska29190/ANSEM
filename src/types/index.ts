export interface TokenPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  priceNative: string;
  priceUsd: string;
  txns: TokenTxns;
  volume: Record<string, number>;
  priceChange: Record<string, number>;
  liquidity?: TokenLiquidity;
  fdv?: number;
  marketCap?: number;
  createdAt?: number;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
}

export interface TokenTxns {
  m5: TxnBucket;
  h1: TxnBucket;
  h6: TxnBucket;
  h24: TxnBucket;
}

export interface TxnBucket {
  buys: number;
  sells: number;
}

export interface TokenLiquidity {
  usd: number;
  base: number;
  quote: number;
}

export interface DexScreenerResponse {
  pairs: TokenPair[];
}

export interface TokenMetrics {
  priceUsd: number;
  marketCap: number | null;
  fdv: number | null;
  liquidityUsd: number | null;
  volume24h: number | null;
  priceChange24h: number | null;
  buys24h: number;
  sells24h: number;
  pairAddress: string;
  baseSymbol: string;
  quoteSymbol: string;
  dexId: string;
  updatedAt: number;
}

export interface SwapEvent {
  txHash: string;
  type: "buy" | "sell";
  amountIn: number;
  amountOut: number;
  tokenIn: string;
  tokenOut: string;
  usdValue: number | null;
  wallet: string;
  timestamp: number;
}

export interface LiquidityEvent {
  type: "added" | "removed";
  pair: string;
  solAmount: number;
  tokenAmount: number;
  usdValue: number;
  wallet: string;
  txSignature: string;
  timestamp: number;
}

export interface AINewsItem {
  id: string;
  content: string;
  sentiment: "bullish" | "bearish" | "neutral";
  createdAt: number;
  sourceData: {
    priceUsd: number;
    priceChange24h: number | null;
    volume24h: number | null;
  };
}

export interface ChartCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartPoint {
  time: number;
  value: number;
}
