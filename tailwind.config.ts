import type { Config } from "tailwindcss";

/**
 * ANSEM — Token Terminal design tokens.
 *
 * Palette philosophy:
 *   ink / obsidian / charcoal → deep blacks for terminal feel
 *   ember                → aggressive orange (the bull)
 *   gold                 → premium accents (luxury / trophy)
 *   bull-up / bull-down  → neon green / blood red for tickers
 *   terminal-dim         → secondary copy / captions
 *
 * Swap the palette here to re-skin the whole site in one place.
 */
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./netlify/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050505",           // page background (deepest)
        obsidian: "#0A0A0A",      // primary card surface
        charcoal: "#141414",      // surface highlight / hover
        line: "#1F1F1F",          // hairline divider
        border: "rgba(255,255,255,0.06)",

        ember: {
          DEFAULT: "#FF4500",     // aggressive bull orange
          deep: "#C73600",        // pressed state
          glow: "rgba(255,69,0,0.35)",
        },
        gold: {
          DEFAULT: "#F5C26B",     // warm champagne
          deep: "#B89B00",
        },
        bull: {
          up: "#00C853",          // neon profit
          down: "#FF1744",        // blood loss
        },
        terminal: {
          DEFAULT: "#E6E6E6",     // primary body text
          dim: "#6B6B70",         // secondary copy
          mute: "#3A3A3F",        // very faint
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 50% 0%, rgba(255,69,0,0.18), rgba(255,69,0,0.04) 35%, transparent 60%), radial-gradient(circle at 80% 100%, rgba(245,194,107,0.06), transparent 50%)",
        "ember-glow":
          "linear-gradient(180deg, transparent 0%, rgba(255,69,0,0.08) 100%)",
        "grid-fade":
          "linear-gradient(180deg, transparent, rgba(255,69,0,0.04), transparent)",
      },
      animation: {
        "ember-pulse": "emberPulse 2.4s ease-in-out infinite",
        "ticker-scroll": "tickerScroll 60s linear infinite",
        "ring-orbit": "ringOrbit 24s linear infinite",
        "border-shimmer": "borderShimmer 4s ease-in-out infinite",
        "bull-glow": "bullGlow 3s ease-in-out infinite",
      },
      keyframes: {
        emberPulse: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(255,69,0,0.0)" },
          "50%":     { boxShadow: "0 0 40px 8px rgba(255,69,0,0.35)" },
        },
        tickerScroll: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        ringOrbit: {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        borderShimmer: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%":     { backgroundPosition: "100% 50%" },
        },
        bullGlow: {
          "0%,100%": { filter: "drop-shadow(0 0 6px rgba(255,69,0,0.35))" },
          "50%":     { filter: "drop-shadow(0 0 22px rgba(255,69,0,0.65))" },
        },
      },
      boxShadow: {
        "ember-sm": "0 0 24px -6px rgba(255,69,0,0.35)",
        ember:     "0 0 48px -8px rgba(255,69,0,0.45)",
        gold:      "0 0 24px -6px rgba(245,194,107,0.35)",
        inset:     "inset 0 1px 0 0 rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
