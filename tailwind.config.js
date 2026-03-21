/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: {
          900: '#06080f',
          800: '#0c1120',
          700: '#111827',
          600: '#1a2236',
          500: '#243049',
        },
        accent: {
          blue: '#3882f6',
          cyan: '#22d3ee',
          violet: '#8b5cf6',
        }
      },
      boxShadow: {
        glow: '0 0 20px rgba(56, 130, 246, 0.15)',
        'glow-lg': '0 0 40px rgba(56, 130, 246, 0.25)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
