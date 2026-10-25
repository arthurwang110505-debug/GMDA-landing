import type { Config } from 'tailwindcss'

const themeColor = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic colors switch with data-theme. Brand Ink, Spark Lime,
        // Paper, Cloud White, and Blush remain fixed GMDA colors.
        primary: themeColor('color-primary'),
        accent: themeColor('color-accent'),
        line: themeColor('color-line'),
        surface: {
          page: themeColor('surface-page'),
          card: themeColor('surface-card'),
          layer: themeColor('surface-layer'),
        },
        approval: {
          DEFAULT: themeColor('color-approval'),
          accent: themeColor('color-approval-accent'),
        },
        slate: {
          50: themeColor('slate-50'),
          100: themeColor('slate-100'),
          200: themeColor('slate-200'),
          300: themeColor('slate-300'),
          400: themeColor('slate-400'),
          500: themeColor('slate-500'),
          600: themeColor('slate-600'),
          700: themeColor('slate-700'),
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
      borderRadius: {
        DEFAULT: '0', sm: '0', md: '0', lg: '0', xl: '0',
        '2xl': '0', '3xl': '0', full: '0',
      },
      fontFamily: {
        sans: ['Manrope Variable', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        site: '80rem',
      },
      boxShadow: {
        window: '8px 8px 0 rgb(var(--color-accent) / 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config
