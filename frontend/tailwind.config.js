/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#1DB954",
          dark: "#15a348",
          light: "#e6f9ee",
        },
        navy: {
          DEFAULT: "#0f1923",
          2: "#1a2535",
        },
      },
      fontFamily: {
        head: ["Sora", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
