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
        <CardTitle>Liquidity Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-white/5" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-muted text-sm">
            Liquidity activity feed requires Helius WebSocket or Birdeye API.
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {events.map((event) => (
                <motion.div
                  key={event.txSignature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3"
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
        )}
      </CardContent>
    </Card>
  );
}
