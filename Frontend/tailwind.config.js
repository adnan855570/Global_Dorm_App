/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <--- THIS LINE IS REQUIRED!
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
