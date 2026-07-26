"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCompactUsd, truncateWallet, timeAgo } from "@/lib/utils";
import type { LiquidityEvent } from "@/types";
import { Plus, Minus } from "lucide-react";

interface LiquidityActivityProps {
  events: LiquidityEvent[];
  isLoading?: boolean;
}

export function LiquidityActivity({ events, isLoading }: LiquidityActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Liquidity Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-white/[0.05]" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/[0.06] text-muted text-sm">
            No liquidity activity available.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <AnimatePresence>
                {events.map((event) => (
                  <motion.div
                    key={event.txSignature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.03] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={event.type === "added" ? "success" : "danger"}
                        className="gap-1"
                      >
                        {event.type === "added" ? (
                          <Plus className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        {event.type === "added" ? "Added" : "Removed"}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {event.solAmount.toFixed(2)} SOL
                        </p>
                        <p className="text-xs text-muted">
                          {truncateWallet(event.wallet)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {formatCompactUsd(event.usdValue)}
                      </p>
                      <p className="text-xs text-muted">
                        {timeAgo(event.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <p className="mt-3 text-xs text-muted">
              Representative feed derived from DexScreener pool aggregates, not individual on-chain transactions.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
