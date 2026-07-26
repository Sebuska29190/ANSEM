"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * NumberTicker
 * ---------------------------------------------------
 * Renders a numeric value with:
 *   - flash to bull-up / bull-down when value changes
 *   - subtle scale-pulse on update
 *   - stable tabular-num alignment
 * Used everywhere live data is shown: hero price, stats, swaps.
 */
type Direction = "up" | "down" | "flat";

export function NumberTicker({
  value,
  className = "",
  format = (v) => v.toString(),
  showDelta = false,
  size = "md",
}: {
  value: number;
  className?: string;
  format?: (v: number) => string;
  showDelta?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "display";
}) {
  const prev = useRef(value);
  const [dir, setDir] = useState<Direction>("flat");

  useEffect(() => {
    if (value > prev.current) setDir("up");
    else if (value < prev.current) setDir("down");
    else setDir("flat");
    const t = setTimeout(() => setDir("flat"), 600);
    prev.current = value;
    return () => clearTimeout(t);
  }, [value]);

  const sizeCls = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-4xl",
    display: "text-6xl md:text-8xl",
  }[size];

  const colorCls =
    dir === "up"
      ? "text-bull-up"
      : dir === "down"
      ? "text-bull-down"
      : "text-white";

  return (
    <span className={`relative inline-flex items-baseline tabular-nums ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={value.toString()}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            color:
              dir === "up" ? "#00C853" : dir === "down" ? "#FF1744" : "#ffffff",
          }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`${sizeCls} ${colorCls} font-mono font-semibold leading-none tracking-tight`}
        >
          {format(value)}
        </motion.span>
      </AnimatePresence>
      {showDelta && value !== 0 && (
        <span
          aria-hidden
          className={`pointer-events-none ml-1 text-xs font-medium ${
            dir === "up"
              ? "text-bull-up"
              : dir === "down"
              ? "text-bull-down"
              : "text-terminal-dim"
          }`}
        >
          {dir === "up" ? "▲" : dir === "down" ? "▼" : "•"}
        </span>
      )}
    </span>
  );
}

/**
 * MoneyTicker — convenience wrapper for USD values.
 */
export function MoneyTicker({
  value,
  fractionDigits = 2,
  ...rest
}: {
  value: number;
  fractionDigits?: number;
} & Omit<Parameters<typeof NumberTicker>[0], "value" | "format">) {
  return (
    <NumberTicker
      value={value}
      format={(v) =>
        v < 0.01
          ? `$${v.toExponential(2)}`
          : `$${v.toLocaleString("en-US", {
              minimumFractionDigits: fractionDigits,
              maximumFractionDigits: fractionDigits,
            })}`
      }
      {...rest}
    />
  );
}
