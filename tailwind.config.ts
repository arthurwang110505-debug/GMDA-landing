import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // GMDA brand starter: Ink, Spark Lime, Paper, Cloud White,
        // Ink Soft, and Blush. Slate steps are neutral Ink tints for text.
        slate: {
          50: '#FFFFFF',
          100: '#F5F3EC',
          200: '#E8E6EF',
          300: '#D2CFDE',
          400: '#B9B5C9',
          500: '#AAA5BC',
          600: '#A49FB8',
          700: '#77728D',
          800: '#2A2A55',
          900: '#14142B',
          950: '#14142B',
        },
        ink: {
          950: '#14142B',
          900: '#14142B',
          850: '#2A2A55',
          800: '#2A2A55',
          700: '#2A2A55',
        },
        lime: {
          300: '#C8F23C',
          400: '#B7DA33',
          500: '#C8F23C',
        },
        blush: {
          50: '#FFF0EB',
          100: '#FF8F73',
          200: '#FF8F73',
        },
        paper: '#F5F3EC',
      },
      fontFamily: {
        sans: ['Manrope Variable', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        site: '80rem',
      },
      boxShadow: {
        window: '0 40px 100px -30px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(200, 242, 60, 0.04)',
      },
    },
  },
  plugins: [],
} satisfies Config
