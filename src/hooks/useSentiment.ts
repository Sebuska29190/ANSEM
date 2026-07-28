import { useQuery } from "@tanstack/react-query";
import type { FearGreed } from "@/services/sentiment";

export interface SentimentData {
  fearGreed: FearGreed | null;
  solPrice: number | null;
}

export function useSentiment() {
  return useQuery<{ success: boolean; data: SentimentData }>({
    queryKey: ["ansem-sentiment"],
    queryFn: async () => {
      const res = await fetch("/api/sentiment");
      return (await res.json()) as { success: boolean; data: SentimentData };
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}
