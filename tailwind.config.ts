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
        ink: "#182033",
        mist: "#eef3f7",
        civic: "#17635a",
        action: "#235789",
        alert: "#b4443a"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(24, 32, 51, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
