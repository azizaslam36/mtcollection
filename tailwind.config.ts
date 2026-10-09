import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14212E",
          soft: "#3A4753",
        },
        paper: "#F4F5F1",
        marigold: {
          DEFAULT: "#E2A33B",
          dark: "#C9871F",
        },
        pine: "#1F6F52",
        mist: "#E3E5DF",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        tag: "4px",
      },
      boxShadow: {
        card: "0 8px 24px -12px rgba(20, 33, 46, 0.18)",
        "card-hover": "0 16px 32px -14px rgba(20, 33, 46, 0.28)",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
