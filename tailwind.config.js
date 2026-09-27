/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FFF8ED",
          50: "#FFFDF8",
          100: "#FFF3DC",
        },
        maroon: {
          50: "#FBEFF0",
          100: "#F0D2D6",
          300: "#B85868",
          400: "#9C3446",
          500: "#8B2635",
          600: "#7A1F2B",
          700: "#5C1620",
          800: "#3E0E15",
        },
        marigold: {
          50: "#FFF7E6",
          100: "#FFE9BE",
          300: "#FBC15C",
          400: "#F7AE3A",
          500: "#F5A623",
          600: "#DB8B0E",
          700: "#B8710A",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E4C766",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "sans-serif"],
      },
      keyframes: {
        scrollUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
      animation: {
        "scroll-up": "scrollUp 15s linear infinite",
      },
      boxShadow: {
        temple: "0 12px 32px -12px rgba(92, 22, 32, 0.28)",
        "temple-sm": "0 4px 14px -6px rgba(92, 22, 32, 0.22)",
      },
    },
  },
  plugins: [],
};