import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f4f8f6',
          100: '#edf4f1',
          200: '#d8e4df',
          300: '#bccfc7',
          400: '#a2b8af',
          500: '#829d93',
          600: '#7a948a',
          700: '#5c776d',
          800: '#344e45',
          900: '#1c332c',
          950: '#10241f',
        },
        ink: {
          950: '#051513',
          900: '#071b19',
          850: '#0a211e',
          800: '#0d2925',
          700: '#173b35',
        },
        mint: {
          300: '#9be7c5',
          400: '#70d6ac',
          500: '#48bd91',
        },
        paper: '#e8f0e9',
      },
      fontFamily: {
        sans: ['Manrope Variable', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        site: '80rem',
      },
      boxShadow: {
        window: '0 40px 100px -30px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(155, 231, 197, 0.04)',
        glow: '0 0 50px rgba(112, 214, 172, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config
