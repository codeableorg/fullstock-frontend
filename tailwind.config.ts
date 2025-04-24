import { type Config } from "tailwindcss";
import TailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary-background)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary-background-hover)",
        },
        secondary: {
          DEFAULT: "var(--secondary-background)",
          foreground: "var(--secondary-foreground)",
          hover: "var(--secondary-background-hover)",
        },
        muted: {
          DEFAULT: "var(--muted-background)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent-background)",
          foreground: "var(--accent-foreground)",
        },
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
        },
        input: "var(--input)",
        ring: "var(--outline)",
        separator: "var(--separator)",
      },
    },
  },
  plugins: [TailwindAnimate],
};

export default config;
