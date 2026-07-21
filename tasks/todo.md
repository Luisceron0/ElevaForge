# todo.md — Plan de ejecución (derivado de SRS-ElevaForge-v0.2.md)

Estado: `[ ]` no iniciada · `[~]` en curso · `[x]` hecha (con verificación) · `[BLOCKED:Gx]` bloqueada por gate.

No dupliques el "por qué" acá — eso vive en el SRS. Esto es solo el checklist de "qué falta ahora".

## Fase 0 — Bootstrap de artefactos
- [x] Crear `CLAUDE.md`, `tasks/todo.md`, `tasks/lessons.md`. Verificación: archivos existentes, PR `chore/fase0-bootstrap-artefactos`.

## Fase 1 — Seguridad y base técnica
Precondición: ninguna, salvo F-02 que necesita el SQL (G1/Anexo B #1).
- [x] **F-01** IP confiable (`x-real-ip` vía `@vercel/functions#ipAddress`, fallback `x-vercel-forwarded-for`); rate-limit de login/contact migrado a Upstash Redis (shared store) con fallback in-memory + warning si no está configurado. *(RNF-SEC-01, TC-03/05)*. Verificación: `npm run typecheck` y `npm run build` en verde; smoke test manual en dev (`/api/contact`, `/api/admin/login`) confirma IP resuelta correctamente y 429 tras 5 intentos/min. **Pendiente operativo (no bloqueante):** configurar `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` en Vercel para que el store compartido esté activo en producción — sin esas env vars, cae al fallback in-memory (mismo comportamiento que antes) y loguea `RATE_LIMIT_NOT_SHARED` una vez.
- [~] **F-02** Propuesta redactada en `supabase/01-schema-and-rls.sql` (+ `supabase/00-introspect-current-state.sql` de solo lectura) — **pendiente de que el usuario la ejecute y confirme en su Supabase real**, no se puede marcar `[x]` sin esa confirmación. Base del diseño: ningún código usa la anon key sobre estas tablas (verificado — `lib/supabase/client.ts` no se importa en ningún lado), así que deny-by-default total (sin policies) es correcto y no requiere excepciones. *(RNF-SEC-02, TC-06)*
- [x] **F-03** `ADMIN_SESSION_SEED` obligatorio, fail-closed si falta; nunca la service key como semilla. *(RNF-SEC-03)*. Verificación: `getSessionSeed()` sin fallback (`lib/security/admin-session.ts`); `npm run typecheck`/`build` en verde. **Impacto operativo:** confirmar que `ADMIN_SESSION_SEED` ya existe en Vercel antes de mergear — si no, las sesiones admin fallan al desplegar.
- [x] **F-04** Check de arranque que alerte si coexisten admins en DB y env legacy; documentar remoción. *(RNF-SEC-04)*. Verificación: `instrumentation.ts` + `lib/security/admin-bootstrap-check.ts` (evento `LEGACY_ADMIN_CREDENTIAL_ACTIVE`), smoke test confirma que no rompe el arranque sin Supabase configurado; `npm run build` en verde.
- [~] **SEC-05** `X-XSS-Protection: 0` hecho (`next.config.ts`, verificado con curl). Headers ya están consolidados en una sola fuente por tipo (CSP dinámica en `proxy.ts`, resto estático en `next.config.ts`, sin duplicados). **Pendiente, fuera de scope de este cambio:** `style-src 'unsafe-inline'` no se puede reducir sin refactor — 10 archivos usan `style={{...}}` de React, que requiere `unsafe-inline` en `style-src` salvo que se migre a nonces/hash para estilos (parte de la decisión ADR-004, no confirmada). Migración CSP nonce→hash sigue `[BLOCKED:G4 — ADR-004 "Recomendada — confirmar", no ejecutar sin decisión]`.
- [x] **Base** `engines.node >= 20` fijado; Vitest (27 tests reales sobre `lib/security/*` y `lib/validations.ts`/`lib/admin-content-validation.ts`) + Playwright (5 smoke tests e2e); `npm test` corre Vitest; `npm run lint` reparado (ver hallazgo en lessons.md) y ahora corre de verdad; CI en `.github/workflows/ci.yml` con jobs lint+typecheck+test, build, e2e (Playwright), y secrets-scan (gitleaks). Verificación: los 4 comandos (`lint`, `typecheck`, `test`, `build`) y `npx playwright test` en verde localmente.
  - **Hallazgo mayor (corregido en este mismo cambio):** `public/robots.txt` y `public/sitemap.xml` (archivos estáticos) shadoweaban por completo a `app/robots.ts`/`app/sitemap.ts` — Next.js sirve `public/*` sin pasar por el router, así que las rutas dinámicas nunca se ejecutaban en producción. Esto explica F-06 (sitemap sin `/nosotros`) y significa que `robots.txt` tampoco bloqueaba `/admin/` pese a que RF-014/SEO-04 lo exigen. Se borraron los estáticos y se corrigieron ambas rutas dinámicas (agregado `/admin/` a disallow, agregado `/nosotros` al sitemap).

DoD Fase 1: TC-03, TC-04, TC-05, TC-08, TC-09 en verde; F-02 verificado (TC-06) o explícitamente `[BLOCKED]`; `npm run build` OK; sin secretos en el árbol.

## Fase 2 — Medición
Precondición: herramienta confirmada por el usuario (2026-07-21): **Vercel Analytics**.
- [x] **RF-017** `@vercel/analytics` instalado; `<Analytics />` en `app/layout.tsx` (page_view automático); eventos `click_whatsapp` (todos los CTAs de WhatsApp: Navbar, Footer, ContactSection, PricingSection — vía `lib/analytics.ts` + `components/ui/WhatsAppLink.tsx`), `form_start`/`form_submit_ok`/`form_error` en `ContactSection.tsx` (el form que realmente se renderiza en `/`). Ningún evento incluye PII (solo `form_type`/`source`/`reason`, nunca nombre/email/mensaje).
  - **CSP: no requirió ningún cambio.** Verificado empíricamente (no asumido): el script de Vercel Analytics se inyecta vía DOM API desde código ya hidratado (confía en `strict-dynamic`) y las llamadas van a rutas same-origin (`/_vercel/insights/*`, ya cubierto por `connect-src 'self'`). Test e2e nuevo confirma cero violaciones de CSP en consola.
  - **Falta para cerrar Fase 2 del todo:** capturar la línea base de CRO-01 (funnel actual) antes de tocar el rediseño visual — eso requiere que el sitio esté deployado con este cambio y pase unos días/semanas juntando datos reales; no es algo que se "complete" en una sesión de desarrollo.

DoD Fase 2: funnel visita→interacción→lead consultable (mecanismo listo, deployment y ventana de datos reales pendientes); línea base a capturar antes de tocar el diseño (Fase 5).

## Fase 3 — Quick wins de conversión y confianza
Precondición: Fase 2 desplegada.
- [x] **F-08 / RF-018** Cifras reales en SSR (métricas Lighthouse, contadores); animación como enhancement; `prefers-reduced-motion`; fix "1 proyectos entregados" (concordancia). `components/ui/AnimatedNumber.tsx` ahora renderiza `{target}{suffix}` en el JSX inicial (antes era literal `0{suffix}`) y solo anima el conteo si `prefers-reduced-motion` no está activo; `HeroSection.tsx` usa singular/plural correcto según `deliveredProjects === 1`. Verificación: `curl`/Playwright contra el HTML servido confirma valores reales (99/97/100/100, no "0") y concordancia gramatical; 9/9 e2e en verde.
- [x] **F-07** Eliminar enlaces de nav duplicados (`#autonomia` x2); regla de nav de §14. Se eliminó "Garantía" (duplicaba el destino de "Diferencial", que coincide con el eyebrow/contenido real de `AutonomySection.tsx`) de `Navbar.tsx` y `Footer.tsx` — quedan 5 ítems en el header (≤6, cumple §14). Verificación: `npx playwright test` con un chequeo nuevo que falla si dos `<a>` del nav apuntan al mismo `href`.
- [ ] **RF-021** Correo en dominio propio (`contacto@elevaforge.com`); quitar todo `@gmail.com`. SPF/DKIM/DMARC → `[BLOCKED:G1 — Anexo B #13, proveedor de correo]`.
- [x] **SEO-01** Geo confirmado como es-CO (usuario, 2026-07-21): `locale: 'es_CO'`, `areaServed: Colombia`, keyword "México"→"Colombia" en `app/layout.tsx`. Verificación: e2e nuevo confirma `es_CO` presente y `es_MX`/`México` ausentes.
- [ ] **RF-007 / SEO-02** Legales revisados (Ley 1581/2012 → `[BLOCKED:G1 — Anexo B #3, revisión legal]`); `sitemap` incluye `/nosotros` (hecho, ver tarea Base). Geo ya no bloquea (ver SEO-01 arriba).

DoD Fase 3: HTML servido contiene los valores reales (test de CI que assertee que no aparece "0" en la sección de métricas); cero `@gmail.com`; cero enlaces duplicados en nav.

## Fase 4 — IA multipágina + SEO estructural
Precondición: `[BLOCKED:G4 — Anexo B #11, naming de /proceso]` para esa página; geo confirmado (para hreflang).
- [ ] **§14** Migrar de single-page a rutas: `/soluciones`, `/soluciones/[familia]`, `/proyectos`, `/proyectos/[slug]`, `/proceso`, `/contacto`. Header ≤ 6 ítems, CTA persistente.
- [ ] **§11/§12** Rename `packages`→`soluciones` (schema + tipos + defaults + editor + `PricingSection` + migración de datos, sin dejar la clave vieja); eliminar precios del sitio público (ADR-003).
- [ ] **SEO-07/08** Una URL por intención; JSON-LD por tipo (`Service`, `BreadcrumbList`, `Organization` con email corporativo).
- [ ] **SEO-11** 301/anchor-map de `/#precios`→`/soluciones`, `/#proyectos`→`/proyectos`, etc. Sin 404 de enlaces externos.
- [ ] **RF-019** FAQ con `FAQPage` schema (incluye "¿cómo se define la inversión?").
- [ ] **RF-020** Formulario de diagnóstico en 2 pasos (paso 1 ≤ 4 campos ya crea el lead; backend sin cambios).
- [ ] **RF-012 / §12** Deprecar `POST /api/leads` (dejar solo redirect) tras confirmar compat externa → `[BLOCKED:G1 — Anexo B #8]`.

DoD Fase 4: cada familia y caso con URL, `<h1>` y metadata propios; `packages` no existe en DB ni en código; ningún precio en el sitio público; redirects verificados; TC-10 en verde.

## Fase 5 — Rediseño visual
Precondición: Fase 4 estable; línea base de Core Web Vitals capturada (Fase 2).
- [ ] **DIS-01** Sistema de tokens en Tailwind config; sin estilos ad-hoc divergentes.
- [ ] **§29** Adoptar patrones del modelo de referencia escalados; regla de escala honesta. CI&T es referencia de patrones; no se copia copy, identidad ni activos.
- [ ] **DIS-03/04** Animaciones como enhancement; el rediseño no degrada CWV vs. línea base (LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms móvil).

DoD Fase 5: CWV ≥ línea base; A11Y AA; comparación de conversión vs. línea base disponible.

## Fase 6 — Motor de contenido (condicional)
Precondición: `[BLOCKED:G4 — Anexo B #12, v1 vs v1.1 y capacidad editorial real]`.
- [ ] **RF-016** `/insights` mínimo (solo artículos): URL propia, metadata, JSON-LD `Article`, en sitemap; render con escaping por defecto. Sin podcast/webinars/whitepapers.

DoD Fase 6: si entra, cada artículo indexable y con datos estructurados; si no, marcado fuera de scope v1 en este archivo.

---

## Gates abiertos ahora mismo (Anexo B del SRS)

| # | Qué falta | Bloquea | Pregunta para desbloquear |
|---|---|---|---|
| 1 | SQL de migración + policies RLS de Supabase | F-02, TC-06, G2 (deploy) | ¿Podés aportar el SQL actual de las policies de `leads`/`admin_users`/`site_content`, o autorizás que se redacte una propuesta de policies deny-by-default para tu revisión antes de aplicarla? |
| 2 | Geo confirmado (es-CO vs MX vs LATAM) | SEO-01, hreflang, Fase 4 | ¿Confirmás es-CO como único mercado/geo para v1 (ADR-002), o hay otro mercado a cubrir? |
| 3 | Revisión legal Ley 1581/2012 | RF-007 | ¿Quién revisa legalmente Privacidad/Términos antes de publicarlos? |
| 4 | Scope de blog/documentación v1 | RF-016, Fase 6 | ¿Entra `/insights` en v1 (ADR-009) o se pospone a v1.1? |
| 5 | Herramienta y alcance de analítica | RF-017, NF-05, Fase 2 | ¿Vercel Analytics o Plausible (ADR-008)? |
| 6 | SLA/RTO/RPO objetivo y cobertura mínima de tests | §17 | ¿Hay un SLA formal a cumplir, o "mejor esfuerzo" es aceptable para v1? |
| 7 | Nombres de personas en copy y veracidad de métricas Lighthouse | RF-005/006 | ¿Los nombres actuales (Miguel, Luis, Jhonatan, Santiago) y los scores Lighthouse mostrados son los reales/autorizados para publicar? |
| 8 | Compatibilidad de deprecar `/api/leads` POST | §12, RF-012 | ¿Hay integraciones externas activas llamando a `/api/leads` que se romperían al quitar el POST? |
| 9 | Métrica objetivo de conversión | CRO-07 | ¿Cuál es el número objetivo (ej. ≥X solicitudes/mes o tasa visita→lead ≥Y%)? |
| 10 | Herramienta de analítica (duplicado de #5) | ADR-008 | (mismo que #5) |
| 11 | Naming del método propio para `/proceso` | §29, Fase 4 | ¿Cómo se llama el método/proceso propio de ElevaForge para la página `/proceso`? |
| 12 | Capacidad editorial real para `/insights` | ADR-009 (duplicado de #4) | ¿Quién escribe artículos y con qué frecuencia sostenible? |
| 13 | Proveedor de correo en dominio propio | RF-021 | ¿Qué proveedor de correo se usará para `contacto@elevaforge.com` (para configurar SPF/DKIM/DMARC)? |

Un `[PENDIENTE]` resuelto por suposición es peor que uno abierto. No se rellenan por inferencia.
