/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        funky:["funky","sans-serif"],
        black_clover:["black_clover","sans-serif"],
        beastars:["beastars","sans-serif"],
        dragon_ball:["dragon_ball","sans-serif"],
      }
    },
  },
  plugins: [],
}