================================================================
PROMPT DEFINITIVO — ELEVAFORGE REDESIGN VISUAL COMPLETO
Para: GitHub Copilot (instrucciones en .github/copilot-instructions.md)
Repo: https://github.com/Luisceron0/ElevaForge
Stack: Next.js 14 (App Router) + Tailwind CSS + Supabase + GSAP
================================================================

CONTEXTO DEL PROYECTO
---------------------
ElevaForge es una agencia de software colombiana. Su sitio actual
(elevaforge.com) existe y funciona pero se ve generico. El objetivo
es darle una nueva vida visual profesional, moderna y accesible para
un publico de jovenes hasta adultos mayores — software amigable para
todos. El rediseno debe mantener Lighthouse 100/100 en Performance,
SEO y Best Practices, con Accessibility 90+.

STACK CONFIRMADO DEL REPO:
  Next.js 14 (App Router)
  TypeScript 83.9%
  Tailwind CSS (design system ya configurado)
  SCSS 9.4% — reemplazar todo SCSS por Tailwind puro
  Supabase (leads ya funciona)
  GSAP — NO instalado aun, hay que instalarlo en este rediseno

REPOSITORIO: https://github.com/Luisceron0/ElevaForge
SITIO ACTUAL: https://www.elevaforge.com/

================================================================
BLOQUE 0 — INSTALACION Y SETUP INICIAL
================================================================

Paso 1: Instalar GSAP (licencia gratuita)
  npm install gsap @gsap/react

Paso 2: Registrar plugins en un archivo central
  Crear: lib/gsap.ts

  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'

  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }

  export { gsap, ScrollTrigger }

Paso 3: Eliminar TODO el SCSS del proyecto
  Borrar cualquier archivo .scss o .module.scss
  Reemplazar sus estilos con clases Tailwind directamente
  Excepcion: globals.css (solo variables CSS y reset base)

Paso 4: Agregar en globals.css
  html {
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }


================================================================
BLOQUE 1 — DESIGN SYSTEM ACTUALIZADO
================================================================

1.1 FILOSOFIA VISUAL DEL REDISENO
El nuevo diseno sigue el patron "Trust & Authority + Hero-Centric"
del UI UX Pro Max skill. Estilo: Soft Dark Premium.

  - No es cinetico ni brutalista
  - Es profesional, claro, accesible y moderno a la vez
  - Funciona igual de bien para un joven de 20 y un empresario de 60
  - Colores del manual de marca como base absoluta
  - Tipografia grande, jerarquia visual clara, mucho espacio en blanco
  - Animaciones utiles (revelan informacion) no decorativas

ANTI-PATRONES A EVITAR (para este perfil de cliente):
  - Neon / glow excesivo
  - Particulas flotantes (pesan en performance)
  - Parallax agresivo
  - Texto muy pequeno en mobile
  - Contraste insuficiente en secciones claras
  - Cards apiladas sin jerarquia visual
  - Iconos emoji en lugar de SVG

1.2 TOKENS DE COLOR (ya en tailwind.config.ts — NO cambiar)
  forge-bg-dark:      #19192E
  forge-bg-light:     #E9EAF5
  forge-blue-primary: #3185C5
  forge-blue-deep:    #174166
  forge-blue-light:   #49ACED
  forge-blue-mid:     #306A9C
  forge-orange-main:  #F97300
  forge-orange-gold:  #FBA81E
  forge-card-bg:      #1F1F3A

NUEVOS TOKENS a agregar en tailwind.config.ts:
  forge-surface:      #242442   (cards elevadas sobre bg-dark)
  forge-border:       rgba(49,133,197,0.15)  (bordes sutiles)
  forge-text-muted:   rgba(255,255,255,0.55) (texto secundario dark)
  forge-text-body:    rgba(255,255,255,0.82) (texto cuerpo dark)

1.3 TIPOGRAFIA

Fuente display (ya instalada): Humanist531BT-BlackA.woff2
  Usar para: h1, h2, nombres de secciones, numeros grandes
  Variable CSS: --font-humanst

Fuente cuerpo: Inter (next/font/google, ya instalada)
  Usar para: todo lo demas
  Variable CSS: --font-inter

ESCALA TIPOGRAFICA NUEVA (mobile-first):
  h1 hero:         clamp(2.8rem, 8vw, 6rem)   — font-humanst, leading-none
  h2 seccion:      clamp(2rem, 5vw, 3.5rem)   — font-humanst, leading-tight
  h3 card:         clamp(1.1rem, 2vw, 1.4rem) — font-humanst
  body grande:     1.125rem (18px)             — font-inter, leading-relaxed
  body normal:     1rem (16px)                 — font-inter
  label / badge:   0.75rem (12px)              — font-inter, font-semibold, tracking-widest uppercase
  numero gigante:  clamp(4rem, 12vw, 9rem)     — font-humanst, font-black

IMPORTANTE: Nunca bajar de 16px en mobile para texto de lectura.
Esto es critico para adultos mayores (accesibilidad real, no solo WCAG).

1.4 ESPACIADO Y RITMO VERTICAL
  Padding de seccion:  py-24 md:py-32 (192px en desktop)
  Gap entre cards:     gap-4 md:gap-6
  Max-width contenido: max-w-7xl mx-auto px-4 md:px-8 lg:px-12

1.5 BORDER RADIUS
  Cards:           rounded-2xl (16px)
  Botones:         rounded-xl (12px)
  Badges:          rounded-full
  Inputs:          rounded-lg (8px)

