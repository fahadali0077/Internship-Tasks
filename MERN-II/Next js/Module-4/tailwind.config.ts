import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#1a1612",
          soft: "#3d3830",
          muted: "#8a7f74",
        },
        parchment: "#f7f3ee",
        cream: "#ede8e0",
        amber: {
          DEFAULT: "#d97706",
          light: "#fbbf24",
          dim: "#fef3c7",
          600: "#b45309",
        },
        border: "#e2dbd2",
      },
      borderRadius: {
        lg: "14px",
        xl: "20px",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(26,22,18,0.07), 0 0 1px rgba(26,22,18,0.08)",
        md: "0 4px 16px rgba(26,22,18,0.10)",
        lg: "0 12px 32px rgba(26,22,18,0.13), 0 2px 8px rgba(26,22,18,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
