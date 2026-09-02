import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1A2B",
          muted: "#3D4A5C",
          faint: "#6B7686",
        },
        cream: {
          DEFAULT: "#F6F3EE",
          dark: "#E8E2D8",
        },
        teal: {
          DEFAULT: "#1F6F78",
          dark: "#16555C",
          light: "#E6F2F3",
        },
        gold: {
          DEFAULT: "#B8956A",
          light: "#F3EBE0",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(14, 26, 43, 0.04), 0 8px 24px rgba(14, 26, 43, 0.06)",
        lift: "0 12px 40px rgba(14, 26, 43, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