1.6 SOMBRAS ACTUALIZADAS (agregar en tailwind.config.ts)
  shadow-forge-card:   0 1px 3px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4)
  shadow-forge-cta:    0 0 0 1px rgba(249,115,0,0.3), 0 8px 24px rgba(249,115,0,0.25)
  shadow-forge-hover:  0 0 0 1px rgba(49,133,197,0.4), 0 12px 40px rgba(49,133,197,0.15)
  shadow-forge-input:  0 0 0 2px rgba(249,115,0,0.5)  (focus state)


================================================================
BLOQUE 2 — ARQUITECTURA ACTUALIZADA
================================================================

NUEVA ESTRUCTURA DE COMPONENTES:

/components/
  /sections/
    HeroSection.tsx         — REDISENAR COMPLETO
    ForgeStandards.tsx      — REDISENAR: bento grid asimetrico
    AutonomySection.tsx     — REDISENAR: layout mejorado
    RoadmapSection.tsx      — REDISENAR: timeline animado con GSAP
    PricingSection.tsx      — REDISENAR: cards mejoradas
    ProjectsSection.tsx     — NUEVO: carrusel con hover reveal
    ContactSection.tsx      — MANTENER pero mejorar UI del form
  /ui/
    CTAButton.tsx           — ACTUALIZAR: nuevos estilos
    Badge.tsx               — ACTUALIZAR
    SectionWrapper.tsx      — ACTUALIZAR: nuevo espaciado
    GlowDivider.tsx         — ACTUALIZAR o eliminar
    AnimatedNumber.tsx      — NUEVO: contador animado con GSAP
    ProjectCard.tsx         — NUEVO: card de proyecto con hover
    BentoCard.tsx           — NUEVO: card del bento grid
  /layout/
    Navbar.tsx              — REDISENAR: mas compacto, mejor mobile
    Footer.tsx              — MANTENER estructura, mejorar diseno

PAGINA NUEVA a crear:
  /app/nosotros/page.tsx    — Mover la seccion del equipo aqui

ELIMINAR del home:
  La seccion del equipo (QuienesSection o similar)

ORDEN DE SECCIONES EN page.tsx (nuevo):
  1. Navbar
  2. HeroSection
  3. ForgeStandards (bento grid)
  4. ProjectsSection (carrusel)
  5. PricingSection
  6. RoadmapSection (timeline)
  7. AutonomySection
  8. ContactSection
  9. Footer


================================================================
BLOQUE 3 — GSAP: PATRON DE USO OBLIGATORIO
================================================================

REGLA CRITICA: Todo uso de GSAP debe seguir este patron en Next.js
para evitar errores de hidratacion y garantizar cleanup correcto.

PATRON ESTANDAR (aplicar en TODOS los componentes animados):

  'use client'
  import { useRef, useLayoutEffect } from 'react'
  import { gsap } from '@/lib/gsap'
  import { ScrollTrigger } from '@/lib/gsap'

  export function ComponenteAnimado() {
    const containerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        // Todas las animaciones van aqui dentro
        gsap.from('.elemento', {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.elemento',
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        })
      }, containerRef) // scope al contenedor

      return () => ctx.revert() // cleanup obligatorio
    }, [])

    return <div ref={containerRef}>...</div>
  }

ANIMACIONES PERMITIDAS (balance performance / impacto):
  - Reveal al scroll: opacity 0->1 + y 40->0 (secciones, cards)
  - Stagger en listas: delay escalonado entre items
  - Contador animado: numeros que suben al entrar en viewport
  - Timeline del roadmap: linea que se dibuja al scrollear
  - Hover states: solo CSS transitions, no GSAP (mas rapido)

ANIMACIONES PROHIBIDAS (danan performance o accesibilidad):
  - Particulas o canvas animado
  - Parallax con requestAnimationFrame constante
  - SplitText (requiere Club GSAP)
  - Animaciones en loop infinito visibles
  - Cualquier animacion que no respete prefers-reduced-motion

GSAP Y PREFERS-REDUCED-MOTION:
  En lib/gsap.ts agregar:
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0)
    }


================================================================
BLOQUE 4 — SECCION 1: HERO SECTION (REDISENO COMPLETO)
================================================================

Archivo: components/sections/HeroSection.tsx
Directiva: 'use client'
Fondo: bg-forge-bg-dark

CONCEPTO NUEVO:
El hero actual es texto centrado generico. El nuevo hero tiene
layout dividido: izquierda texto + derecha elemento visual fuerte.
En mobile, apilado vertical (texto arriba, visual abajo).

LAYOUT DESKTOP (2 columnas 60/40):
  Columna izquierda (60%):
    - Badge: "Agencia de software · Colombia"
    - H1: "Forjamos el motor digital de tu empresa"
      (NO usar "ElevaForge" como h1 — el logo ya lo dice)
    - Subtitulo: una linea directa, sin tecnicismos
    - 2 CTAs: primario WhatsApp + secundario "Ver proyectos" (scroll anchor)
    - Fila de microdatos: "4 ingenieros · 2 proyectos entregados · 100/100"

  Columna derecha (40%):
    - Tarjeta flotante con los 3 scores de Lighthouse
      (Performance 100, SEO 100, Best Practices 100)
      Fondo: forge-card-bg, border: forge-border
      Cada score: numero grande en forge-orange-main + label gris
    - Efecto: leve sombra shadow-forge-hover

MOBILE (apilado):
  - Badge
  - H1 mas pequeño (clamp)
  - Subtitulo
  - CTA WhatsApp full-width
  - Microdatos en fila compacta
  - Tarjeta de scores debajo, tamaño reducido

