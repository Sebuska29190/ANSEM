"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo } from "@/lib/utils";
import type { AINewsItem } from "@/types";
import { Sparkles } from "lucide-react";

interface AINewsFeedProps {
  news: AINewsItem[];
  isLoading?: boolean;
}

const sentimentVariant = {
  bullish: "success" as const,
  bearish: "danger" as const,
  neutral: "neutral" as const,
};

export function AINewsFeed({ news, isLoading }: AINewsFeedProps) {
  return (
    <Card className="h-full min-h-[420px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-ansem-accent" />
          AI News Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : news.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-muted">
            No AI news yet. First generation will happen soon.
          </div>
        ) : (
          <AnimatePresence>
            {news.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:border-ansem-accent/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="flex-1 text-sm leading-relaxed text-foreground">
                    {item.content}
                  </p>
                  <Badge variant={sentimentVariant[item.sentiment]}>
                    {item.sentiment}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted">
                  {timeAgo(item.createdAt)} · based on live market data
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
}
