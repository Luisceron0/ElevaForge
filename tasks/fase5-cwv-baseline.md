# Fase 5 — línea base de Core Web Vitals (local, no producción)

**Metodología:** Lighthouse 13.4.1 (`npx lighthouse`), preset desktop, contra `next start` (build de producción) local, headless Chromium (Playwright). **No es la línea base real de producción** que pide CRO-01/Fase 2 — esa requiere tráfico real vía Vercel Analytics (ya instrumentado, RF-017) una vez deployado. Esto es un proxy para no avanzar el rediseño visual (DIS-04: "no degradar CWV vs. línea base") completamente a ciegas.

Reportes completos (JSON+HTML) en `lighthouse-reports/` — no versionados en git (ver `.gitignore`), quedan en el filesystem local de esta sesión.

## Resultado: antes vs. después del rediseño (DIS-01/03/04)

| Página | Performance antes→después | Accessibility antes→después |
|---|---|---|
| `/` | 100 → 99 (ruido de medición, LCP 0.7s→0.8s) | 96 → **100** |
| `/soluciones` | 100 → 100 | 96 → **100** |
| `/proyectos` | 100 → 100 | 96 → **100** |
| `/proceso` | 100 → 100 | 96 → **100** |
| `/contacto` | 100 → 100 | 96 → **100** |
| `/preguntas-frecuentes` | 100 → 100 | 96 → **100** |
| `/nosotros` | 100 → 100 | 96 → **100** |

Best Practices se mantiene en 96 en todas las páginas, antes y después — no es un defecto del sitio: es el script de Vercel Analytics devolviendo 404 porque `/_vercel/insights/script.js` solo existe corriendo en infraestructura real de Vercel, no en `next start` local. Se resuelve solo al deployar (ver `tasks/lessons.md`).

**CWV en `/` (home), antes → después:**
- LCP: 0.7s → 0.8s (objetivo DIS-04: ≤ 2.5s — muy por debajo en ambos casos)
- CLS: 0 → 0 (objetivo: ≤ 0.1)
- TBT (proxy de INP): 10ms → 20ms (objetivo INP: ≤ 200ms)

Ninguna métrica se acerca a los umbrales de DIS-04. La variación de 0.1s en LCP y 10ms en TBT está dentro del ruido normal de medición local (confirmado corriendo Lighthouse dos veces sobre el mismo build sin cambios intermedios).

## Qué cambió para llegar de Accessibility 96 a 100

Todo documentado con detalle en `tasks/lessons.md` y el commit de Fase 5. Resumen:
- Botón CTA primario (usado en todo el sitio): texto blanco sobre naranja `#F97300` medía 2.8:1 (falla el mínimo de 4.5:1 de WCAG AA). Cambiado a texto `forge-bg-dark` sobre el mismo naranja → 6.13:1 (8.79:1 en hover).
- Texto naranja sobre fondos claros (badges "en curso", tarjetas blancas): mismo problema en la otra dirección. Nuevo token `forge.orange-deep` (#B85700, 4.77:1 sobre blanco) para estos casos específicos — `orange-main` se mantiene intacto como color de fondo/marca.
- Varios textos "muted" con opacidades ad-hoc (`text-white/40`, `/30`, `text-forge-blue-mid/70`, opacidades apiladas sobre `text-forge-text-muted`) medían entre 2.7:1 y 3.8:1. Consolidados al token `text-forge-text-muted` existente (ya pasa 6.02:1) o a `text-forge-blue-light` en fondos oscuros (6.89:1).
- Skip-link de accesibilidad (`app/layout.tsx`, visible al navegar con teclado) tenía el mismo problema de texto blanco sobre naranja.

## Regresión futura

`e2e/smoke.spec.ts` corre axe-core (WCAG 2.2 AA) contra las 8 páginas públicas principales en cada ejecución de `npm run test:e2e` / CI — si este tipo de regresión de contraste vuelve a aparecer, el test falla antes de mergear.
