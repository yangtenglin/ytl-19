/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brass: {
          50: '#fdf8ed',
          100: '#faedd1',
          200: '#f3d899',
          300: '#ecc062',
          400: '#e5a93a',
          500: '#c89b3c',
          600: '#aa7c2a',
          700: '#865b22',
          800: '#6c4822',
          900: '#5a3c1f',
        },
        patina: {
          400: '#5d9783',
          500: '#4a7c6b',
          600: '#3c6458',
          700: '#2e4c44',
        },
        rust: {
          400: '#c95754',
          500: '#b0413e',
          600: '#8c3330',
          700: '#6b2725',
        },
        coal: {
          50: '#f6f3f1',
          100: '#e8e0da',
          200: '#cdbdb0',
          300: '#ad9482',
          400: '#7a6352',
          500: '#3d2d22',
          600: '#2a1d16',
          700: '#1a1410',
          800: '#120e0b',
          900: '#0a0806',
        },
        parchment: {
          50: '#fbf6eb',
          100: '#f3e8cb',
          200: '#e8d49a',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'metal-brush': 'linear-gradient(135deg, #4a3c30 0%, #2a1d16 50%, #4a3c30 100%)',
        'brass-shine': 'linear-gradient(135deg, #ecc062 0%, #c89b3c 40%, #aa7c2a 60%, #ecc062 100%)',
        'track-wood': 'repeating-linear-gradient(90deg, #5a3c1f 0px, #5a3c1f 80px, #3d2815 80px, #3d2815 100px)',
      },
      boxShadow: {
        'rivet': 'inset 0 1px 2px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.5)',
        'metal-inset': 'inset 0 2px 8px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.05)',
        'glow-brass': '0 0 12px rgba(200,155,60,0.4), 0 0 24px rgba(200,155,60,0.2)',
        'glow-rust': '0 0 12px rgba(176,65,62,0.5), 0 0 24px rgba(176,65,62,0.25)',
        'glow-patina': '0 0 10px rgba(74,124,107,0.5)',
        'card-lift': '0 8px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)',
      },
      animation: {
        'led-blink': 'ledBlink 1.2s ease-in-out infinite',
        'float-up': 'floatUp 0.3s ease-out',
        'gauge-fill': 'gaugeFill 1s ease-out forwards',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        ledBlink: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1.2)' },
          '50%': { opacity: '0.6', filter: 'brightness(0.8)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gaugeFill: {
          '0%': { strokeDashoffset: '1000' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
};
