import { useQuery } from "@tanstack/react-query";
import type { RugCheckReport } from "@/services/rugcheck";

export function useSecurity() {
  return useQuery<{ success: boolean; data: RugCheckReport | null }>({
    queryKey: ["ansem-security"],
    queryFn: async () => {
      const res = await fetch("/api/security");
      return (await res.json()) as {
        success: boolean;
        data: RugCheckReport | null;
      };
    },
    refetchInterval: 3_600_000,
    staleTime: 3_000_000,
  });
}
