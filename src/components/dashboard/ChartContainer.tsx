"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  AreaSeries,
  type IChartApi,
  type ISeriesApi,
  type Time,
  type CandlestickData,
  type AreaData,
  type SeriesType,
} from "lightweight-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ChartCandle, ChartPoint } from "@/types";

interface ChartContainerProps {
  candles?: ChartCandle[];
  lineData?: ChartPoint[];
  isLoading?: boolean;
}

type ChartMode = "candle" | "line";

export function ChartContainer({ candles, lineData, isLoading }: ChartContainerProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<SeriesType, Time> | null>(null);
  const [mode, setMode] = useState<ChartMode>("candle");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.1)" },
      timeScale: { borderColor: "rgba(255,255,255,0.1)", timeVisible: true },
      autoSize: true,
    });

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        );
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (seriesRef.current) {
      chart.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    if (mode === "candle" && candles && candles.length > 0) {
      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderDownColor: "#ef4444",
        borderUpColor: "#22c55e",
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      });
      const data: CandlestickData<Time>[] = candles.map((c) => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
      candleSeries.setData(data);
      seriesRef.current = candleSeries;
      chart.timeScale().fitContent();
    } else if (mode === "line" && lineData && lineData.length > 0) {
      const lineSeries = chart.addSeries(AreaSeries, {
        lineColor: "#9945ff",
        topColor: "rgba(153,69,255,0.4)",
        bottomColor: "rgba(153,69,255,0.02)",
        lineWidth: 2,
      });
      const data: AreaData<Time>[] = lineData.map((d) => ({
        time: d.time as Time,
        value: d.value,
      }));
      lineSeries.setData(data);
      seriesRef.current = lineSeries;
      chart.timeScale().fitContent();
    }
  }, [mode, candles, lineData]);

  return (
    <Card className="col-span-1 lg:col-span-2 min-h-[420px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Price Chart</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={mode === "candle" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("candle")}
          >
            Candle
          </Button>
          <Button
            variant={mode === "line" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("line")}
          >
            Line
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[360px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted">
            Loading chart data...
          </div>
        ) : (
          <div ref={chartContainerRef} className="h-full w-full" />
        )}
      </CardContent>
    </Card>
  );
}
