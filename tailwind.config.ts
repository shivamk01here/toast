import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 30px rgba(239, 68, 68, 0.35)",
        fire: "0 0 25px rgba(249, 115, 22, 0.35)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(250, 250, 250, 0.05) 1px, transparent 1px), linear-gradient(to right, rgba(250, 250, 250, 0.05) 1px, transparent 1px)"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        simple: ["var(--font-simple)", "sans-serif"],
        marker: ["var(--font-marker)", "cursive"],
        industrial: ["var(--font-industrial)", "sans-serif"]

      }
    }
  },
  plugins: []
};

export default config;
