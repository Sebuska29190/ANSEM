"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactUsd, formatNumber } from "@/lib/utils";
import type { TokenMetrics } from "@/types";
import { TrendingUp, Droplets, BarChart3, Activity } from "lucide-react";

interface MarketStatsProps {
  metrics: TokenMetrics | null | undefined;
  isLoading?: boolean;
}

export function MarketStats({ metrics, isLoading }: MarketStatsProps) {
  const stats = [
    {
      label: "Market Cap",
      value: formatCompactUsd(metrics?.marketCap ?? undefined),
      icon: TrendingUp,
    },
    {
      label: "Liquidity",
      value: formatCompactUsd(metrics?.liquidityUsd ?? undefined),
      icon: Droplets,
    },
    {
      label: "Volume 24h",
      value: formatCompactUsd(metrics?.volume24h ?? undefined),
      icon: BarChart3,
    },
    {
      label: "Buys / Sells 24h",
      value: metrics
        ? `${formatNumber(metrics.buys24h, 0)} / ${formatNumber(
            metrics.sells24h,
            0
          )}`
        : "—",
      icon: Activity,
    },
  ];

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col justify-center p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ansem-700 text-ansem-accent">
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs text-muted">{stat.label}</span>
                {isLoading ? (
                  <Skeleton className="mt-1.5 h-5 w-24" />
                ) : (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="mt-0.5 text-lg font-bold tracking-tight text-white"
                  >
                    {stat.value}
                  </motion.p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