FONDO DEL HERO:
  - bg-forge-bg-dark como base
  - Gradiente radial muy sutil en esquina superior derecha:
    background: radial-gradient(ellipse 60% 50% at 85% 20%,
      rgba(49,133,197,0.08) 0%, transparent 70%)
  - NO particulas, NO grid pattern visible

ANIMACION GSAP DEL HERO:
  Al cargar la pagina (no al scroll):
  tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.6 } })
  tl.from(badge,    { opacity: 0, y: -16 })
    .from(h1,       { opacity: 0, y: 24 },  '-=0.3')
    .from(subtitle, { opacity: 0, y: 16 },  '-=0.4')
    .from(ctas,     { opacity: 0, y: 12 },  '-=0.4')
    .from(card,     { opacity: 0, x: 20 },  '-=0.5')

JSX ESTRUCTURA:

  section id="inicio"
    className="relative min-h-screen flex items-center pt-20
               bg-forge-bg-dark overflow-hidden"

    // Fondo gradiente sutil
    div aria-hidden="true"
      className="absolute top-0 right-0 w-[60%] h-[70%]
                 pointer-events-none"
      style: background radial-gradient sutil azul

    div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full
                   grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12
                   items-center py-16 md:py-24"

      // Columna izquierda
      div
        span (badge)
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5
            rounded-full text-xs font-semibold tracking-widest uppercase
            bg-forge-blue-mid/15 text-forge-blue-light
            border border-forge-blue-mid/25"
          Agencia de software · Colombia

        h1
          className="font-humanst leading-none text-white mb-6"
          style: fontSize clamp(2.8rem, 7vw, 5.5rem)
          Forjamos el motor digital
          span className="block text-forge-orange-main"  de tu empresa

        p className="text-forge-text-body text-lg md:text-xl
                     leading-relaxed max-w-xl mb-10"
          Tecnologia simple, resultados medibles. Entregas claras,
          costos transparentes y soporte real para cada proyecto.

        // CTAs
        div className="flex flex-col sm:flex-row gap-4 mb-12"
          CTAButton href=whatsapp primary  "Iniciar proyecto"
          a href="#proyectos" (scroll)
            className="... outline variant ..."
            "Ver proyectos"

        // Microdatos de confianza
        div className="flex flex-wrap gap-x-8 gap-y-2
                       text-sm text-forge-text-muted"
          span  "4 ingenieros graduados"
          span className="text-forge-blue-mid/50"  ·
          span  "2 proyectos entregados"
          span className="text-forge-blue-mid/50"  ·
          span  "Lighthouse 100/100"

      // Columna derecha: tarjeta de scores
      div className="flex justify-center lg:justify-end"
        div
          className="bg-forge-card-bg rounded-2xl p-8
                     border border-forge-blue-mid/20
                     shadow-forge-hover w-full max-w-sm"

          p className="text-xs font-semibold tracking-widest uppercase
                       text-forge-text-muted mb-6"
            Validado con Google Lighthouse

          div className="grid grid-cols-3 gap-4"
            // Por cada score (Performance, SEO, Best Practices)
            div className="text-center"
              p className="font-humanst text-forge-orange-main"
                style: fontSize clamp(2.5rem, 6vw, 3.5rem)
                100
              p className="text-xs text-forge-text-muted mt-1"
                Performance

          // Indicador visual de verificacion
          div className="mt-6 pt-6 border-t border-forge-blue-mid/15
                         flex items-center gap-3"
            div className="w-2 h-2 rounded-full bg-green-400
                           animate-pulse"
            p className="text-xs text-forge-text-muted"
              Verificado en produccion · AVC Inmobiliaria


================================================================
BLOQUE 5 — SECCION 2: FORGE STANDARDS (BENTO GRID)
================================================================

Archivo: components/sections/ForgeStandards.tsx
Fondo: bg-forge-bg-dark (mismo que hero, separar con espaciado)
Directiva: 'use client' (para GSAP)
Nuevo componente: components/ui/BentoCard.tsx

CONCEPTO:
Bento grid asimetrico de 3 columnas. Las cards tienen distintos
tamanios para crear jerarquia visual. Los numeros 100 / A+ / 100
se muestran en grande como elemento de diseno — no como lista.

LAYOUT DEL BENTO (desktop, 3 columnas):

  [   Performance 100   ] [  SEO  ] [ Seguridad A+ ]
  [   (grande, 2 cols)  ] [  100  ] [   (1 col)    ]

En mobile: todo apilado vertical, misma altura.

GRID CSS:
  grid-cols-1 md:grid-cols-3
  Card Performance: md:col-span-2 (ocupa 2 de 3 columnas)
  Card SEO:         md:col-span-1
  Card Seguridad:   md:col-span-1 (nueva fila, 1 col)
  Card CTA extra:   md:col-span-2 (nueva fila, 2 cols)
    Esta card extra dice: "Cada proyecto pasa por los 3 antes
    de ser entregado. Sin excepciones." + boton "Ver proceso"

ESTRUCTURA DE CADA BENTO CARD:

BentoCard grande (Performance):
  div className="bg-forge-card-bg rounded-2xl p-8 md:p-10
                 border border-forge-blue-mid/20
                 flex flex-col justify-between min-h-[240px]"

    div className="flex items-start justify-between mb-6"
      span (badge label)  "Performance"
      span (icono SVG de rayo inline aria-hidden)

    div
      p className="font-humanst text-forge-orange-main leading-none mb-2"
        style: fontSize clamp(5rem, 10vw, 8rem)
        100
      p className="text-forge-text-muted text-sm"
        Lighthouse · Google PageSpeed

    p className="text-forge-text-body text-sm leading-relaxed mt-auto pt-4
                 border-t border-forge-blue-mid/15"
      Validamos con herramientas de Google antes de cada entrega.
      Tu sitio carga rapido desde el primer dia.

