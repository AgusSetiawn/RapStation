/** @type {import('tailwindcss').Config} */
module.exports = {
  // PENTING: Gunakan 'class' (atau 'selector' untuk Tailwind v4)
  // Ini memberitahu Tailwind untuk melihat class="dark" di HTML, bukan setting laptop.
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'blink': 'blink 0.3s ease-in-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shake-lock': 'shake-lock 0.5s ease-in-out',
        'border-beam': 'border-beam 4s linear infinite',
        'blob': 'blob 7s infinite',
        'star-fall': 'star-fall linear infinite',
        'shield-pulse': 'shield-pulse 3s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(10deg)' },
        },
        'shake-lock': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px) rotate(-5deg)' },
          '75%': { transform: 'translateX(3px) rotate(5deg)' },
        },
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'star-fall': {
          '0%': { top: '-10%', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        'shield-pulse': {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 0px red)' },
          '50%': { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 10px red)' },
        },
        shimmer: {
          'from': { transform: 'translateX(-100%) skewX(-15deg)' },
          'to': { transform: 'translateX(100%) skewX(-15deg)' }
        }
      },
    },
  },
  plugins: [],
};
