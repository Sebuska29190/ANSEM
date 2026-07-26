import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ansem-accent/20 text-ansem-accent">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              ANSEM<span className="text-ansem-accent">.AI</span>
            </h1>
            <p className="text-xs text-muted">Solana Token Terminal</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral" className="hidden sm:inline-flex">
            Live
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