BentoCard mediana (SEO):
  Misma estructura pero numero 100 en font-humanst
  color: forge-blue-light
  Descripcion: "Estructuras pensadas para que Google te encuentre
  antes que a la competencia."

BentoCard mediana (Seguridad):
  Numero/badge: "A+"  color: forge-orange-gold
  Descripcion: "Seguridad desde la arquitectura, no como parche."

BentoCard CTA (texto largo):
  bg-forge-blue-deep/30 border border-forge-blue-mid/30
  Texto grande en font-humanst color white
  Boton secundario "Ver nuestro proceso" (scroll a roadmap)

ANIMACION GSAP:
  Al entrar en viewport, stagger de cards:
  gsap.from('.bento-card', {
    opacity: 0,
    y: 32,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.bento-grid',
      start: 'top 80%',
    }
  })


================================================================
BLOQUE 6 — SECCION 3: PROYECTOS (CARRUSEL CON HOVER REVEAL)
================================================================

Archivo: components/sections/ProjectsSection.tsx
Componente: components/ui/ProjectCard.tsx
Directiva: 'use client'
Fondo: bg-forge-bg-light (seccion alterna clara)

CONCEPTO:
Carrusel horizontal de proyectos. En desktop: 2 cards visibles.
En mobile: 1 card full-width con scroll horizontal nativo.
Hover reveal: al pasar el mouse sobre la card, aparece una capa
con el CTA "Ver proyecto" y los scores de Lighthouse del cliente.

DATOS DE PROYECTOS (hardcodeados por ahora):
  Proyecto 1:
    nombre: "AVC Inmobiliaria y Constructora"
    estado: "Entregado"
    sector: "Finca raiz"
    descripcion: "Sitio institucional para el sector inmobiliario
      en Colombia, disenado para posicionamiento organico y
      tiempos de carga minimos."
    url: "https://www.avcinmobiliariayconstructora.com/"
    scores: { performance: 100, seo: 100, practices: 100, accessibility: 86 }
    color_acento: "#F97300"

  Proyecto 2 (placeholder para proximo):
    nombre: "Made In Heaven"
    estado: "En curso"
    sector: "Moda"
    descripcion: "Catalogo virtual para marca de moda colombiana."
    url: null
    scores: null
    color_acento: "#49ACED"

ESTRUCTURA DE ProjectCard:

  article
    className="group relative rounded-2xl overflow-hidden
               bg-forge-card-bg border border-forge-blue-mid/20
               cursor-pointer flex-shrink-0
               w-full md:w-[480px] min-h-[320px]
               transition-all duration-300
               hover:border-forge-orange-main/40
               hover:shadow-forge-hover"

    // Contenido base (siempre visible)
    div className="p-8 h-full flex flex-col justify-between"

      div
        div className="flex items-center justify-between mb-4"
          span (badge sector)  "Finca raiz"
          span (badge estado con color segun estado)
            className="... bg-green-500/10 text-green-400 ..."
            "Entregado"

        h3 className="font-humanst text-xl text-white mb-3"
          "AVC Inmobiliaria y Constructora"

        p className="text-forge-text-muted text-sm leading-relaxed"
          (descripcion)

      // Scores en fila (solo si tiene scores)
      div className="flex gap-6 pt-6 border-t border-forge-blue-mid/15"
        div className="text-center"
          p className="font-humanst text-forge-orange-main text-2xl"  100
          p className="text-xs text-forge-text-muted"  Perf.
        // repetir para SEO, Practices

    // Capa de hover reveal (opacity 0 -> 1 con group-hover)
    div className="absolute inset-0 bg-forge-bg-dark/90
                   backdrop-blur-sm rounded-2xl
                   flex flex-col items-center justify-center gap-4
                   opacity-0 group-hover:opacity-100
                   transition-opacity duration-300"

      p className="font-humanst text-white text-xl"
        "Ver proyecto"

      // Si tiene URL
      a href={url} target="_blank" rel="noopener noreferrer"
        className="... CTAButton variant primary ..."
        "Visitar sitio"

CARRUSEL (sin libreria externa, scroll nativo):
  div className="flex gap-6 overflow-x-auto snap-x snap-mandatory
                 pb-4 -mx-4 px-4 md:mx-0 md:px-0
                 scrollbar-hide"
    // scrollbar-hide via plugin de Tailwind o CSS manual:
    // .scrollbar-hide { scrollbar-width: none; }
    // .scrollbar-hide::-webkit-scrollbar { display: none; }

  Cada card: snap-center flex-shrink-0


================================================================
BLOQUE 7 — SECCION 4: PRECIOS
================================================================

Archivo: components/sections/PricingSection.tsx
Fondo: bg-forge-bg-light
Directiva: Server Component (sin 'use client')

CONCEPTO:
3 cards de precio con mejor jerarquia visual. Ninguna es "destacada"
con relleno — diferenciacion por tamano y border sutil.
Cada card tiene CTA individual a WhatsApp con mensaje preescrito
especifico para ese paquete.

