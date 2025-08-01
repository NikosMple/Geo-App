const { fontFamily } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...fontFamily.sans],
        sora: ['Sora', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        righteous: ['Righteous', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
      },
    },
  },
  plugins: [ plugin(function({ addUtilities }) {
      addUtilities({
        '.[transform-style\\:preserve-3d]': {
          'transform-style': 'preserve-3d',
        },
      })
    })],
}