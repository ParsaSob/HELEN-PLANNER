import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgDeep: "#0E1912",
        bgMid: "#16261C",
        moss: "#3F5C41",
        fern: "#6E9878",
        gold: "#C9A15D",
        ember: "#E8B979",
        ink: "#ECE6D8",
        inkSoft: "#A79C89",
      },
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"],
      },
      borderRadius: {
        organic: "26px 14px 26px 14px",
        organic2: "20px 10px 20px 10px",
      },
    },
  },
  plugins: [],
};
export default config;