ESTRUCTURA DE CADA PRICING CARD:

  div className="bg-white rounded-2xl p-8
                 border border-forge-blue-mid/20
                 shadow-forge-card
                 flex flex-col justify-between
                 hover:border-forge-orange-main/30
                 hover:shadow-forge-hover
                 transition-all duration-300"

    div
      // Header
      div className="flex items-start justify-between mb-6"
        div
          p className="text-xs font-semibold tracking-widest uppercase
                       text-forge-blue-mid mb-2"
            (nombre del paquete)
          p className="font-humanst text-forge-bg-dark"
            style: fontSize 2rem
            $125
          p className="text-sm text-forge-text-muted mt-1"
            (≈ 475,000 COP)
        span (badge sector aplicable)

      // Separador
      div className="h-px bg-forge-blue-mid/15 mb-6"

      // Lista de incluidos (con check icon SVG)
      ul className="space-y-3"
        li className="flex items-start gap-3 text-sm text-forge-bg-dark"
          (icono check SVG en forge-orange-main)
          (item del paquete)

    // CTA al final de la card
    a href=whatsapp-preescrito-especifico
      target="_blank" rel="noopener noreferrer"
      className="mt-8 w-full text-center ... CTAButton variant outline ..."
      "Solicitar propuesta"

GRID: grid-cols-1 md:grid-cols-3 gap-6

NOTA LEGAL debajo de las cards:
  p className="text-center text-sm text-forge-bg-dark/50 mt-8"
    "Los precios son orientativos en USD. El costo final se
    define segun el alcance acordado con el cliente."


================================================================
BLOQUE 8 — SECCION 5: ROADMAP (TIMELINE ANIMADO)
================================================================

Archivo: components/sections/RoadmapSection.tsx
Fondo: bg-forge-bg-dark
Directiva: 'use client' (para GSAP)

CONCEPTO:
Timeline vertical con 4 pasos. La linea vertical se "dibuja"
al hacer scroll usando GSAP + ScrollTrigger con scrubb.
Cada paso hace reveal con stagger al entrar en viewport.

ANIMACION GSAP DE LA LINEA:
  // La linea vertical es un div con height en 0 que crece
  gsap.to('.timeline-line', {
    scaleY: 1,
    transformOrigin: 'top center',
    ease: 'none',
    scrollTrigger: {
      trigger: '.timeline-container',
      start: 'top 70%',
      end: 'bottom 50%',
      scrub: 0.5,
    }
  })

  // Los pasos hacen reveal con stagger
  gsap.from('.timeline-step', {
    opacity: 0,
    x: -24,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.timeline-container',
      start: 'top 75%',
    }
  })

ESTRUCTURA HTML:

  div ref={containerRef} className="timeline-container relative"

    // Linea vertical (transformada con GSAP)
    div className="timeline-line absolute left-6 top-0 bottom-0
                   w-0.5 bg-forge-blue-mid/30 scale-y-0
                   origin-top"

    ol className="relative space-y-0"

      li (por cada paso) className="timeline-step relative
                                     flex gap-8 pb-16 last:pb-0"

        // Punto en la linea
        div className="relative z-10 flex-shrink-0
                       w-12 h-12 rounded-full
                       bg-forge-bg-dark border-2 border-forge-orange-main
                       flex items-center justify-center"
          span className="font-humanst text-forge-orange-main text-sm"
            01

        div className="pt-2 pb-2"
          span (badge numero en naranja, repetido para enfasis)
          h3 className="font-humanst text-xl text-white mb-3"
            (titulo del paso)
          p className="text-forge-text-body leading-relaxed"
            (descripcion del paso)

DATOS (4 pasos del proceso actual, mantener el copy):
  01. Exploracion
  02. Planificacion
  03. Presupuesto claro
  04. Construir y entregar

CTA FINAL dentro de la seccion:
  Fondo: bg-forge-blue-deep/20 rounded-2xl p-8 mt-12
  Texto: "Listo para el paso 01?"
  Boton: CTAButton WhatsApp primario


================================================================
BLOQUE 9 — SECCION 6: AUTONOMIA Y FORMACION
================================================================

Archivo: components/sections/AutonomySection.tsx
Fondo: bg-forge-bg-light
Directiva: Server Component

CONCEPTO:
4 items en grid 2x2 en desktop, 1 columna en mobile.
Cada item con icono SVG inline, badge de color, titulo y descripcion.
Layout limpio y espacioso para legibilidad maxima.

ITEMS (mantener el copy actual, mejorar el layout):
  1. "100% tuya" — Propiedad del codigo
  2. "Manual PDF + Video" — Capacitacion
  3. "Soporte directo" — WhatsApp
  4. "Sin dependencia" — Autonomia operativa

ESTRUCTURA DE CADA ITEM:

  div className="flex flex-col gap-4 p-8 bg-white rounded-2xl
                 border border-forge-blue-mid/15
                 shadow-forge-card"

    div className="flex items-center gap-4"
      // Icono SVG en circulo
      div className="w-12 h-12 rounded-xl bg-forge-orange-main/10
                     flex items-center justify-center flex-shrink-0"
        (SVG icon en forge-orange-main, aria-hidden)

      span (badge) className="... text-forge-orange-main ..."
        (badge label)

    h3 className="font-humanst text-xl text-forge-bg-dark"
    p className="text-forge-bg-dark/65 leading-relaxed text-sm"

ICONOS SVG RECOMENDADOS (Heroicons, inline):
  1. Propiedad: icono de llave (key)
  2. Capacitacion: icono de libro (book-open)
  3. WhatsApp: icono de chat (chat-bubble-left-right)
  4. Autonomia: icono de escudo (shield-check)


================================================================
BLOQUE 10 — SECCION 7: FORMULARIO DE CONTACTO
================================================================

Archivo: components/sections/ContactSection.tsx
Fondo: bg-forge-bg-dark
Directiva: 'use client' (para manejo de estado del form)

CONCEPTO:
Mantener el formulario completo pero con diseno mejorado.
Layout: descripcion a la izquierda + formulario a la derecha (desktop).
En mobile: apilado vertical.

