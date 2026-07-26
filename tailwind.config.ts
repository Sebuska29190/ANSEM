import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted)",
        ansem: {
          900: "#030305",
          800: "#0b0b11",
          700: "#151521",
          600: "#1f1f2d",
          accent: "#9945ff",
          accent2: "#14f195",
          up: "#22c55e",
          down: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 50% 0%, rgba(153,69,255,0.12), transparent 50%)",
      },
    },
  },
  plugins: [],
};
export default config;
