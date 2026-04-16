/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f5f3f0',
          100: '#e8e3d9',
          200: '#d4c9b5',
          300: '#b8a98a',
          400: '#9d8a65',
          500: '#7d6b4a',
          600: '#5c4d33',
          700: '#3d3220',
          800: '#261f12',
          900: '#150f07',
        },
        jade: {
          50: '#edfdf6',
          100: '#d3f9e8',
          200: '#a9f2d4',
          300: '#71e6b9',
          400: '#38d19c',
          500: '#14b882',
          600: '#0a9469',
          700: '#0c7556',
          800: '#0e5d45',
          900: '#0d4c39',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(20, 184, 130, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(20, 184, 130, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
