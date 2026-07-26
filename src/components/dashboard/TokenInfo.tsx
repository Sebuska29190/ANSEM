"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { truncateWallet } from "@/lib/utils";
import { ANSEM_ADDRESS } from "@/lib/constants";
import { Copy, Check, Info } from "lucide-react";
import { useState } from "react";

export function TokenInfo() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ANSEM_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="h-4 w-4 text-ansem-accent" />
          Token Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Contract Address</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <code className="break-all text-sm font-mono text-white">
              {truncateWallet(ANSEM_ADDRESS, 8, 8)}
            </code>
            <button
              onClick={handleCopy}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-white/[0.06] hover:text-white"
              aria-label="Copy contract address"
            >
              {copied ? (
                <Check className="h-4 w-4 text-ansem-accent2" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.03] p-4">
            <p className="text-xs text-muted">Network</p>
            <p className="mt-1 font-semibold text-white">Solana</p>
          </div>
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.03] p-4">
            <p className="text-xs text-muted">Symbol</p>
            <p className="mt-1 font-semibold text-white">ANSEM</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.04] bg-white/[0.03] p-4">
          <p className="text-xs text-muted">Social</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="neutral">
              <a
                href="https://x.com/blknoiz06"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Twitter / X
              </a>
            </Badge>
            <Badge variant="neutral">
              <a
                href={`https://dexscreener.com/solana/${ANSEM_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                DexScreener
              </a>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
