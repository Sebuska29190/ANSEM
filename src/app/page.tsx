import { CommandBar } from "@/components/dashboard/CommandBar";
import { Hero } from "@/components/dashboard/Hero";
import { TickerStrip } from "@/components/dashboard/TickerStrip";
import { TradingViewChart } from "@/components/dashboard/TradingViewChart";
import { LiveStats } from "@/components/dashboard/LiveStats";
import { SwapTable } from "@/components/dashboard/SwapTable";
import { MarketBrief } from "@/components/dashboard/MarketBrief";
import { Tokenomics } from "@/components/dashboard/Tokenomics";
import { Security } from "@/components/dashboard/Security";
import { SentimentBand } from "@/components/dashboard/SentimentBand";
import { LiquidityPools } from "@/components/dashboard/LiquidityPools";
import { TokenInfo } from "@/components/dashboard/TokenInfo";
import { SocialLinks } from "@/components/dashboard/SocialLinks";
import Footer from "@/components/dashboard/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Eyebrow } from "@/components/ui/GlassPanel";

/**
 * ANSEM Terminal v3 — single-token terminal composition.
 *
 * Order (top → bottom):
 *   CommandBar       — sticky live price bar (always visible)
 *   Hero             — identity + bull + big price
 *   TickerStrip      — horizontal data tape
 *   SentimentBand    — Fear & Greed + SOL + 24h activity
 *   01 Market        — chart (8) + live stats rail (4)
 *   02 On-Chain      — real swap feed (8) + market brief (4)
 *   03 Tokenomics    — supply + real top holders
 *   04 Security      — RugCheck audit
 *   05 Liquidity     — pools (7) + token info (5)
 *   06 Community     — social links
 *   Footer
 */
export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient ember wash — layered, not a blob */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[720px]"
        style={{
          background:
            "radial-gradient(ellipse 900px 480px at 50% -10%, rgba(255,69,0,0.10), transparent 65%)",
        }}
      />
      <div aria-hidden className="terminal-grid pointer-events-none fixed inset-0 -z-10 opacity-25" />

      <CommandBar />
      <Hero />
      <TickerStrip />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="py-8">
          <ScrollReveal>
            <SentimentBand />
          </ScrollReveal>
        </section>

        <section className="py-8">
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

        <section className="py-8">
          <ScrollReveal>
            <Eyebrow index="02" label="On-Chain Intelligence" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <SwapTable />
              </div>
              <div className="lg:col-span-4">
                <MarketBrief />
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="py-8">
          <ScrollReveal>
            <Eyebrow index="03" label="Tokenomics" accent="gold" />
            <Tokenomics />
          </ScrollReveal>
        </section>

        <section className="py-8">
          <ScrollReveal>
            <Eyebrow index="04" label="Security" />
            <Security />
          </ScrollReveal>
        </section>

        <section className="py-8">
          <ScrollReveal>
            <Eyebrow index="05" label="Liquidity" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <LiquidityPools />
              </div>
              <div className="lg:col-span-5">
                <TokenInfo />
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="py-8 pb-16">
          <ScrollReveal>
            <Eyebrow index="06" label="Community" accent="gold" />
            <SocialLinks />
          </ScrollReveal>
        </section>
      </div>

      <Footer />
    </main>
  );
}
