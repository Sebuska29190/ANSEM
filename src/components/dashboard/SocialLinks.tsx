"use client";

import {
  Globe, AtSign, BookOpen, Activity, Search, TrendingUp,
} from "lucide-react";
import { ANSEM_ADDRESS, ANSEM_PAIR_ADDRESS } from "@/lib/constants";

/**
 * SocialLinks — premium social/external-link grid.
 * Each tile is a glass card with brand-coloured icon + label + chevron.
 */
type LinkItem = {
  label: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  brand: string;
};

const LINKS: LinkItem[] = [
  {
    label: "X / Twitter",
    desc: "@blackbullsol",
    href: "https://x.com/blackbullsol",
    icon: AtSign,
    brand: "hover:text-white hover:border-white/40",
  },
  {
    label: "Website",
    desc: "blackbullsol.com",
    href: "https://www.blackbullsol.com/",
    icon: Globe,
    brand: "hover:text-ember hover:border-ember/40",
  },
  {
    label: "DexScreener",
    desc: "Live pair analytics",
    href: `https://dexscreener.com/solana/${ANSEM_PAIR_ADDRESS}`,
    icon: Activity,
    brand: "hover:text-bull-up hover:border-bull-up/40",
  },
  {
    label: "Jupiter",
    desc: "Best-route swap",
    href: `https://jup.ag/swap/SOL-${ANSEM_ADDRESS}`,
    icon: BookOpen,
    brand: "hover:text-gold hover:border-gold/40",
  },
  {
    label: "Birdeye",
    desc: "On-chain intelligence",
    href: `https://birdeye.so/token/${ANSEM_ADDRESS}?chain=solana`,
    icon: Search,
    brand: "hover:text-ember hover:border-ember/40",
  },
  {
    label: "Solscan",
    desc: "Block explorer",
    href: `https://solscan.io/token/${ANSEM_ADDRESS}`,
    icon: Globe,
    brand: "hover:text-terminal-dim hover:border-white/40",
  },
  {
    label: "Pump.fun",
    desc: "Bonding curve",
    href: `https://pump.fun/${ANSEM_ADDRESS}`,
    icon: TrendingUp,
    brand: "hover:text-bull-up hover:border-bull-up/40",
  },
];

export function SocialLinks() {
  return (
    <section className="glass-panel overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-terminal-dim">
          Community & Links
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-terminal-dim">
          Official Channels
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-px bg-white/[0.04] sm:grid-cols-2 md:grid-cols-3">
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className={`group flex items-center gap-3 bg-obsidian p-4 transition-all hover:bg-charcoal ${l.brand}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-terminal-dim transition-colors group-hover:border-current">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold tracking-tight text-white">
                    {l.label}
                  </div>
                  <div className="truncate text-[11px] text-terminal-dim">{l.desc}</div>
                </div>
                <span className="text-terminal-dim transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
