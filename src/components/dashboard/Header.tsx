import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#030305]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ansem-accent to-ansem-accent2 text-white shadow-lg shadow-ansem-accent/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white">
              ANSEM<span className="text-gradient-neon">.AI</span>
            </h1>
            <p className="text-xs text-muted tracking-wide">Solana Token Terminal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="neutral"
            className="hidden items-center gap-1.5 sm:inline-flex"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ansem-accent2 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ansem-accent2" />
            </span>
            Mainnet
          </Badge>
          <a
            href="https://x.com/blknoiz06"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-white transition-colors"
          >
            @blknoiz06
          </a>
        </div>
      </div>
    </header>
  );
}
