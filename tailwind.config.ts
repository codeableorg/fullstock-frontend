import { Config } from "tailwindcss";
import TailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary-background))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-background-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary-background))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-background-hover))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted-background))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent-background))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          hover: "hsl(var(--border-hover))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--outline))",
        separator: "hsl(var(--separator))",
      },
    },
  },
  plugins: [TailwindAnimate],
};

export default config;
