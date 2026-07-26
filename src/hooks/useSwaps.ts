import { useQuery } from "@tanstack/react-query";
import type { SwapEvent } from "@/types";

export function useSwaps() {
  return useQuery<SwapEvent[]>({
    queryKey: ["ansem-swaps"],
    queryFn: async () => {
      // Placeholder: real-time swaps require Helius WebSocket or Birdeye paid tier.
      return [];
    },
    refetchInterval: 30_000,
    staleTime: 20_000,
  });
}
