"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ANSEM_ADDRESS } from "@/lib/constants";
import { ExternalLink, MessageCircle } from "lucide-react";

export function SocialLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Community</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full justify-between"
          asChild
        >
          <a
            href="https://x.com/blknoiz06"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Follow @blknoiz06
            </span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between"
          asChild
        >
          <a
            href={`https://dexscreener.com/solana/${ANSEM_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              View on DexScreener
            </span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
