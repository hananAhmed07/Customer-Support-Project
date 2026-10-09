import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F6F6F4",
        surface: "#FFFFFF",
        "surface-muted": "#F1F1EE",
        "surface-sunken": "#ECECE8",
        hairline: "#EAE9E3",
        line: "#DEDDD6",
        ink: "#1C1C1A",
        "ink-muted": "#57564F",
        "ink-subtle": "#83827A",
        accent: "#0F766E",
        "accent-strong": "#115E59",
        "accent-soft": "#E4F1EF",
        "accent-line": "#B9DAD5",
        success: "#1F7A4D",
        "success-soft": "#E6F2EA",
        danger: "#B02A30",
        "danger-soft": "#FBECEC",
        "danger-line": "#EFC9CA",
        warning: "#96690A",
        "warning-soft": "#F7EFD9",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,28,26,0.04), 0 12px 32px -12px rgba(28,28,26,0.14)",
        control: "0 1px 1px rgba(28,28,26,0.04)",
        lift: "0 2px 4px rgba(28,28,26,0.05), 0 20px 48px -18px rgba(28,28,26,0.22)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "trace-draw": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-160% 0" },
          "100%": { backgroundPosition: "260% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        "ping-soft": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "80%, 100%": { transform: "scale(2.1)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 320ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "trace-draw": "trace-draw 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.6s linear infinite",
        "pulse-soft": "pulse-soft 1.4s ease-in-out infinite",
        "ping-soft": "ping-soft 1.8s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
