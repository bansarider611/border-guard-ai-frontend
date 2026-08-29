/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graphite: '#171817',
        charcoal: {
          DEFAULT: '#202321',
          50: '#2a2d2a',
          100: '#333633',
        },
        stone: {
          warm: '#D8D4CB',
        },
        ivory: '#F3F0E8',
        sage: {
          DEFAULT: '#82977F',
          light: '#a3b8a0',
          dark: '#6b7f68',
        },
        forest: {
          DEFAULT: '#344A3B',
          light: '#4a6553',
          dark: '#243329',
        },
        gold: {
          DEFAULT: '#B49A63',
          light: '#c9b07a',
          dark: '#9a8350',
        },
        vermilion: {
          DEFAULT: '#B85C52',
          light: '#c9756b',
          dark: '#9c4a40',
        },
        lilac: {
          DEFAULT: '#9B96A8',
          light: '#b0abbd',
          dark: '#827d8f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'scan-line': 'scan-line 2.5s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
      keyframes: {
        'scan-line': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(100%)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
