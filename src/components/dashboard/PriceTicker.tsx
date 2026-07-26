"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUsd, formatPercent } from "@/lib/utils";
import type { TokenMetrics } from "@/types";

interface PriceTickerProps {
  metrics: TokenMetrics | null | undefined;
  isLoading?: boolean;
}

export function PriceTicker({ metrics, isLoading }: PriceTickerProps) {
  if (isLoading || !metrics) {
    return (
      <Card className="glow-border">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-12 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = (metrics.priceChange24h ?? 0) >= 0;

  return (
    <Card className="glow-border relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ansem-accent to-ansem-accent2" />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted">ANSEM / SOL</span>
          <Badge variant={isPositive ? "success" : "danger"}>
            {formatPercent(metrics.priceChange24h ?? 0)}
          </Badge>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={metrics.priceUsd}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mt-2 text-4xl font-bold tracking-tight text-white glow-text">
              {formatUsd(metrics.priceUsd)}
            </p>
          </motion.div>
        </AnimatePresence>
        <p className="mt-1 text-sm text-muted">
          Last update: {new Date(metrics.updatedAt).toLocaleTimeString("en-US")}
        </p>
      </CardContent>
    </Card>
  );
}
