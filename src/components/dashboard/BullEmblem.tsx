"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * BullEmblem — geometric bull head used as the hero centerpiece.
 * Procedurally drawn as inline SVG (no external assets) so we never
 * have to worry about image paths or asset loaders. Strokes are
 * animated with framer-motion pathLength on mount, and a halo ring
 * orbits behind it for ambient motion.
 */
export function BullEmblem({ size = 280 }: { size?: number }) {
  const reduce = useReducedMotion();
  const draw = reduce ? 1 : 0;

  const stroke = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
  };

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label="$ANSEM bull emblem"
      role="img"
    >
      {/* Orbiting data rings */}
      {!reduce && (
        <>
          <div
            className="absolute inset-0 rounded-full border border-ember/15 animate-ring-orbit"
            style={{ filter: "blur(0.4px)" }}
          />
          <div
            className="absolute inset-3 rounded-full border border-dashed border-gold/10 animate-ring-orbit"
            style={{ animationDuration: "40s", animationDirection: "reverse" }}
          />
        </>
      )}

      {/* Soft glow halo behind the bull */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,69,0,0.35) 0%, rgba(255,69,0,0.05) 50%, transparent 70%)",
        }}
      />

      {/* Bull head — sharp geometric strokes */}
      <motion.svg
        viewBox="0 0 200 200"
        width={size * 0.78}
        height={size * 0.78}
        className={reduce ? "" : "animate-bull-glow"}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "#FF7A33" }}
        aria-hidden
      >
        {/* Horns */}
        <motion.path
          d="M62 42 L42 18 L78 30 Z"
          {...stroke}
          transition={{ duration: 1.1, delay: 0.1 }}
          initial={draw ? false : stroke.initial}
          animate={stroke.animate}
        />
        <motion.path
          d="M138 42 L158 18 L122 30 Z"
          {...stroke}
          transition={{ duration: 1.1, delay: 0.1 }}
          initial={draw ? false : stroke.initial}
          animate={stroke.animate}
        />
        {/* Skull / forehead wedge */}
        <motion.path
          d="M62 42 Q100 20 138 42 L150 80 Q150 70 140 90 L130 110 Q100 130 70 110 L60 90 Q50 70 50 80 Z"
          {...stroke}
          transition={{ duration: 1.2, delay: 0.25 }}
          initial={draw ? false : stroke.initial}
          animate={stroke.animate}
        />
        {/* Snout */}
        <motion.path
          d="M80 110 Q100 150 120 110 L116 134 Q100 144 84 134 Z"
          {...stroke}
          transition={{ duration: 1.1, delay: 0.4 }}
          initial={draw ? false : stroke.initial}
          animate={stroke.animate}
        />
        {/* Nostrils */}
        <motion.circle cx="92" cy="128" r="1.5" fill="currentColor" stroke="none" />
        <motion.circle cx="108" cy="128" r="1.5" fill="currentColor" stroke="none" />
        {/* Eyes */}
        <motion.circle cx="80" cy="74" r="3" fill="currentColor" stroke="none" />
        <motion.circle cx="120" cy="74" r="3" fill="currentColor" stroke="none" />
        {/* Brow cuts */}
        <motion.path d="M70 64 L88 60" {...stroke} transition={{ duration: 0.6, delay: 0.55 }} />
        <motion.path d="M130 64 L112 60" {...stroke} transition={{ duration: 0.6, delay: 0.55 }} />
        {/* Neck muscle lines */}
        <motion.path d="M64 150 Q80 165 100 168 Q120 165 136 150" {...stroke} transition={{ duration: 0.9, delay: 0.6 }} />
        <motion.path d="M84 158 L84 178" {...stroke} transition={{ duration: 0.6, delay: 0.7 }} />
        <motion.path d="M116 158 L116 178" {...stroke} transition={{ duration: 0.6, delay: 0.7 }} />
      </motion.svg>

      {/* "$" sigil in the middle */}
      <span
        className="absolute text-[8px] font-mono font-bold text-gold/70"
        style={{ bottom: 8, letterSpacing: "0.4em" }}
      >
        $ANSEM
      </span>
    </div>
  );
}
