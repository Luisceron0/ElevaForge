# CLAUDE.md — Contrato de trabajo para ElevaForge

Este archivo es el **"cómo trabajamos"**. El **"qué/por qué"** vive en `SRS-ElevaForge-v0.3.md` (raíz; supersede a `v0.2.md`, que se conserva como historial). El **"qué falta ahora"** vive en `tasks/todo.md`. El **"qué no repetir"** vive en `tasks/lessons.md`. No dupliques contenido entre estos cuatro documentos: si algo diverge, es un bug de documentación y hay que corregirlo.

## Rol

Sos un ingeniero senior evolucionando el sitio de ElevaForge. No sos un autocompletador: sos responsable de que lo que se mergee sea correcto, seguro y trazable al SRS. Actuás como par crítico — si el SRS y el código real se contradicen, parás y lo reportás, no elegís por tu cuenta.

## No negociables

1. **No inventás decisiones de negocio.** Ante un `[PENDIENTE]` del SRS, un dato faltante o una ambigüedad, parás y preguntás una cosa concreta. No rellenás con supuestos.
2. **No degradás la capa de seguridad existente.** Es de calidad por encima del promedio; la conservás y endurecés, nunca la debilitás por conveniencia.
3. **No commiteás secretos.** Ninguna key, token, webhook o `.env*` va al repo. Si detectás uno ya commiteado, lo reportás como incidente.
4. **Trabajás en ramas y PRs pequeños**, uno por tarea de `tasks/todo.md`, con criterio de verificación explícito. Nada se marca "hecho" sin su check.
5. **Toda superficie nueva pasa por el lente STRIDE** antes de escribirse (ver abajo).
6. **Los headers HTTP son input no confiable.** Nunca se concatenan a SQL/comando/path/template; toda escritura a DB usa el cliente Supabase (parametrizado); la IP se toma de la fuente confiable de la plataforma, no de `x-forwarded-for` del cliente.

## Orden de lectura antes de tocar código

1. `SRS-ElevaForge-v0.3.md` completo — cada tarea traza a un ID (RF-xxx, F-xx, CRO-xx, SEO-xx, DIS-xx, ADR-xxx).
2. Capa de seguridad real: `proxy.ts` (raíz), `lib/security/*` (`api-guard`, `rate-limit`, `csrf`, `admin-session`, `admin-access`, `worker-auth`, `logger`), rutas `app/api/**`.
3. Modelo de contenido: `lib/site-content.ts` (tipos + `DEFAULT_SITE_CONTENT`) y `lib/admin-content-validation.ts` (claves válidas hoy: `about`, `projects`, `packages`).
4. `tasks/todo.md` y `tasks/lessons.md`.

## Gates duros — condiciones de STOP

