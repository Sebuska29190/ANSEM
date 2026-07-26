import type { ChartCandle, ChartPoint } from "@/types";

export interface GeneratedChartData {
  candles: ChartCandle[];
  line: ChartPoint[];
}

function clampPositive(value: number): number {
  return Math.max(Number.EPSILON, value);
}

export function generateMockChartData(currentPrice: number): GeneratedChartData {
  const candles: ChartCandle[] = [];
  const line: ChartPoint[] = [];

  const now = Date.now();
  const interval = 60 * 60 * 1000; // 1 hour
  const count = 48; // 48 hours

  let price = currentPrice > 0 ? currentPrice : 0.00000421;

  for (let i = count - 1; i >= 0; i--) {
    const time = now - i * interval;
    const volatility = price * 0.02;
    const open = price;
    const high = clampPositive(open + Math.random() * volatility);
    const low = clampPositive(open - Math.random() * volatility);
    const close = clampPositive(low + Math.random() * (high - low));
    const volume = Math.random() * 100000;

    candles.push({
      time: Math.floor(time / 1000),
      open,
      high,
      low,
      close,
      volume,
    });

    line.push({
      time: Math.floor(time / 1000),
      value: close,
    });

    price = close;
  }

  return { candles, line };
}