CAMPOS A MANTENER:
  - Nombre * (required)
  - Email * (required)
  - Telefono / WhatsApp
  - Preferencia de contacto (radio: Email / WhatsApp)
  - Empresa
  - Cuéntanos tu idea (textarea, max 500)
  - Presupuesto estimado (select)
  - Servicio de interés (select)
  - Checkbox privacidad *

ESTILOS DE INPUTS:

  input / textarea / select
    className="w-full bg-forge-surface border border-forge-blue-mid/25
               rounded-lg px-4 py-3 text-white text-base
               placeholder:text-white/30
               focus:outline-none focus:ring-2
               focus:ring-forge-orange-main/50
               focus:border-forge-orange-main/50
               transition-all duration-200"

  label
    className="block text-sm font-semibold text-white/70 mb-2"

BOTÓN SUBMIT:
  CTAButton tipo submit, variant primary, full-width
  Con estado loading: spinner SVG mientras se envia
  Con estado success: mensaje verde inline
  Con estado error: mensaje rojo inline

ESTADO POST-ENVIO (NO redirigir, mostrar inline):
  Success:
    div className="rounded-xl bg-green-500/10 border border-green-500/30
                   p-6 text-center"
      "Mensaje enviado. Te contactamos en menos de 24 horas."
  Error:
    div className="rounded-xl bg-red-500/10 border border-red-500/30
                   p-6 text-center"
      "Hubo un error. Escríbenos directamente a elevaforge@gmail.com"

COLUMNA IZQUIERDA (info de contacto):
  h2 (font-humanst, text-white): "Hablemos de tu proyecto"
  p (text-forge-text-body): descripcion de 2 lineas max
  div (datos de contacto):
    - WhatsApp: enlace directo
    - Email: enlace mailto
    - Tiempo de respuesta: "Menos de 24 horas"


================================================================
BLOQUE 11 — NAVBAR REDISEÑADO
================================================================

Archivo: components/layout/Navbar.tsx
Directiva: 'use client'

CONCEPTO:
Mas compacto y limpio que el actual. Sticky con blur al hacer scroll.
En mobile: menu hamburger que abre un drawer de pantalla completa.

DESKTOP (altura 64px):
  Logo (SVG/texto) + nav links + CTA WhatsApp

  header
    className="fixed top-0 left-0 right-0 z-50 h-16
               transition-all duration-300"

  Clases dinamicas con useState(isScrolled):
    isScrolled: true  → "bg-forge-bg-dark/95 backdrop-blur-md
                          border-b border-forge-blue-mid/15
                          shadow-forge-card"
    isScrolled: false → "bg-transparent"

  nav links:
    className="text-sm font-medium text-white/65
               hover:text-white transition-colors duration-200"
    Links: Paquetes · Proyectos · Garantia · Proceso · Diferencial
    Agregar link: "Quienes somos" → href="/nosotros"

  CTA navbar:
    Mismo CTAButton pero mas pequeno: px-5 py-2.5 text-sm

MOBILE (drawer full-screen):
  Boton hamburger (3 lineas → X al abrir)
  Drawer: posicion fixed, inset-0, z-[100]
    bg-forge-bg-dark, flex flex-col, justify-center, items-center
    Links en vertical, font-humanst, text-2xl, gap-8
    CTA al final, full-width

ANIMACION DEL DRAWER (GSAP opcional, o CSS puro):
  Si GSAP: gsap.from(drawer, { xPercent: 100, duration: 0.4, ease: 'power3.out' })
  Si CSS: transform translateX(100%) → translateX(0) con transition


================================================================
BLOQUE 12 — PAGINA /nosotros
================================================================

Archivo: app/nosotros/page.tsx
Componentes: mover aqui la seccion del equipo actual

SECCION DEL EQUIPO (mejorada):
  4 cards de equipo en grid 2x2 desktop, 1 col mobile.
  Mantener avatares de iniciales pero redisenarlos:

  AVATAR REDISEÑADO:
    div className="w-16 h-16 rounded-2xl
                   bg-gradient-to-br from-forge-blue-primary
                   to-forge-blue-deep
                   flex items-center justify-center
                   text-white font-humanst text-xl"
      LU

  CARD DE EQUIPO:
    div className="bg-forge-card-bg rounded-2xl p-6
                   border border-forge-blue-mid/20"
      div className="flex items-center gap-4 mb-4"
        (avatar)
        div
          h3 className="font-humanst text-white text-lg"  Luis
          p className="text-xs text-forge-text-muted uppercase
                       tracking-widest"  Arquitectura y Seguridad

      p className="text-sm text-forge-text-body leading-relaxed"
        (descripcion del rol)

      div className="mt-4 pt-4 border-t border-forge-blue-mid/15"
        span className="text-xs text-forge-blue-light"
          Ingenieria de software

METADATA de la pagina /nosotros:
  title: "Quiénes somos · ElevaForge"
  description: "Equipo de 4 ingenieros de software colombianos..."


================================================================
BLOQUE 13 — COMPONENTE AnimatedNumber
================================================================

Archivo: components/ui/AnimatedNumber.tsx
Directiva: 'use client'

  'use client'
  import { useRef, useLayoutEffect, useState } from 'react'
  import { gsap } from '@/lib/gsap'
  import { ScrollTrigger } from '@/lib/gsap'

  interface AnimatedNumberProps {
    target: number
    suffix?: string
    duration?: number
    className?: string
  }

  export function AnimatedNumber({
    target,
    suffix = '',
    duration = 1.5,
    className = '',
  }: AnimatedNumberProps) {
    const ref = useRef<HTMLSpanElement>(null)

    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (ref.current) {
              ref.current.textContent = Math.round(obj.val) + suffix
            }
          },
        })
      }, ref)

      return () => ctx.revert()
    }, [target, duration, suffix])

    return (
      <span ref={ref} className={className} aria-label={`${target}${suffix}`}>
        0{suffix}
      </span>
    )
  }

