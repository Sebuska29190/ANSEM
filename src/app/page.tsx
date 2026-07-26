"use client";

import { useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/dashboard/Footer";
import { PriceTicker } from "@/components/dashboard/PriceTicker";
import { MarketStats } from "@/components/dashboard/MarketStats";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { AINewsFeed } from "@/components/dashboard/AINewsFeed";
import { SwapTable } from "@/components/dashboard/SwapTable";
import { LiquidityPools } from "@/components/dashboard/LiquidityPools";
import { LiquidityActivity } from "@/components/dashboard/LiquidityActivity";
import { TokenInfo } from "@/components/dashboard/TokenInfo";
import { SocialLinks } from "@/components/dashboard/SocialLinks";
import { useTokenData } from "@/hooks/useTokenData";
import { useSwaps } from "@/hooks/useSwaps";
import { useLiquidity } from "@/hooks/useLiquidity";
import { useAINews } from "@/hooks/useAINews";
import { generateMockChartData } from "@/lib/chart-data";

export default function DashboardPage() {
  const { data: tokenData, isLoading: isTokenLoading } = useTokenData();
  const { data: swaps = [], isLoading: isSwapsLoading } = useSwaps();
  const { data: liquidity = [], isLoading: isLiquidityLoading } = useLiquidity();
  const { data: news = [], isLoading: isNewsLoading } = useAINews();

  const chartData = useMemo(
    () => generateMockChartData(tokenData?.metrics?.priceUsd ?? 0),
    [tokenData?.metrics?.priceUsd]
  );

  return (
    <div className="min-h-screen text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <PriceTicker
                metrics={tokenData?.metrics}
                isLoading={isTokenLoading}
              />
            </div>
            <div className="lg:col-span-2">
              <MarketStats
                metrics={tokenData?.metrics}
                isLoading={isTokenLoading}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartContainer
                candles={chartData.candles}
                lineData={chartData.line}
                isLoading={isTokenLoading}
              />
            </div>
            <div className="lg:col-span-1">
              <AINewsFeed news={news} isLoading={isNewsLoading} />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SwapTable swaps={swaps} isLoading={isSwapsLoading} />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <LiquidityPools
                pairs={tokenData?.pairs ?? []}
                isLoading={isTokenLoading}
              />
              <LiquidityActivity
                events={liquidity}
                isLoading={isLiquidityLoading}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TokenInfo />
            </div>
            <div className="lg:col-span-1">
              <SocialLinks />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
