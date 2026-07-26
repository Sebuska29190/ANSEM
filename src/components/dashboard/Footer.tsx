import { Globe, AtSign } from "lucide-react";
import { ANSEM_ADDRESS } from "@/lib/constants";

/**
 * Site footer. Mirrors the design system — black background,
 * shimmer divider at top, three-column link layout.
 */
export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/[0.06] bg-obsidian">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-ember/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-black text-white">$ANSEM</span>
              <span className="text-gradient-ember">·</span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-terminal-dim">
                The Black Bull
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-terminal-dim">
              Premium Solana token terminal built for ANSEM. Live on-chain data,
              AI-curated news and trade routing — all in one quiet dark room.
            </p>
            <p className="mt-4 break-all font-mono text-[10px] text-terminal-mute">
              ca: {ANSEM_ADDRESS}
            </p>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-terminal-dim">
              Trade
            </p>
            <ul className="space-y-2 text-sm text-white">
              <li><a className="transition-colors hover:text-ember" href={`https://jup.ag/swap/SOL-${ANSEM_ADDRESS}`} target="_blank" rel="noreferrer">Jupiter</a></li>
              <li><a className="transition-colors hover:text-ember" href={`https://raydium.io/swap/?inputMint=sol&outputMint=${ANSEM_ADDRESS}`} target="_blank" rel="noreferrer">Raydium</a></li>
              <li><a className="transition-colors hover:text-ember" href={`https://pump.fun/${ANSEM_ADDRESS}`} target="_blank" rel="noreferrer">Pump.fun</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-terminal-dim">
              Analytics
            </p>
            <ul className="space-y-2 text-sm text-white">
              <li><a className="transition-colors hover:text-gold" href={`https://dexscreener.com/solana/${ANSEM_ADDRESS}`} target="_blank" rel="noreferrer">DexScreener</a></li>
              <li><a className="transition-colors hover:text-gold" href={`https://birdeye.so/token/${ANSEM_ADDRESS}?chain=solana`} target="_blank" rel="noreferrer">Birdeye</a></li>
              <li><a className="transition-colors hover:text-gold" href={`https://solscan.io/token/${ANSEM_ADDRESS}`} target="_blank" rel="noreferrer">Solscan</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 text-[11px] text-terminal-dim md:flex-row md:items-center">
          <span>
            © {new Date().getFullYear()} ANSEM Terminal · Not financial advice.
            Crypto is volatile — never invest more than you can afford to lose.
          </span>
          <span className="flex items-center gap-3">
            <a
              href="https://x.com/blknoiz06"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
              aria-label="X / Twitter"
            >
              <AtSign className="h-4 w-4" />
            </a>
            <a
              href={`https://solscan.io/token/${ANSEM_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
              aria-label="Solscan"
            >
              <Globe className="h-4 w-4" />
            </a>
            <span className="ml-2 flex items-center gap-1.5" aria-live="polite">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bull-up opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bull-up" />
              </span>
              Live
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
