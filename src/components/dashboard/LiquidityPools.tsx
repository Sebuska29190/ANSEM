"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactUsd, formatNumber } from "@/lib/utils";
import type { TokenPair } from "@/types";
import { Droplets } from "lucide-react";

interface LiquidityPoolsProps {
  pairs: TokenPair[];
  isLoading?: boolean;
}

export function LiquidityPools({ pairs, isLoading }: LiquidityPoolsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Droplets className="h-4 w-4 text-ansem-accent" />
          Liquidity Pools
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : pairs.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/[0.06] text-muted text-sm">
            No liquidity pool data available.
          </div>
        ) : (
          <div className="space-y-2">
            {pairs.slice(0, 5).map((pair) => (
              <div
                key={pair.pairAddress}
                className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.03] p-4 transition-colors hover:border-ansem-accent/30"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {pair.baseToken.symbol}/{pair.quoteToken.symbol}
                    </span>
                    <Badge variant="neutral" className="text-xs">
                      {pair.dexId}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Vol 24h: {formatCompactUsd(pair.volume?.h24 ?? 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {formatCompactUsd(pair.liquidity?.usd ?? 0)}
                  </p>
                  <p className="text-xs text-muted">
                    {formatNumber(pair.liquidity?.base ?? 0)} {pair.baseToken.symbol}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
