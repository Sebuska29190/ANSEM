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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={stat.label} className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ansem-accent/10 text-ansem-accent">
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted">{stat.label}</span>
            </div>
            {isLoading ? (
              <Skeleton className="mt-3 h-7 w-28" />
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="mt-3 text-2xl font-bold text-white"
              >
                {stat.value}
              </motion.p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
