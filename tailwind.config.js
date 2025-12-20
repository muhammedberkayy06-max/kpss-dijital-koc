/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif"
        ],
      },
      colors: {
        ios: {
          bg: "#F2F2F7",
          card: "#FFFFFF",
          blue: "#007AFF",
          green: "#34C759",
          red: "#FF3B30",
          gray: "#8E8E93",
          separator: "#C6C6C8"
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
