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
          surface: '#242442',
          border: 'rgba(49,133,197,0.15)',
          'text-muted': 'rgba(255,255,255,0.55)',
          'text-body': 'rgba(255,255,255,0.82)',
        },
      },
      fontFamily: {
        humanst: ['var(--font-humanst)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        'forge-card': '0 1px 3px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4)',
        'forge-cta': '0 0 0 1px rgba(249,115,0,0.3), 0 8px 24px rgba(249,115,0,0.25)',
        'forge-hover': '0 0 0 1px rgba(49,133,197,0.4), 0 12px 40px rgba(49,133,197,0.15)',
        'forge-input': '0 0 0 2px rgba(249,115,0,0.5)',
        cta: '0 0 24px rgba(249,115,0,0.4)',
        card: '0 4px 32px rgba(25,25,46,0.6)',
        'glow-blue': '0 0 20px rgba(49,133,197,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
