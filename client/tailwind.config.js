/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: "#0066FF",   // Deep Blue
        brandOrange: "#FF8000", // Bright Orange
        brandYellow: "#FFD033", // Golden Yellow
        brandPurple: "#6A5ACD", // Soft transition tone
        brandDark: "#1E1E2E",   // Dark accent (from feather shading)
      },
    },
  },
  plugins: [],
}
