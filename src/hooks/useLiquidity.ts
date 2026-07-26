import { useQuery } from "@tanstack/react-query";
import type { LiquidityEvent } from "@/types";

export function useLiquidity() {
  return useQuery<LiquidityEvent[]>({
    queryKey: ["ansem-liquidity"],
    queryFn: async () => {
      const res = await fetch("/api/liquidity");
      if (!res.ok) {
        throw new Error(`Liquidity API error: ${res.status}`);
      }
      return (await res.json()) as LiquidityEvent[];
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}
