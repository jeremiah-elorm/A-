import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        paper: "#f8f4ea",
        sand: "#f0e6d6",
        accent: "#f97316",
      },
      boxShadow: {
        card: "0 16px 40px -24px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
