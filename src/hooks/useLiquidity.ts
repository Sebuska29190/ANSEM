import { useQuery } from "@tanstack/react-query";
import type { LiquidityEvent } from "@/types";

export function useLiquidity() {
  return useQuery<LiquidityEvent[]>({
    queryKey: ["ansem-liquidity"],
    queryFn: async () => {
      // Placeholder: real-time liquidity events require Helius WebSocket or Birdeye paid tier.
      return [];
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}
