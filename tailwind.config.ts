import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Sistema editorial (ADR-011) con la PALETA OFICIAL de marca ──
        // Colores oficiales: #3185C5, #174166, #F97300, #FBA81E, #E9EAF5,
        // #19192E. Contraste de cada par verificado por cálculo (luminancia
        // WCAG). Reglas de uso por token. Los `forge-*` de abajo quedan solo
        // para /admin.
        ef: {
          ink: '#19192E',        // base oscura / texto principal. Sobre light: 14.4:1
          'ink-soft': '#33334A', // texto secundario sobre light (alto contraste)
          paper: '#E9EAF5',      // base clara oficial
          'paper-dim': '#D8DBEC',// panel claro un poco más profundo
          blue: '#3185C5',       // PRIMARIO oficial — mid blue: solo texto grande/fills (≤4:1)
          'blue-deep': '#174166',// panel primario + acento sobre claro. Texto light: 8.85:1
          orange: '#F97300',     // acento/fill/panel — SOLO texto ink encima (6.13:1), nunca blanco
          gold: '#FBA81E',       // acento/fill — texto ink (8.79:1)
        },
        forge: {
          'bg-dark': '#19192E',
          'bg-light': '#E9EAF5',
          'blue-primary': '#3185C5',
          'blue-deep': '#174166',
          'blue-light': '#49ACED',
          'blue-mid': '#306A9C',
          'orange-main': '#F97300',
          'orange-gold': '#FBA81E',
          // WCAG AA-safe counterpart to orange-main for text/icons on light
          // backgrounds — #F97300 as foreground on white is 2.8:1 (fails
          // the 4.5:1 minimum for normal text). Verified: #B85700 on
          // #FFFFFF is 4.77:1. Never used as a background fill (orange-main
          // stays the brand fill color); only as a foreground color where
          // orange-main would fail contrast.
          'orange-deep': '#B85700',
          // ADR-010: panel "humano/equipo" — mismo hue/saturación de
          // orange-main (27.7°/100%) con lightness subida a 0.88; no es un
          // color inventado, es el naranja de marca aclarado. Verificado:
          // 13.51:1 con texto forge-bg-dark. Texto forge-orange-deep sobre
          // este fondo da 3.74:1 — solo válido en texto grande/negrita
          // (umbral AA de 3:1), nunca en cuerpo de texto normal.
          'peach-tint': '#FFDEC2',
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
      // DIS-01: escala tipográfica fluida consolidada — reemplaza ~20
      // valores clamp() divergentes repartidos por los componentes
      // (algunos eran duplicados casi idénticos) por 6 pasos con nombre.
      fontSize: {
        // ADR-011 editorial: tipografía display a gran escala. `fluid-giant`
        // para cifras de autoridad (banda de stats); `fluid-mega` para el
        // titular del hero. Leading muy ajustado y tracking negativo — se
        // leen como declaraciones, no como texto.
        'fluid-giant': ['clamp(4.5rem, 18vw, 15rem)', { lineHeight: '0.85', letterSpacing: '-0.03em' }],
        'fluid-mega': ['clamp(3rem, 11vw, 9rem)', { lineHeight: '0.92', letterSpacing: '-0.025em' }],
        'fluid-display': ['clamp(2.6rem, 8vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.015em' }],
        'fluid-h1': ['clamp(2.4rem, 7vw, 4.5rem)', { lineHeight: '1.05' }],
        'fluid-h2': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.1' }],
        'fluid-h3': ['clamp(1.3rem, 2vw, 1.8rem)', { lineHeight: '1.2' }],
        'fluid-h4': ['clamp(1.1rem, 2vw, 1.4rem)', { lineHeight: '1.3' }],
        'fluid-stat': ['clamp(1.8rem, 5vw, 2.4rem)', { lineHeight: '1' }],
      },
      keyframes: {
        // ADR-011 tech-stack marquee. Two identical rows translate -100%
        // in lockstep for a seamless infinite loop.
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'marquee-reverse': 'marquee 38s linear infinite reverse',
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
