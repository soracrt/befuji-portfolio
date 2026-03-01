import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
      },
      keyframes: {
        'spin-around': {
          '0%':         { transform: 'translateZ(0) rotate(0)' },
          '15%, 35%':   { transform: 'translateZ(0) rotate(90deg)' },
          '65%, 85%':   { transform: 'translateZ(0) rotate(270deg)' },
          '100%':       { transform: 'translateZ(0) rotate(360deg)' },
        },
        'shimmer-slide': {
          to: { transform: 'translate(calc(100cqw - 100%), 0)' },
        },
      },
      colors: {
        bg: '#000000',
        ink: '#fffffc',
        divider: '#1a1a1a',
        card: '#111111',
        accent: '#a10702',
      },
      fontFamily: {
        display: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