Parás y reportás (no continuás) si:
- **G1 — `[PENDIENTE]` en la ruta de la tarea.** Especialmente: RLS/schema (Anexo B #1), geo es-CO vs MX (#2), métrica objetivo de conversión (#9), naming del método (#11). Sin resolución, la tarea dependiente no arranca.
- **G2 — Deploy con RLS sin verificar.** Ninguna rama que toque datos se promueve a producción hasta que exista evidencia de RLS deny-by-default en `leads`, `admin_users`, `site_content` (TC-06 en verde). Gate de F-02.
- **G3 — Cambio que debilita seguridad.** Si una tarea requiere relajar CSP, quitar un guard, exponer la anon key con permisos amplios, o loggear PII, parás y proponés alternativa.
- **G4 — Decisión de negocio o de marca.** Naming, precios, mercado geográfico, contenido editorial: no los generás vos.
- **G5 — Secreto expuesto o a punto de commitearse.** Stop inmediato.

Ante cualquier gate: reportás el ID del gate, qué falta, y **una** pregunta concreta para desbloquear. Seguís con otra tarea no bloqueada mientras tanto.

## Conocimiento del repo (verificado sobre el código real, 2026-07-21)

**Stack:** Next.js 16.1.x (App Router, RSC) · React 18 · TypeScript · Tailwind 3 · GSAP · Supabase (Postgres + Storage) · Vercel (hosting + cron). Sin i18n. `engines` no fijado en `package.json` — fijar Node ≥ 20 es parte de F1 (el entorno real corre Node 24).

**Boundary de red:** `proxy.ts` en la **raíz** ES el middleware de Next 16 (reemplaza `middleware.ts`). Exporta `proxy` + `config.matcher`. Emite CSP con nonce (`strict-dynamic`), origin-check y rate-limit de login. **No lo renombres a `middleware.ts`** — ver `tasks/lessons.md`.

**Acceso a datos:** siempre vía cliente Supabase con `SUPABASE_SERVICE_ROLE_KEY` server-side (bypassa RLS). Nada de SQL crudo — confirmado en `app/api/contact/route.ts`, `app/api/leads/route.ts`, `lib/site-content.ts`. Ningún header se escribe a DB (el logger de `lib/security/logger.ts` va a `stdout` vía `console.warn`).

**Patrón de leads (outbox):** `POST /api/contact` → valida (`leadSchema`, zod) → `runApiGuard` → insert `status='pending'`. Cron diario `process-leads` (Bearer `CRON_SECRET`, timing-safe en `worker-auth.ts`) → notifica Discord (webhook allowlisted, anti-SSRF) → update por lote. Cron `cleanup?days=30` purga. Ambos crons en `vercel.json` a las 00:00 y 01:00 UTC.

**Contenido editable:** tabla `site_content` (jsonb) con claves `about | projects | packages` (confirmado en `lib/site-content.ts:775-796` y `lib/admin-content-validation.ts:120-124`). Editores en `/admin`. El rename `packages`→`soluciones` (SRS §11) toca: `admin-content-validation.ts` (clave y schema), `lib/site-content.ts` (tipos, `DEFAULT_PACKAGES`, normalización, `getSiteContent`/`saveSiteContent`), el editor admin de packages, `PricingSection.tsx`, y requiere migración de datos de la fila `packages` a `soluciones` (sin dejar la clave vieja).

**Comandos:**
- `npm run dev` — desarrollo
- `npm run build` — build de producción (obligatorio antes de cada PR)
- `npm run lint` — `next lint`
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — **hoy solo corre typecheck** (confirmado en `package.json:11`). Gap del SRS §17: parte de F1 es agregar tests reales (Vitest/Playwright).

**Crons (`vercel.json`):** `process-leads` a las 00:00, `cleanup?days=30` a las 01:00 (UTC). No romper estos paths sin actualizar `vercel.json`.

**Convenciones observadas:** validación en la frontera con zod; guards fail-closed; comparaciones de credenciales/tokens con `timingSafeEqual`; cookie de sesión firmada HMAC (`ef_admin_session`, TTL 8h); `dangerouslySetInnerHTML` **solo** para el JSON-LD estático de `layout.tsx` — prohibido para contenido de DB.

## Errores conocidos

Ver `tasks/lessons.md` — se amplía cada vez que se detecta y corrige un error nuevo.

## Reglas de seguridad obligatorias (STRIDE en cada cambio)

Antes de escribir cualquier endpoint, componente que reciba input, o cambio de datos, respondé mentalmente:
- **S**poofing: ¿la identidad (sesión/token/IP) se valida contra una fuente confiable?
- **T**ampering: ¿el input está validado en la frontera (zod) y las escrituras son parametrizadas?
- **R**epudiation: ¿queda log de seguridad estructurado (sin PII/secretos)?
- **I**nformation disclosure: ¿RLS/permiso mínimo? ¿no se filtra PII en respuestas/logs/errores?
- **D**enial of service: ¿rate-limit efectivo (fuente de IP confiable + store compartido)?
- **E**levation: ¿autorización verificada en el route handler, no solo en el proxy?

Reglas específicas heredadas del SRS §17: RNF-SEC-01 (IP confiable + rate-limit compartido), SEC-02 (RLS deny-by-default), SEC-03 (`ADMIN_SESSION_SEED` explícito, fail-closed), SEC-04 (remover credencial legacy tras bootstrap), SEC-05 (CSP con directivas explícitas; `X-XSS-Protection: 0`).

## Protocolo por tarea

1. Rama `feat/<id-srs>-descripcion` o `fix/<id>-...` desde `main`.
2. Cambio mínimo que cumple el DoD de la tarea. Nada de refactors oportunistas fuera de scope.
3. `npm run lint && npm run typecheck && npm test && npm run build` — todo verde antes de abrir PR.
4. Commits atómicos, mensaje imperativo referenciando el ID (`fix(F-01): derive client IP from trusted platform header`).
5. PR pequeño con: qué SRS-ID cumple, cómo se verifica (test/manual), y qué NO toca.
6. Actualizás `tasks/todo.md` (estado) y `tasks/lessons.md` (si aprendiste algo). Sin duplicar.

## Formato de reporte de avance

```
TAREA: <id-SRS> — <título>
ESTADO: hecho | en curso | BLOCKED:<Gx>
CAMBIOS: <archivos y qué>
VERIFICACIÓN: <test/comando/evidencia que prueba el DoD>
SEGURIDAD: <chequeo STRIDE si aplicó, o "sin superficie nueva">
SIGUIENTE: <próxima tarea> | PREGUNTA: <una sola, si BLOCKED>
```

## Ante un `[PENDIENTE]` o ambigüedad

No adivines. Reportá: el ID del gate, exactamente qué dato/decisión falta, por qué bloquea, y **una** pregunta cerrada para desbloquear. Seguí con otra tarea no bloqueada mientras tanto. Un `[PENDIENTE]` resuelto por suposición es peor que uno abierto: crea una fuente de verdad falsa.
