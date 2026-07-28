"use client";

import {
  Globe, AtSign, BookOpen, Activity, Search, TrendingUp,
} from "lucide-react";
import { ANSEM_ADDRESS, ANSEM_PAIR_ADDRESS } from "@/lib/constants";
import { Panel } from "@/components/ui/Panel";

/**
 * SocialLinks — official channel grid. Sharp tiles, brand-coloured hover.
 */
type LinkItem = {
  label: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  brand: string;
};

const LINKS: LinkItem[] = [
  { label: "X / Twitter", desc: "@blackbullsol", href: "https://x.com/blackbullsol", icon: AtSign, brand: "hover:text-text hover:border-text/40" },
  { label: "Website", desc: "blackbullsol.com", href: "https://www.blackbullsol.com/", icon: Globe, brand: "hover:text-ember hover:border-ember/40" },
  { label: "DexScreener", desc: "Live pair analytics", href: `https://dexscreener.com/solana/${ANSEM_PAIR_ADDRESS}`, icon: Activity, brand: "hover:text-up hover:border-up/40" },
  { label: "Jupiter", desc: "Best-route swap", href: `https://jup.ag/swap/SOL-${ANSEM_ADDRESS}`, icon: BookOpen, brand: "hover:text-gold hover:border-gold/40" },
  { label: "Birdeye", desc: "On-chain intelligence", href: `https://birdeye.so/token/${ANSEM_ADDRESS}?chain=solana`, icon: Search, brand: "hover:text-ember hover:border-ember/40" },
  { label: "Solscan", desc: "Block explorer", href: `https://solscan.io/token/${ANSEM_ADDRESS}`, icon: Globe, brand: "hover:text-info hover:border-info/40" },
  { label: "Pump.fun", desc: "Bonding curve", href: `https://pump.fun/${ANSEM_ADDRESS}`, icon: TrendingUp, brand: "hover:text-up hover:border-up/40" },
];

export function SocialLinks() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-dim">
          Community & Links
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-dim">
          Official Channels
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-px bg-line/60 sm:grid-cols-2 md:grid-cols-4">
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className={`group flex items-center gap-3 bg-panel p-4 transition-all hover:bg-raised ${l.brand}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-line bg-raised/40 text-dim transition-colors group-hover:border-current">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold tracking-tight text-text">{l.label}</div>
                  <div className="truncate text-[11px] text-dim">{l.desc}</div>
                </div>
                <span className="text-dim transition-transform group-hover:translate-x-1">↗</span>
              </a>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