Usar en HeroSection y ForgeStandards para los numeros 100, A+, etc.
Para "A+" usar suffix="" y target como string especial (manejar aparte).


================================================================
BLOQUE 14 — FOOTER ACTUALIZADO
================================================================

Archivo: components/layout/Footer.tsx
Directiva: Server Component

LAYOUT:
  Fila superior: logo + tagline | links rapidos | contacto
  Separador
  Fila inferior: copyright | links legales

  footer className="bg-forge-bg-dark border-t border-forge-blue-mid/15"

  div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12
                 py-16 grid grid-cols-1 md:grid-cols-3 gap-12"

    // Col 1: Logo + tagline
    div
      (Logo imagen SVG)
      p className="text-forge-text-muted text-sm mt-3 leading-relaxed max-w-xs"
        "Forjamos el motor digital de tu empresa con transparencia
        total y acompanamiento real."

    // Col 2: Navegacion
    nav aria-label="Links del footer"
      p className="text-xs font-semibold tracking-widest uppercase
                   text-white/40 mb-4"  Navegacion
      ul className="space-y-3"
        (links internos, estilo: text-sm text-forge-text-muted
         hover:text-white transition-colors)

    // Col 3: Contacto
    div
      p className="text-xs font-semibold tracking-widest uppercase
                   text-white/40 mb-4"  Contacto
      a href=whatsapp className="flex items-center gap-2 text-sm
                                 text-forge-text-muted hover:text-white
                                 transition-colors mb-3"
        (SVG whatsapp) WhatsApp directo
      a href=mailto className="... text-sm ..."
        (SVG email) elevaforge@gmail.com

  // Barra inferior
  div className="border-t border-forge-blue-mid/15 mt-8 pt-8
                 flex flex-col md:flex-row items-center
                 justify-between gap-4 text-xs text-white/30"
    p  "© 2026 ElevaForge. Todos los derechos reservados."
    div className="flex gap-6"
      Link href="/privacidad"  Privacidad
      Link href="/terminos"    Terminos


================================================================
BLOQUE 15 — CTAButton ACTUALIZADO
================================================================

Archivo: components/ui/CTAButton.tsx
Directiva: Server Component (sin 'use client')

NUEVAS VARIANTES:

  primary:
    "bg-forge-orange-main hover:bg-forge-orange-gold text-white
     font-semibold shadow-forge-cta hover:shadow-forge-hover
     hover:scale-[1.02] active:scale-[0.98]"

  outline (para secciones oscuras):
    "border border-forge-orange-main/60 text-forge-orange-main
     hover:bg-forge-orange-main hover:text-white
     hover:border-forge-orange-main"

  outline-light (para secciones claras):
    "border border-forge-blue-mid text-forge-blue-deep
     hover:bg-forge-blue-deep hover:text-white"

  ghost:
    "text-forge-blue-light hover:text-white
     hover:bg-forge-blue-mid/15"

BASE COMUN:
  "inline-flex items-center gap-2.5 font-semibold
   px-6 py-3 rounded-xl transition-all duration-200
   focus-visible:outline-none focus-visible:ring-2
   focus-visible:ring-forge-orange-main
   focus-visible:ring-offset-2
   focus-visible:ring-offset-forge-bg-dark
   text-base leading-none cursor-pointer"

TAMANIOS:
  size="sm": px-4 py-2.5 text-sm
  size="md": px-6 py-3 text-base (default)
  size="lg": px-8 py-4 text-lg
  size="full": w-full justify-center + tamanio md


================================================================
BLOQUE 16 — ACCESIBILIDAD (WCAG AA OBLIGATORIO)
================================================================

REGLAS CRITICAS para publico de todas las edades:

  1. Texto minimo 16px en TODOS los dispositivos (nunca menos)
  2. Contraste de texto:
     - Texto blanco sobre #19192E: ratio 14.7:1 (pasa AAA)
     - Texto #19192E sobre #E9EAF5: ratio 14.7:1 (pasa AAA)
     - Texto #F97300 sobre #19192E: verificar con herramienta
       (puede necesitar texto mas claro en fondos oscuros)
     - NUNCA texto forge-text-muted (55% opacity) sobre fondo claro
  3. Focus visible en TODOS los elementos interactivos
     (no remover outline, usar focus-visible de Tailwind)
  4. Todos los inputs tienen <label> asociado con htmlFor
  5. Todos los SVG decorativos: aria-hidden="true"
  6. Todos los SVG informativos: role="img" + title
  7. Estructura de headings: solo 1 h1 por pagina
  8. Links externos: rel="noopener noreferrer"
  9. Formulario: todos los required tienen aria-required="true"
  10. Errores de formulario: aria-describedby al input con error
  11. Botones sin texto visible: aria-label obligatorio
  12. Respetar prefers-reduced-motion (ya configurado en globals.css)

CHECKLIST SEMANTICA:
  header > nav   (navbar)
  main           (contenido principal, id="main-content")
  section        (cada seccion con id y aria-label)
  article        (cada project card)
  footer > nav   (links del footer)
  ol/li          (roadmap — lista ordenada semantica)


================================================================
BLOQUE 17 — PERFORMANCE Y LIGHTHOUSE
================================================================

