import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          'bg-dark': '#19192E',
          'bg-light': '#E9EAF5',
          'blue-primary': '#3185C5',
          'blue-deep': '#174166',
          'blue-light': '#49ACED',
          'blue-mid': '#306A9C',
          'orange-main': '#F97300',
          'orange-gold': '#FBA81E',
          'card-bg': '#1F1F3A',
        },
      },
      fontFamily: {
        humanst: ['var(--font-humanst)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        cta: '0 0 24px rgba(249,115,0,0.4)',
        card: '0 4px 32px rgba(25,25,46,0.6)',
        'glow-blue': '0 0 20px rgba(49,133,197,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
