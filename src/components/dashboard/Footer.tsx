"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { Globe, AtSign, Copy, Check } from "lucide-react";
import { ANSEM_ADDRESS, ANSEM_PAIR_ADDRESS } from "@/lib/constants";

/**
 * Site footer — warm-black, sharp corners, CA chip, link columns.
 */
export default function Footer() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(ANSEM_ADDRESS);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }, []);

  return (
    <footer className="relative mt-8 border-t border-line bg-panel">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-ember/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-black text-text">$ANSEM</span>
              <span className="text-ember">·</span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-dim">
                The Black Bull
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-dim">
              Single-token Solana terminal for ANSEM. Live on-chain data, real swap
              feed, holder distribution and security audit — every number verifiable.
            </p>

            <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-[2px] border border-line bg-raised/40 px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-dim">CA</span>
              <code className="min-w-0 flex-1 truncate font-mono text-xs text-text">
                {ANSEM_ADDRESS}
              </code>
              <button
                onClick={copy}
                className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-[2px] border border-line bg-panel px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-dim transition-colors hover:border-ember/40 hover:text-text"
                aria-label="Copy contract address"
              >
                {copied ? <Check className="h-3 w-3 text-up" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-dim">Trade</p>
            <ul className="space-y-2 text-sm text-text">
              <li><a className="transition-colors hover:text-ember" href={`https://jup.ag/swap/SOL-${ANSEM_ADDRESS}`} target="_blank" rel="noopener noreferrer">Jupiter</a></li>
              <li><a className="transition-colors hover:text-ember" href={`https://raydium.io/swap/?inputMint=sol&outputMint=${ANSEM_ADDRESS}`} target="_blank" rel="noopener noreferrer">Raydium</a></li>
              <li><a className="transition-colors hover:text-ember" href={`https://pump.fun/${ANSEM_ADDRESS}`} target="_blank" rel="noopener noreferrer">Pump.fun</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-dim">Analytics</p>
            <ul className="space-y-2 text-sm text-text">
              <li><a className="transition-colors hover:text-gold" href={`https://dexscreener.com/solana/${ANSEM_PAIR_ADDRESS}`} target="_blank" rel="noopener noreferrer">DexScreener</a></li>
              <li><a className="transition-colors hover:text-gold" href={`https://birdeye.so/token/${ANSEM_ADDRESS}?chain=solana`} target="_blank" rel="noopener noreferrer">Birdeye</a></li>
              <li><a className="transition-colors hover:text-gold" href={`https://solscan.io/token/${ANSEM_ADDRESS}`} target="_blank" rel="noopener noreferrer">Solscan</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-[11px] text-dim md:flex-row md:items-center">
          <span>
            © {new Date().getFullYear()} ANSEM Terminal · Not financial advice.
            Crypto is volatile — never invest more than you can afford to lose.
          </span>
          <span className="flex items-center gap-3">
            <a
              href="https://x.com/blackbullsol"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-text"
              aria-label="X / Twitter"
            >
              <AtSign className="h-4 w-4" />
            </a>
            <a
              href={`https://solscan.io/token/${ANSEM_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-text"
              aria-label="Solscan"
            >
              <Globe className="h-4 w-4" />
            </a>
            <span className="ml-2 flex items-center gap-1.5" aria-live="polite">
              <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-up" />
              Live
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
