/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // SB Haircare brand palette — bordeaux / crème / blanc
        bordeaux: {
          DEFAULT: "#4A1015",
          deep: "#3A0B10",
          soft: "#6B1F26",
          light: "#8C3A42",
        },
        cream: {
          DEFAULT: "#FFFFFF",
          light: "#FBF7ED",
          warm: "#EFE3CF",
        },
        ocre: {
          DEFAULT: "#D4A24C",
          soft: "#E8C481",
          deep: "#B5872E",
        },
        ink: {
          DEFAULT: "#2A1A1C",
          soft: "#5C4348",
          muted: "#8A7378",
        },
      },
      fontFamily: {
        serif: ["PlayfairDisplay_500Medium", "serif"],
        "serif-bold": ["PlayfairDisplay_700Bold", "serif"],
        sans: ["Inter_400Regular", "system-ui", "sans-serif"],
        "sans-medium": ["Inter_500Medium", "system-ui", "sans-serif"],
        "sans-semibold": ["Inter_600SemiBold", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
