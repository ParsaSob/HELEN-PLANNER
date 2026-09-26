import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgDeep: "#0C1712",
        bgMid: "#13201A",
        bgCard: "#1A2B22",
        moss: "#3F5C41",
        fern: "#6E9878",
        sage: "#8BAF9E",
        gold: "#C9A15D",
        ember: "#E8B979",
        river: "#5B8AA6",
        stone: "#A79C89",
        ink: "#ECE6D8",
        inkSoft: "#A79C89",
        inkDim: "#6B6356",
        wood: "#A78B6F",
        bark: "#5A4A3C",
      },
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"],
      },
      borderRadius: {
        organic: "26px 14px 26px 14px",
        organic2: "20px 10px 20px 10px",
        card: "18px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 8px 32px -12px rgba(0,0,0,0.5), 0 2px 8px -4px rgba(0,0,0,0.3)",
        cardHover: "0 16px 48px -12px rgba(0,0,0,0.6), 0 4px 16px -6px rgba(0,0,0,0.4)",
        glow: "0 0 24px -4px rgba(201,161,93,0.25)",
        glowFern: "0 0 24px -4px rgba(110,152,120,0.25)",
        inner: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      transitionTimingFunction: {
        organic: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "slide-in": "slideIn 0.4s ease-out forwards",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
