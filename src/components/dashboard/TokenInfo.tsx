"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Info } from "lucide-react";
import { ANSEM_ADDRESS } from "@/lib/constants";
import { Panel } from "@/components/ui/Panel";

/**
 * TokenInfo — quick-reference card for the on-chain identity of ANSEM.
 * Copy-to-clipboard for the contract address.
 */
export function TokenInfo() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(ANSEM_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, []);

  return (
    <Panel className="h-full p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-ember/30 bg-ember/10 text-ember">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold tracking-tight text-text">
            $ANSEM — The Black Bull
          </h3>
          <p className="text-xs text-dim">Solana SPL · Pump.fun launch · 9 decimals</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[2px] border border-ember/25 bg-raised/60 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dim">
          Contract Address
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <code className="break-all font-mono text-xs text-text">{ANSEM_ADDRESS}</code>
          <button
            onClick={copy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-[2px] border border-line bg-panel px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-dim transition-colors hover:border-ember/40 hover:text-text"
            aria-label="Copy contract address"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-up" /> Copied
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
        {[
          { k: "Chain", v: "Solana" },
          { k: "Symbol", v: "ANSEM" },
          { k: "Decimals", v: "9" },
          { k: "Launchpad", v: "pump.fun" },
        ].map((it) => (
          <div key={it.k} className="rounded-[2px] border border-line bg-raised/40 p-3">
            <dt className="text-[10px] uppercase tracking-[0.18em] text-dim">{it.k}</dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-text">{it.v}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
