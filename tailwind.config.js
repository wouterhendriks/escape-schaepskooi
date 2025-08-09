/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'typewriter': 'typewriter 3s steps(40) 1s 1 normal both',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        typewriter: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        glow: {
          'from': { boxShadow: '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000' },
          'to': { boxShadow: '0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000' }
        }
      }
    },
  },
  plugins: [],
}