import { useQuery } from "@tanstack/react-query";
import type { SwapEvent } from "@/types";

export function useSwaps() {
  return useQuery<SwapEvent[]>({
    queryKey: ["ansem-swaps"],
    queryFn: async () => {
      const res = await fetch("/api/swaps");
      if (!res.ok) {
        throw new Error(`Swaps API error: ${res.status}`);
      }
      return (await res.json()) as SwapEvent[];
    },
    refetchInterval: 30_000,
    staleTime: 20_000,
  });
}
