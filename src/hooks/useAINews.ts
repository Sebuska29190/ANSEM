import { useQuery } from "@tanstack/react-query";
import type { AINewsItem } from "@/types";

export const AI_NEWS_KEY = "ansem-ai-news";

async function fetchLatestNews(): Promise<AINewsItem[]> {
  const res = await fetch("/api/news");
  if (!res.ok) {
    throw new Error("Failed to fetch AI news");
  }
  return (await res.json()) as AINewsItem[];
}

export function useAINews() {
  return useQuery<AINewsItem[]>({
    queryKey: [AI_NEWS_KEY],
    queryFn: fetchLatestNews,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}
