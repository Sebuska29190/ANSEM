"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCompactUsd, truncateWallet, timeAgo } from "@/lib/utils";
import type { SwapEvent } from "@/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface SwapTableProps {
  swaps: SwapEvent[];
  isLoading?: boolean;
}

export function SwapTable({ swaps, isLoading }: SwapTableProps) {
  const visibleSwaps = swaps.slice(0, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Swaps</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-white/[0.05]" />
            ))}
          </div>
        ) : swaps.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/[0.06] text-muted text-sm">
            No swap data available.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>USD</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleSwaps.map((swap) => (
                  <TableRow
                    key={swap.txHash}
                    className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]"
                  >
                    <TableCell>
                      <Badge
                        variant={swap.type === "buy" ? "success" : "danger"}
                        className="gap-1"
                      >
                        {swap.type === "buy" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {swap.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-white">
                      {swap.amountIn.toFixed(4)} {swap.tokenIn}
                    </TableCell>
                    <TableCell>
                      {swap.usdValue
                        ? formatCompactUsd(swap.usdValue)
                        : "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted">
                      {truncateWallet(swap.wallet)}
                    </TableCell>
                    <TableCell className="text-xs text-muted">
                      {timeAgo(swap.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="mt-3 text-xs text-muted">
              Representative feed derived from 24h DexScreener aggregates, not individual on-chain transactions.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
