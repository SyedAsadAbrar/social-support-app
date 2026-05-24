import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Arial",
          "sans-serif"
        ]
      },
      colors: {
        ink: "#17231f",
        mist: "#edf7f2",
        civic: "#166534",
        civicDark: "#0f3d24",
        civicSoft: "#dcfce7",
        action: "#166534",
        alert: "#b4443a"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(22, 101, 52, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
