/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["CookieRun-Regular", "sans-serif"],
        nanumLight: ["NanumSquareNeoLight", "sans-serif"],
        yang: ["양진체", "돋움체"],
        NanumBarunGothic: ["NanumBarunGothic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
