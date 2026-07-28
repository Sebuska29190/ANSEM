import type { Config } from "tailwindcss";

/**
 * ANSEM Terminal v3 — design tokens.
 *
 * Warm-black terminal palette:
 *   bg / panel / raised → warm near-blacks
 *   line                → hairline borders
 *   text / dim / mute   → warm grayscale
 *   ember               → brand orange (the bull)
 *   gold                → premium accent
 *   up / down           → functional green/red (desaturated)
 *   info                → cyan for links / SOL context
 */
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./netlify/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0908",
        panel: "#131009",
        raised: "#1C1812",
        line: "#2A241C",

        text: "#F2EDE6",
        dim: "#8A8175",
        mute: "#4A443B",

        ember: {
          DEFAULT: "#FF4500",
          deep: "#C73600",
          glow: "rgba(255,69,0,0.35)",
        },
        gold: {
          DEFAULT: "#F5C26B",
          deep: "#B89B00",
        },
        up: "#2FBF71",
        down: "#F0455C",
        info: "#6BC5D8",
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        sans: ["var(--font-ibm-plex)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 50% 0%, rgba(255,69,0,0.14), rgba(255,69,0,0.03) 35%, transparent 60%), radial-gradient(circle at 80% 100%, rgba(245,194,107,0.05), transparent 50%)",
        "ember-glow":
          "linear-gradient(180deg, transparent 0%, rgba(255,69,0,0.06) 100%)",
      },
      animation: {
        "ember-pulse": "emberPulse 2.4s ease-in-out infinite",
        "ticker-scroll": "tickerScroll 60s linear infinite",
        "ring-orbit": "ringOrbit 24s linear infinite",
        "border-shimmer": "borderShimmer 4s ease-in-out infinite",
        "bull-glow": "bullGlow 3s ease-in-out infinite",
        "live-pulse": "livePulse 2s ease-in-out infinite",
      },
      keyframes: {
        emberPulse: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(255,69,0,0.0)" },
          "50%": { boxShadow: "0 0 40px 8px rgba(255,69,0,0.35)" },
        },
        tickerScroll: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        ringOrbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        borderShimmer: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        bullGlow: {
          "0%,100%": { filter: "drop-shadow(0 0 6px rgba(255,69,0,0.35))" },
          "50%": { filter: "drop-shadow(0 0 22px rgba(255,69,0,0.65))" },
        },
        livePulse: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      boxShadow: {
        "ember-sm": "0 0 24px -6px rgba(255,69,0,0.35)",
        ember: "0 0 48px -8px rgba(255,69,0,0.45)",
        gold: "0 0 24px -6px rgba(245,194,107,0.35)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
