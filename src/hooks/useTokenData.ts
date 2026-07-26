import { useQuery } from "@tanstack/react-query";
import { fetchTokenData } from "@/services/dexscreener";

export const TOKEN_DATA_KEY = "ansem-token-data";

export function useTokenData() {
  return useQuery({
    queryKey: [TOKEN_DATA_KEY],
    queryFn: fetchTokenData,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}
