# lessons.md — Qué no repetir

Se amplía cada vez que un error se detecta y se corrige. No dupliques el "por qué" del SRS acá; esto es solo la lección práctica.

## Next 16 → `proxy.ts` es el middleware
Auditores/linters desactualizados lo marcan como "archivo fuera de convención / renombrar a middleware.ts". **Es un falso positivo.** Next.js 16 reemplazó `middleware.ts` por `proxy.ts` (mismo boundary de red: exporta `proxy` + `config.matcher`). No lo renombres ni lo dupliques.

## `AnimatedNumber` renderiza "0" en el HTML server-side
Anima client-side, partiendo de 0. Confirmado en producción: el HTML servido muestra "0 Performance / 0 Accessibility / 0 Best Practices / 0 SEO" (F-08). Cualquier cifra de valor (métricas Lighthouse, contadores) debe tener su valor real en el SSR; la animación es progressive enhancement (F-08 / RF-018). Falsabilidad: `curl` al HTML debe contener los valores finales.

## `force-dynamic` global existe por el nonce de CSP
`app/layout.tsx` fuerza dinámico para poder inyectar el nonce per-request de `proxy.ts`. Si se migra a CSP con hash (ADR-004), se puede remover el `force-dynamic` y recuperar generación estática — pero **recién** tras validar que los inline conocidos (JSON-LD de `layout.tsx`) están cubiertos por el hash. No remover antes de esa validación.

## `x-forwarded-for` es spoofeable — no es solo teoría, está confirmado en el código
El cliente controla el valor izquierdo de `x-forwarded-for`. Confirmado que **tres** archivos usan el patrón vulnerable `req.headers.get('x-forwarded-for')?.split(',')[0]`: `proxy.ts:16-22`, `lib/security/api-guard.ts:62-68`, `lib/security/worker-auth.ts:31-37`. Ninguno usa `x-real-ip`/`x-vercel-forwarded-for`/`ipAddress()` de la plataforma como fuente primaria. F-01 (RNF-SEC-01) requiere corregir los tres, no solo uno — y el rate-limit de `rate-limit.ts` es además un `Map` en memoria per-instancia (no comparte estado entre invocaciones serverless), así que la corrección de IP sin mover a un store compartido (KV/Upstash) no cierra el hallazgo completo.

## `packages` es la clave actual en `site_content`, `soluciones` es la nueva
Confirmado en `lib/site-content.ts` (`SiteContent.packages`, `DEFAULT_PACKAGES`, `getSiteContent` filtra `.in('key', ['about', 'projects', 'packages'])`) y `lib/admin-content-validation.ts:120-124` (`byKeySchema.packages`). No dupliques la clave al migrar: migrá el dato de la fila `packages` a `soluciones` y borrá la vieja fila — una sola fuente de verdad (§19 del SRS).

## `npm test` no prueba nada todavía
`package.json:11` — `"test": "npm run typecheck"`. Es un gap conocido del SRS §17. No asumir que "tests pasan" significa cobertura funcional real hasta que Vitest/Playwright estén integrados (parte de Fase 1 / Base).

## `engines` no está fijado en `package.json`
El entorno de desarrollo real corre Node v24; el SRS pide fijar `engines.node >= 20`. Confirmar esto como parte de la tarea "Base" de Fase 1 antes de asumir compatibilidad de versión en CI/Vercel.

## `npm run lint` está roto en este repo (Next.js 16 quitó `next lint`)
`package.json` define `"lint": "next lint"`, pero Next.js 16.1.6 ya no tiene ese subcomando (`npx next --help` no lo lista; falla con "Invalid project directory provided, no such directory: .../lint"). Esto es **drift del SRS**: el SRS asume que `npm run lint` funciona como parte del protocolo por tarea. No es algo introducido por F-01 — ya estaba roto en `main` antes de tocar nada. Reportado; queda pendiente de una tarea separada (parte de "Base" en Fase 1) migrar a ESLint standalone (`eslint .`) con el config ya presente (`eslint-config-next`).

## F-01 tocó 7 archivos con el patrón XFF vulnerable, no 3
Al grepear `x-forwarded-for` en todo el repo aparecieron 7 ocurrencias, no las 3 que el SRS menciona como ejemplo: `proxy.ts`, `lib/security/api-guard.ts`, `lib/security/worker-auth.ts`, `app/api/admin/login/route.ts`, `app/api/admin/uploads/image/route.ts`, `app/api/workers/cleanup/route.ts`, `app/api/workers/process-leads/route.ts`. Cuando el SRS da una lista de ejemplo de dónde corregir algo, grepear el patrón completo en el repo antes de asumir que la lista está completa.

## `npm audit` reporta 21 vulnerabilidades, ninguna introducida por F-01
Verificado con `npm audit` antes/después de agregar `@upstash/ratelimit`, `@upstash/redis`, `@vercel/functions`: las vulnerabilidades (axios, hono, next, simple-git, etc.) vienen de dependencias transitivas de `@testsprite/testsprite-mcp` y de la propia versión de `next`/tooling, no de las libs nuevas. Está fuera de scope de F-01 (que es sobre IP confiable + rate-limit compartido); queda para la tarea "Base" de Fase 1 (SAST + dependency scanning en CI, SRS §17).

## `style-src 'unsafe-inline'` no se puede reducir sin tocar 10 archivos
`grep -rl "style={{" components app` da 10 archivos con inline styles de React. Quitar `unsafe-inline` de `style-src` sin migrar esos estilos a className/nonce rompería el render de esos componentes. Es parte de la decisión ADR-004 (nonce→hash), no de una corrección aislada — no tocar sin confirmar el ADR primero.

## Repo tiene ramas remotas activas además de `main`/`develop`
`origin` incluye `copilot/combine-fix-consumption-and-develop`, `copilot/merge-all-branches`, `fix/mobile-menu-global-border`. Antes de crear una rama nueva, chequear que el nombre no choque con trabajo en curso de otro colaborador/bot.
