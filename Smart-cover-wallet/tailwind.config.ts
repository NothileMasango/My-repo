import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "om-green": { 500: "#22c55e", 600: "#16a34a", 700: "#15803d" },
        "om-gold": { 500: "#f59e0b", 600: "#d97706" },
        "om-navy": { 500: "#1e3a5f", 600: "#162d4a" },
      },
    },
  },
  plugins: [],
};
export default config;
