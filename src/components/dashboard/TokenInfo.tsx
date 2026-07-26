"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Info } from "lucide-react";
import { ANSEM_ADDRESS } from "@/lib/constants";
import { GlassPanel, Eyebrow } from "@/components/ui/GlassPanel";

/**
 * TokenInfo — quick-reference card for the on-chain identity of ANSEM.
 * Copy-to-clipboard for the contract address (the single most
 * important string for any new buyer).
 */
export function TokenInfo() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(ANSEM_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, []);

  return (
    <GlassPanel variant="ember" className="p-6">
      <Eyebrow index="03" label="Token" />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember/15 text-ember">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            $ANSEM — The Black Bull
          </h3>
          <p className="text-xs text-terminal-dim">
            Solana SPL · Pump.fun launch · 9 decimals
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-ember/20 bg-black/30 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-terminal-dim">
          Contract Address
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <code className="break-all font-mono text-xs text-white">
            {ANSEM_ADDRESS}
          </code>
          <button
            onClick={copy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-ember/40 hover:bg-ember/10"
            aria-label="Copy contract address"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-bull-up" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <dt className="text-[10px] uppercase tracking-[0.18em] text-terminal-dim">
            Chain
          </dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-white">
            Solana
          </dd>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <dt className="text-[10px] uppercase tracking-[0.18em] text-terminal-dim">
            Symbol
          </dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-white">
            ANSEM
          </dd>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <dt className="text-[10px] uppercase tracking-[0.18em] text-terminal-dim">
            Decimals
          </dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-white">
            9
          </dd>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <dt className="text-[10px] uppercase tracking-[0.18em] text-terminal-dim">
            Launchpad
          </dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-white">
            pump.fun
          </dd>
        </div>
      </dl>
    </GlassPanel>
  );
}
