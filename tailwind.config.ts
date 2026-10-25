import type { Config } from 'tailwindcss'

const themeColor = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic colors switch with data-theme. The Aqua family, Rose, Sage,
        // and the Ink/Cloud neutrals are fixed GMDA brand colors.
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
          800: '#272533',
          900: '#16151D',
          950: '#16151D',
        },
        ink: {
          950: '#16151D',
          900: '#16151D',
          850: '#272533',
          800: '#272533',
          700: '#272533',
        },
        // Fixed brand palette (see continue.md): Aqua family + Rose + Sage + neutrals.
        aqua: {
          50: '#E6F5F7', // Mist — soft fills
          100: '#A5DEE4', // Aqua — brand, active
          200: '#5DB8C4', // Lagoon — cards, rings
          300: '#1F6F7C', // Teal — text on light
          400: '#0F2E35', // Abyss — dark hero areas
        },
        rose: {
          DEFAULT: '#EEA9A9',
          deep: '#A33F49',
        },
        sage: {
          DEFAULT: '#B5CAA0',
          deep: '#4E683B',
        },
        // Legacy aliases (class names kept for existing markup).
        lime: {
          300: '#A5DEE4',
          400: '#8CC9D1',
          500: '#5DB8C4',
        },
        blush: {
          50: '#EEA9A9',
          100: '#EEA9A9',
          200: '#A33F49',
        },
        paper: '#F6F7FA',
      },
      fontFamily: {
        sans: ['Pixelify Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '0',
      },
      borderWidth: {
        DEFAULT: '2px',
        0: '0',
        2: '2px',
        4: '4px',
      },
      maxWidth: {
        site: '80rem',
      },
      boxShadow: {
        // hard pixel shadows — depth from offset blocks, never blur
        sm: '2px 2px 0 0 rgba(10, 10, 22, 0.35)',
        DEFAULT: '3px 3px 0 0 rgba(10, 10, 22, 0.4)',
        md: '4px 4px 0 0 rgba(10, 10, 22, 0.4)',
        lg: '6px 6px 0 0 rgba(10, 10, 22, 0.45)',
        xl: '8px 8px 0 0 rgba(10, 10, 22, 0.45)',
        '2xl': '12px 12px 0 0 rgba(10, 10, 22, 0.5)',
        inner: 'inset 0 2px 0 0 rgba(255, 255, 255, 0.06)',
        window: '8px 8px 0 0 rgba(10, 10, 22, 0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config
