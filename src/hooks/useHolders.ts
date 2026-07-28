import { useQuery } from "@tanstack/react-query";
import type { SolscanHoldersResult } from "@/services/solscan";

export function useHolders() {
  return useQuery<{ success: boolean; data: SolscanHoldersResult | null }>({
    queryKey: ["ansem-holders"],
    queryFn: async () => {
      const res = await fetch("/api/holders");
      return (await res.json()) as {
        success: boolean;
        data: SolscanHoldersResult | null;
      };
    },
    refetchInterval: 300_000,
    staleTime: 240_000,
  });
}
