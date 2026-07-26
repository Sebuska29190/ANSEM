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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Hero metrics */}
          <div className="md:col-span-4">
            <PriceTicker
              metrics={tokenData?.metrics}
              isLoading={isTokenLoading}
            />
          </div>
          <div className="md:col-span-8">
            <MarketStats
              metrics={tokenData?.metrics}
              isLoading={isTokenLoading}
            />
          </div>

          {/* Chart */}
          <div className="md:col-span-8">
            <ChartContainer
              candles={chartData.candles}
              lineData={chartData.line}
              isLoading={isTokenLoading}
            />
          </div>

          {/* AI News */}
          <div className="md:col-span-4">
            <AINewsFeed news={news} isLoading={isNewsLoading} />
          </div>

          {/* Swaps feed */}
          <div className="md:col-span-8">
            <SwapTable swaps={swaps} isLoading={isSwapsLoading} />
          </div>

          {/* Right column */}
          <div className="md:col-span-4 space-y-4">
            <LiquidityPools
              pairs={tokenData?.pairs ?? []}
              isLoading={isTokenLoading}
            />
            <LiquidityActivity
              events={liquidity}
              isLoading={isLiquidityLoading}
            />
          </div>

          {/* Token info & social */}
          <div className="md:col-span-8">
            <TokenInfo />
          </div>
          <div className="md:col-span-4">
            <SocialLinks />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
