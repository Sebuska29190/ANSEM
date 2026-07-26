import { Hero } from "@/components/dashboard/Hero";
import { TickerStrip } from "@/components/dashboard/TickerStrip";
import { TradingViewChart } from "@/components/dashboard/TradingViewChart";
import { LiveStats } from "@/components/dashboard/LiveStats";
import { SwapTable } from "@/components/dashboard/SwapTable";
import { AINewsFeed } from "@/components/dashboard/AINewsFeed";
import { LiquidityPools } from "@/components/dashboard/LiquidityPools";
import { LiquidityActivity } from "@/components/dashboard/LiquidityActivity";
import { TokenInfo } from "@/components/dashboard/TokenInfo";
import { SocialLinks } from "@/components/dashboard/SocialLinks";
import Footer from "@/components/dashboard/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Eyebrow } from "@/components/ui/GlassPanel";

/**
 * ANSEM Token Terminal — landing page composition.
 *
 * Section order (top → bottom):
 *   01 Hero            — monumental headline + price + CTAs + bull emblem
 *   -- TickerStrip     — slim horizontal data tape
 *   01 Live Chart      — TradingView / DexScreener iframe + canvas fallback
 *      + Live Stats    — right-rail stats grid (price, MC, FDV, vol, liq, holders)
 *   02 On-Chain        — SwapTable (left, dominant) + AINewsFeed (right)
 *   03 Liquidity       — LiquidityPools + LiquidityActivity (two-up)
 *   04 Token & Links   — TokenInfo + SocialLinks (two-up)
 *   ── Footer
 */
export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[640px] w-[1100px] -translate-x-1/2 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,69,0,0.12) 0%, transparent 60%)",
        }}
      />

      <Hero />
      <TickerStrip />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal>
          <Eyebrow index="01" label="Market" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <TradingViewChart />
            </div>
            <div className="lg:col-span-4">
              <LiveStats />
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal>
          <Eyebrow index="02" label="On-Chain Intelligence" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SwapTable />
            </div>
            <div className="lg:col-span-4">
              <AINewsFeed />
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal>
          <Eyebrow index="03" label="Liquidity" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <LiquidityPools />
            </div>
            <div className="lg:col-span-5">
              <LiquidityActivity />
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal>
          <Eyebrow index="04" label="Token & Community" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <TokenInfo />
            </div>
            <div className="lg:col-span-7">
              <SocialLinks />
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </main>
  );
}
