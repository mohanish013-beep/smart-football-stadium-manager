/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'fifa-green': '#00ff87',
        'fifa-purple': '#6300ff',
        'dark-bg': '#0f172a',
      },
    },
  },
  plugins: [],
}