REGLAS PARA MANTENER 100/100:

  Next.js Image:
    - Usar next/image en TODAS las imagenes
    - Siempre especificar width, height, alt
    - Logo en navbar: priority={true} (above the fold)
    - Imagenes de proyectos: loading="lazy" (below the fold)
    - Formatos: avif y webp configurados en next.config.ts

  Fuentes:
    - Humanst: localFont con preload: true, display: 'swap'
    - Inter: next/font/google con display: 'swap'
    - NO cargar fuentes desde CDN externo

  GSAP:
    - Importar solo los modulos necesarios (tree-shaking)
    - Registrar plugins una sola vez en lib/gsap.ts
    - Siempre cleanup con ctx.revert() en return del useLayoutEffect
    - Usar 'use client' solo en componentes que realmente lo necesitan

  Server Components por defecto:
    Componentes sin estado ni eventos → Server Component
    Solo agregar 'use client' cuando sea necesario:
      - HeroSection (animacion inicial)
      - Navbar (scroll + menu mobile)
      - RoadmapSection (ScrollTrigger)
      - ForgeStandards (ScrollTrigger)
      - ProjectsSection (hover reveal)
      - ContactSection (estado del formulario)

  Bundle size:
    - No instalar librerias de iconos (usar SVG inline)
    - No instalar librerias de carrusel (scroll nativo)
    - No instalar librerias de animacion adicionales a GSAP

  next.config.ts debe tener:
    compress: true
    poweredByHeader: false
    images.formats: ['image/avif', 'image/webp']


================================================================
BLOQUE 18 — INSTALACION DE DEPENDENCIAS
================================================================

NUEVA DEPENDENCIA A INSTALAR:
  npm install gsap @gsap/react

DEPENDENCIAS ACTUALES (mantener, no actualizar):
  next, react, typescript, tailwindcss, supabase, zod

DEPENDENCIAS A ELIMINAR (si existen):
  Cualquier libreria SCSS/Sass si se instalo como dependencia
  node-sass, sass — reemplazadas por Tailwind puro

VERIFICAR QUE NO EXISTAN:
  framer-motion (no instalado, bien)
  swiper (no instalar — usar scroll nativo)
  lucide-react o heroicons como paquete (usar SVG inline)


================================================================
BLOQUE 19 — ORDEN DE IMPLEMENTACION RECOMENDADO
================================================================

Implementar en este orden para evitar regresiones:

  FASE 1 — BASE (sin romper nada actual):
    [ ] Instalar GSAP: npm install gsap @gsap/react
    [ ] Crear lib/gsap.ts con registro de plugins
    [ ] Eliminar archivos SCSS, mover estilos a Tailwind
    [ ] Agregar nuevos tokens en tailwind.config.ts
    [ ] Actualizar globals.css (scroll-behavior, reduced-motion)
    [ ] Actualizar CTAButton con nuevas variantes

  FASE 2 — SECCIONES CLAVE:
    [ ] Redisenar HeroSection (nueva layout 2 columnas)
    [ ] Crear ForgeStandards con bento grid
    [ ] Crear ProjectsSection con carrusel
    [ ] Redisenar PricingSection (nuevas cards)

  FASE 3 — ANIMACIONES:
    [ ] Agregar AnimatedNumber component
    [ ] Agregar reveals de scroll en ForgeStandards
    [ ] Agregar timeline animado en RoadmapSection
    [ ] Agregar animacion inicial del Hero

  FASE 4 — LAYOUT Y PAGINAS:
    [ ] Redisenar Navbar (scroll behavior + mobile drawer)
    [ ] Actualizar Footer
    [ ] Crear /nosotros con la seccion del equipo
    [ ] Mejorar ContactSection UI

  FASE 5 — VERIFICACION:
    [ ] Correr Lighthouse en modo incognito
    [ ] Verificar en mobile real (375px)
    [ ] Verificar en desktop (1440px)
    [ ] Verificar accesibilidad con teclado (tab navigation)
    [ ] Verificar contraste con herramienta (WebAIM Contrast Checker)
    [ ] Verificar que todos los links de WhatsApp funcionan
    [ ] Verificar formulario envia a Supabase correctamente


================================================================
BLOQUE 20 — LINK DE WHATSAPP (FORMATO CORRECTO)
================================================================

Numero actual (del sitio): 573150812166
URL base: https://wa.me/573150812166

Links preescritos por seccion:

  Hero (CTA principal):
    ?text=Hola%20ElevaForge%2C%20quiero%20iniciar%20mi%20proyecto%20digital

  Pricing — Sitio Web/Landing:
    ?text=Hola%20ElevaForge%2C%20estoy%20interesado%20en%20el%20paquete%20Sitio%20Web%20%2F%20Landing.%20%C2%BFPodemos%20conversar%3F

  Pricing — PoS + Inventario:
    ?text=Hola%20ElevaForge%2C%20estoy%20interesado%20en%20el%20paquete%20PoS%20%2B%20Gestor%20de%20Inventario.%20%C2%BFPodemos%20conversar%3F

  Pricing — Software Personalizado:
    ?text=Hola%20ElevaForge%2C%20estoy%20interesado%20en%20Software%20Personalizado.%20%C2%BFPodemos%20conversar%3F

  Roadmap / Proceso:
    ?text=Hola%20ElevaForge%2C%20quiero%20una%20asesoria%20gratuita%20sobre%20mi%20proyecto

Estos textos ya existen en el sitio actual — mantenerlos o
actualizarlos en lib/whatsapp.ts segun corresponda.


================================================================
FIN DEL PROMPT DEFINITIVO — ELEVAFORGE REDESIGN
Repo: https://github.com/Luisceron0/ElevaForge
Para usar en: .github/copilot-instructions.md
================================================================