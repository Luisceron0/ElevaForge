# SRS — Evolución del Sitio Institucional de ElevaForge

**Versión:** 0.2
**Fecha:** 2026-07-20
**Autor:** Equipo ElevaForge · **Revisor técnico:** Arch-Sentinel
**Estado:** Borrador (contiene `[PENDIENTE]` bloqueantes — no apto para implementación hasta resolverlos)
**Changelog v0.2:** se agregan §28 (Requisitos de conversión/CRO), §29 (Dirección de diseño con ciandt.com como modelo de referencia adaptado), expansión de §22 (SEO con motor de contenido), IA multipágina en §14, RF-017…RF-021, hallazgos F-07/F-08 y ADR-007…ADR-009.
**Norma de referencia:** IEEE 29148 (adaptada a mantenimiento evolutivo)
**Base de reconocimiento:** repo `github.com/Luisceron0/ElevaForge` + producción `www.elevaforge.com`, leídos el 2026-07-20.

> **Nota de método.** Todo lo marcado `[PENDIENTE]` NO se rellenó por inferencia. Se basa este documento únicamente en lo observable en el código y el sitio. Las decisiones de negocio provienen del brief aprobado; las decisiones de ingeniería y sus disidencias están en el **Anexo A (ADR)**.

---

## 1. Introducción

Este SRS especifica la **evolución** (no reescritura) del sitio institucional de ElevaForge. El sistema existente está desplegado en Vercel sobre Next.js 16 (App Router) + Supabase, con un panel de administración propio y una capa de seguridad hecha a mano de calidad por encima del promedio. El objetivo del cambio es **reposicionar la comunicación** de "agencia de desarrollo con paquetes de precio fijo" a "estudio de ingeniería de software", conservando la fundación técnica sana y corrigiendo los defectos identificados en la auditoría (§26).

## 2. Propósito

Proveer a un equipo de desarrollo la especificación suficiente para implementar la nueva versión del sitio **sin un nuevo levantamiento de requerimientos**, diferenciando de forma explícita qué se conserva, modifica, elimina y agrega, y trazando cada requisito a su verificación.

## 3. Alcance

**Clasificación (decisión de ingeniería, Arch-Sentinel):**
- **Major release** en: posicionamiento/mensaje, arquitectura de navegación (IA), modelo de contenido editable.
- **Patch / evolución incremental** en: arquitectura técnica, stack, capa de seguridad y datos (se conservan, se endurecen).

**En scope:**
- Reposicionamiento de contenido y mensaje a "estudio de ingeniería de software" orientado a público no técnico.
- Nueva IA de navegación centrada en las **tres familias de soluciones** (Presencia Digital, Sistemas de Gestión, Software Personalizado) como *contenido comunicacional*, no como funcionalidad.
- Flujo de **solicitud de diagnóstico** como conversión primaria (formulario) + WhatsApp como secundaria.
- Corrección de los hallazgos de seguridad de severidad ≥ MEDIO (§26).
- Corrección de SEO técnico (geo, sitemap, headers).
- Conservación y endurecimiento del panel admin y del pipeline de leads.

**Fuera de scope (explícito):**
- **No** se implementa e-commerce, CRM, ERP, POS, Help Desk, portal de clientes ni SaaS. El catálogo de soluciones es **contenido**, no funcionalidad del sitio (confirmado por el brief).
- **No** se migra de stack ni se reescribe la arquitectura.
- **No** se implementa multilenguaje en v1 (ver ADR-002; es-CO único).
- **No** se implementa blog / centro de documentación en v1 salvo confirmación (ver RF-016, marcado `[PENDIENTE]`).

## 4. Definiciones y glosario

| Término | Definición |
|---|---|
| **Solución** | Producto que ElevaForge comercializa (resuelve un problema de negocio). Unidad comercial. |
| **Familia de soluciones** | Agrupación de nivel superior: Presencia Digital, Sistemas de Gestión, Software Personalizado. |
| **Capacidad** | Componente configurable que complementa una solución (ej. inventario, reportes). **No** es un producto independiente. |
| **Diagnóstico** | Solicitud de asesoría inicial gratuita; conversión primaria del sitio. |
| **Lead** | Registro de un contacto entrante, almacenado en la tabla `leads` con patrón outbox. |
| **Outbox** | Patrón: la petición inserta el lead como `pending` y responde rápido; un worker asíncrono lo procesa. |
| **Proxy (Next 16)** | `proxy.ts` — reemplaza a `middleware.ts` desde Next.js 16; boundary de red (CSP, origin-check, rate-limit). |
| **RLS** | Row Level Security de PostgreSQL/Supabase. |
| **Service-role key** | Llave de Supabase que **bypassa RLS**; solo server-side. |

## 5. Stakeholders y usuarios

| Rol | Necesidad principal | Criterio de éxito |
|---|---|---|
| Prospecto no técnico (PyME, emprendedor) | Entender qué resuelve ElevaForge y cómo iniciar | Solicita un diagnóstico o escribe por WhatsApp |
| Administrador de contenido (equipo ElevaForge) | Editar contenido sin tocar código | Actualiza secciones y proyectos desde `/admin` |
| Equipo comercial | Recibir y no perder leads | Lead entra a `leads` y llega notificación a Discord |
| Equipo de desarrollo | Especificación implementable y trazable | Implementa sin re-levantar requisitos |
| Responsable de seguridad | Sistema resistente a los vectores conocidos | Hallazgos ≥ MEDIO corregidos y verificables |

## 6. Objetivos del proyecto

Derivados del brief (fuente de verdad aprobada):
1. Presentar a ElevaForge como **estudio de ingeniería de software** (no como vendedor de tecnología ni de horas).
2. Comunicar la propuesta de valor y las **tres familias de soluciones** a público no técnico.
3. Generar confianza (transparencia, autonomía del cliente, documentación).
4. Captar prospectos y **facilitar solicitudes de diagnóstico**.
5. Eliminar del mensaje todo lo que contradiga el posicionamiento: precios fijos, paquetes rígidos, encuadre de "agencia budget".

> **Observación de primer principio (riesgo de negocio aceptado, ADR-003):** quitar precios explícitos aumenta la fricción de conversión para PyMEs que comparan por costo. El brief lo acepta a cambio de posicionamiento. Se registra como riesgo aceptado, no como error.

## 7. Estado actual del sistema

- **Stack:** Next.js 16.1.x (App Router, RSC), React 18, TypeScript, Tailwind 3, GSAP. Hosting Vercel.
- **Backend:** Supabase (PostgreSQL + Storage). Acceso server-side con `SUPABASE_SERVICE_ROLE_KEY` (singleton por cold-start).
- **Boundary de red:** `proxy.ts` (Next 16) — CSP con nonce per-request, origin-check y rate-limit de login para `/api/admin/*`.
- **Patrón de leads:** outbox. `POST /api/contact` inserta `pending`; cron diario `process-leads` notifica a Discord; cron `cleanup?days=30` purga.
- **Panel admin:** `/admin` con editores de contenido (about, projects, packages), gestión de usuarios admin y subida de imágenes a Storage.
- **Auth admin:** cookie de sesión firmada con HMAC-SHA256 (`ef_admin_session`, TTL 8h, `httpOnly/secure/sameSite=strict`), password con scrypt, comparación timing-safe. Fallback legacy por env (bootstrap).
- **SEO base:** `metadata` en `layout.tsx`, `robots.ts`, `sitemap.ts`, JSON-LD, OpenGraph/Twitter.
- **Cumplimiento actual del sitio en producción:** posicionamiento "Agencia de software · Colombia", 3 paquetes con precio fijo (USD/COP), 1 proyecto entregado + 6 en curso.

## 8. Análisis del sitio existente

**Fortalezas (con evidencia):**
- Acceso a datos **parametrizado de punta a punta** (cliente Supabase; sin SQL crudo; ningún header se escribe a DB). Vector SQLi cerrado por diseño.
- **Defensa en profundidad correcta:** la autorización admin se valida en cada route handler (`hasActiveAdminSessionInRequest`), no solo en `proxy.ts`. Resiste la clase de bypass tipo CVE-2025-29927.
- SSRF-allowlist real en el webhook Discord (host + path + https); honeypot; `zod` con strip de control-chars; scrypt + timing-safe; fail-closed en guards.
- Logging de seguridad estructurado a `stdout` (no a DB).

**Debilidades (detalle y corrección en §26):**
- Rate-limiting derrotable por spoof de `X-Forwarded-For` + store en memoria per-instancia (MEDIO-ALTO).
- `ADMIN_SESSION_SEED` cae a la service-role key (MEDIO); credencial admin legacy en texto plano persistente (MEDIO).
- `force-dynamic` global por CSP con nonce → se pierde cacheo estático de un sitio casi estático (MEDIO-BAJO).
- SEO: `sitemap` omite `/nosotros`; geo cruzado `es_MX` vs Colombia; `X-XSS-Protection` legacy.
- **RLS no verificable** (potencialmente CRÍTICO) — `[PENDIENTE]`.

**Oportunidades:**
- El modelo de contenido editable (`site_content` jsonb) ya permite reemplazar "packages" por "familias de soluciones" con bajo costo.
- La fundación de seguridad permite el reposicionamiento sin deuda técnica adicional si se corrigen los hallazgos.

## 9. Funcionalidades existentes (inventario grounded)

| ID | Funcionalidad | Ubicación |
|---|---|---|
| EX-01 | Home con secciones (Hero, Autonomía, Pricing, Projects, Roadmap, Team, Contact) | `components/sections/*` |
| EX-02 | Página "Nosotros" | `app/nosotros/page.tsx` |
| EX-03 | Páginas legales (Privacidad, Términos) | `app/privacidad`, `app/terminos` |
| EX-04 | Formulario de contacto → outbox | `ContactForm.tsx`, `POST /api/contact` |
| EX-05 | CTA WhatsApp | `lib/whatsapp.ts` |
| EX-06 | Sección de precios/paquetes fijos | `PricingSection.tsx`, `packages` en `site_content` |
| EX-07 | Panel admin + login | `app/admin/*`, `POST /api/admin/login` |
| EX-08 | Edición de contenido (about, projects, packages) | `PUT /api/admin/content` |
| EX-09 | Gestión de usuarios admin | `/api/admin/users`, `scripts/create-admin.mjs` |
| EX-10 | Subida de imágenes a Storage | `POST /api/admin/uploads/image` |
| EX-11 | Worker de procesamiento de leads → Discord | `POST /api/workers/process-leads` (cron) |
| EX-12 | Cron de limpieza de leads | `/api/workers/cleanup` |
| EX-13 | SEO técnico (metadata, robots, sitemap, JSON-LD) | `layout.tsx`, `robots.ts`, `sitemap.ts` |
| EX-14 | Ruta `/api/leads` deprecada (redirect/insert) | `app/api/leads/route.ts` |

## 10. Funcionalidades a conservar

EX-02, EX-03 (con revisión legal), EX-04, EX-05, EX-07, EX-08 (adaptada, ver §11), EX-09, EX-10, EX-11, EX-12, EX-13 (con correcciones §22). Toda la capa de seguridad y el patrón outbox se **conservan y endurecen**.

## 11. Funcionalidades a modificar

- **EX-01 (Home):** reescribir el mensaje a estudio de ingeniería; sustituir la orientación de "paquetes" por "familias de soluciones".
- **EX-06 → reemplazar:** la sección de precios/paquetes fijos se reemplaza por una sección **"Familias de soluciones"** sin precios ni paquetes rígidos. La clave `packages` de `site_content` se **renombra/migra** a `soluciones` (o `familias`) con migración de datos (sin duplicar la clave; ver §19 y ADR-003).
- **EX-08 (editor de contenido):** el editor `PackagesAdminEditor` pasa a editar familias/soluciones (no precios). Ajuste de `admin-content-validation.ts` a la nueva forma.
- **EX-14 (`/api/leads` deprecado):** decidir su **eliminación** definitiva (ver §12) o mantener solo el `308` de GET; no debe quedar lógica duplicada de inserción respecto a `/api/contact`.

## 12. Funcionalidades a eliminar

- **Precios explícitos y paquetes de precio fijo** del sitio público (decisión del brief).
- **`/api/leads` POST duplicado:** su lógica de inserción replica la de `/api/contact` → **eliminar** el POST y dejar solo redirección, para no mantener dos fuentes de verdad del insert de leads. `[Confirmar]` compatibilidad con integraciones externas que aún llamen a `/api/leads`.
- **Credencial admin legacy por env** una vez completado el bootstrap (ADR-006).

## 13. Funcionalidades nuevas

- **NF-01:** Sección "Familias de soluciones" (3 familias, orientada a problema→solución, sin precios).
- **NF-02:** Página o sección de **proceso de ingeniería** presentado como parte del trabajo (no como catálogo de servicios) — el sitio ya insinúa "Proceso"; formalizar según brief.
- **NF-03:** Flujo de **solicitud de diagnóstico** explícito (puede reutilizar el formulario de contacto con un campo de intención).
- **NF-04:** Correcciones de seguridad como requisitos (ver §17).
- **NF-05 `[PENDIENTE — confirmar]`:** analítica respetuosa de privacidad (el brief lista "analítica" como capacidad; el sitio no integra ninguna). Recomendación: Vercel Analytics o Plausible, sin cookies de tracking, compatible con la CSP.

## 14. Arquitectura de navegación (IA)

**Cambio v0.2 (ADR-007):** se abandona el modelo single-page con anclas y se adopta **multipágina**, siguiendo el patrón del modelo de referencia (ciandt.com, ver §29) escalado al tamaño real de ElevaForge. Razones de ingeniería: (a) cada familia de soluciones necesita una URL propia para SEO (una landing con anclas solo puede rankear por un conjunto de keywords); (b) el patrón de referencia demuestra que la taxonomía de soluciones **es** la navegación; (c) corrige el defecto actual de enlaces duplicados ("Garantía" y "Diferencial" apuntan ambos a `#autonomia`, F-07).

```
/                          Home: propuesta de valor + prueba + familias + CTA diagnóstico
/soluciones                Índice de familias (equivalente escalado a "Services")
  /soluciones/presencia-digital
  /soluciones/sistemas-de-gestion
  /soluciones/software-personalizado
/proyectos                 Casos con estructura reto → solución → resultado (equiv. "Our Work")
  /proyectos/[slug]        Página por caso (empezando por el entregado; los "en curso" sin página propia)
/proceso                   Método de ingeniería con nombre propio (equiv. "How We Deliver")
/nosotros                  Equipo, confianza
/insights                  Motor de contenido (artículos) — alcance según ADR-009 / RF-016
/contacto                  Diagnóstico (conversión primaria) + WhatsApp
/privacidad · /terminos    Legal (Ley 1581/2012)
/admin/*                   Privado
```

Regla de navegación: máximo 6 ítems en el header; sin dos ítems que apunten al mismo destino; CTA persistente "Solicitar diagnóstico".

## 15. Modelo del dominio

Entidades conceptuales (dominio comunicacional + operativo):

- **FamiliaDeSolucion** (3 instancias fijas) → contiene **Solucion**(es) → cada una referencia **Capacidad**(es) (contenido, no tabla relacional obligatoria).
- **Proyecto** (caso): título, sector, estado (entregado/en curso), métricas Lighthouse, URL.
- **Lead / SolicitudDeDiagnostico:** ver §19.
- **AdminUser · SiteContent · Asset (Storage):** ver §19.

## 16. Requisitos funcionales

> Formato: descripción · actores · precondiciones · flujo · alternativos · postcondiciones · criterios de aceptación (binarios).

### RF-001 — Presentar propuesta de valor
- **Descripción:** el Home comunica a ElevaForge como estudio de ingeniería a público no técnico.
- **Actores:** visitante anónimo.
- **Precondiciones:** contenido cargado desde `site_content` o defaults.
- **Flujo:** 1) Visitante entra a `/`. 2) Ve Hero + familias + proceso + diferencial + casos.
- **Alternativos:** contenido editable no disponible → se renderizan `DEFAULT_SITE_CONTENT`.
- **Postcondiciones:** ninguna mutación.
- **Criterios de aceptación:** el Home no muestra precios ni paquetes; menciona las 3 familias; el mensaje no encuadra la empresa como venta de tecnología/horas.

### RF-002 — Explicar las tres familias de soluciones
- **Actores:** visitante. **Precondiciones:** contenido de familias en `site_content`.
- **Flujo:** el visitante recorre cada familia con enfoque problema→solución.
- **Criterios de aceptación:** las capacidades se presentan como complementos, **no** como productos independientes; sin precios.

### RF-003 — Solicitar diagnóstico (conversión primaria)
- **Actores:** prospecto. **Precondiciones:** formulario disponible.
- **Flujo:** 1) completa nombre, email (obligatorios), y opcionales; marca consentimiento; envía. 2) `POST /api/contact` valida (`leadSchema`), pasa `runApiGuard`, inserta `pending`. 3) Respuesta 202.
- **Alternativos:** validación falla → 400 con mensaje; honeypot `_hp` → 200 silencioso; rate-limit → 429; origin inválido → 403; payload > 4 KB → 413.
- **Postcondiciones:** fila en `leads` con `status='pending'`, `consent`, `origen`.
- **Criterios de aceptación:** sin consentimiento marcado, no se envía; PII nunca se loggea; el email de confirmación/redirección no expone datos internos.

### RF-004 — Contacto directo por WhatsApp
- **Criterios de aceptación:** el enlace `wa.me` usa el número desde env (`NEXT_PUBLIC_WHATSAPP_NUMBER`), no hardcodeado en múltiples lugares divergentes.

### RF-005 — Página "Nosotros"
- **Criterios de aceptación:** presenta equipo y genera confianza; nombres de personas en copy `[Confirmar]` con las personas (hoy el Home nombra "Miguel").

### RF-006 — Casos / Proyectos
- **Criterios de aceptación:** distingue "entregado" vs "en curso"; métricas Lighthouse mostradas son verificables `[Confirmar]`; no se presentan proyectos en curso como entregados.

### RF-007 — Páginas legales
- **Criterios de aceptación:** política de privacidad conforme a **Ley 1581 de 2012 (Habeas Data, Colombia)** y su tratamiento de datos personales; `[PENDIENTE: revisión legal]`.

### RF-008 — Autenticación de administrador
- **Flujo:** `POST /api/admin/login` → `runApiGuard` → `verifyAdminCredentials` (Supabase `admin_users` → fallback legacy) → cookie firmada.
- **Criterios de aceptación:** credenciales inválidas → 401 genérico; éxito → cookie `httpOnly/secure/sameSite=strict`, TTL 8h; rate-limit de login **efectivo** tras corrección de IP (RNF-SEC-01).

### RF-009 — Edición de contenido del sitio
- **Flujo:** `PUT /api/admin/content` con sesión admin activa → valida clave (`about|projects|soluciones`) y forma → `saveSiteContent`.
- **Criterios de aceptación:** sin sesión → 401; clave inválida → 400; contenido se persiste en `site_content` jsonb; el contenido renderizado usa el escaping por defecto de React (prohibido `dangerouslySetInnerHTML` para contenido de DB — el único uso permitido es el JSON-LD estático de `layout.tsx`).

### RF-010 — Gestión de usuarios admin
- **Criterios de aceptación:** crear/gestionar admins requiere sesión admin activa; passwords con scrypt; `is_active=false` bloquea acceso sin excepción legacy.

### RF-011 — Subida de imágenes
- **Criterios de aceptación:** requiere sesión admin + origin válido + rate-limit; MIME allowlist (jpeg/png/webp/gif/avif); ≤ 5 MB; nombre saneado + UUID; `upsert:false`.

### RF-012 — Procesamiento asíncrono de leads
- **Flujo:** cron diario → `process-leads` (auth Bearer `CRON_SECRET` timing-safe) → lote de `pending` → notifica Discord (webhook allowlisted) → actualiza `status` por-lote.
- **Criterios de aceptación:** sin `CRON_SECRET` → fail-closed 401; webhook no-Discord → error; `attempts >= 5` → `failed`.

### RF-013 — Limpieza programada
- **Criterios de aceptación:** `cleanup?days=30` requiere autorización de worker; purga según retención definida (ver RNF privacidad).

### RF-014 — SEO técnico
- **Criterios de aceptación:** `sitemap` incluye **todas** las páginas indexables (incl. `/nosotros`); metadata `es-CO`; JSON-LD válido; `robots` bloquea `/api/` y `/admin/`.

### RF-015 — Consentimiento y minimización de datos
- **Criterios de aceptación:** consentimiento explícito previo al insert; retención definida y aplicada por `cleanup`; identificador de usuario no se loggea en claro en `LOGIN_FAILED`.

### RF-016 — Blog / centro de documentación ("Insights")
- **Actualización v0.2:** el modelo de referencia (§29) convierte el motor de contenido en pieza estructural de SEO y autoridad. Recomendación: **v1 mínima** = sección `/insights` con artículos en el CMS existente (`site_content` o tabla `articles`), sin podcast/webinars/whitepapers (escala CI&T que ElevaForge no puede sostener). `[PENDIENTE: confirmar v1 vs v1.1]` (ADR-009).
- **Criterios de aceptación (si entra):** cada artículo con URL propia, metadata individual, JSON-LD `Article`, presente en sitemap; contenido de DB renderizado con escaping por defecto (sin `dangerouslySetInnerHTML`); frecuencia editorial mínima definida — un blog con 2 posts viejos daña más que no tenerlo.

### RF-017 — Medición de conversión (analítica) — **bloqueante para CRO**
- **Descripción:** instrumentar el sitio para medir el funnel de conversión. Hoy no existe analítica alguna; sin línea base, "mejorar la conversión" no es verificable.
- **Actores:** visitante (pasivo), equipo ElevaForge (consumidor de métricas).
- **Flujo:** eventos mínimos: page_view por ruta, click CTA WhatsApp, inicio de formulario, envío exitoso (202), error de validación, click "Solicitar diagnóstico".
- **Criterios de aceptación:** herramienta sin cookies de tracking invasivo (Vercel Analytics o Plausible — ADR-008); compatible con la CSP activa (`connect-src`/`script-src` actualizados explícitamente, no con wildcard); los eventos no incluyen PII; funnel completo consultable (visita → interacción → lead).

### RF-018 — Prueba y autoridad renderizadas server-side
- **Descripción:** las cifras de confianza (métricas Lighthouse, proyectos, equipo) deben ser visibles con el valor real en el HTML servido.
- **Evidencia del defecto (F-08):** el HTML en producción muestra "0 Performance / 0 Accessibility / 0 Best Practices / 0 SEO" porque `AnimatedNumber` parte de 0 y anima client-side; crawlers, link-previews y usuarios con JS lento ven ceros en la sección que afirma "verificado con Lighthouse".
- **Criterios de aceptación:** el HTML inicial (sin JS) contiene el valor final de cada métrica; la animación es progressive enhancement; `prefers-reduced-motion` la desactiva; corregido el copy "1 proyectos entregados" → concordancia gramatical dinámica.

### RF-019 — Sección de preguntas frecuentes (FAQ)
- **Descripción:** FAQ orientada a objeciones de compra del público no técnico ("¿qué incluye un diagnóstico?", "¿el código es mío?", "¿cómo se define el costo sin precios publicados?"). Patrón tomado del modelo de referencia; además mitiga el riesgo de conversión aceptado en ADR-003 (retiro de precios).
- **Criterios de aceptación:** marcada con JSON-LD `FAQPage` válido; editable desde el admin `[Confirmar]`; sin prometer capacidades como productos.

### RF-020 — Formulario de diagnóstico en dos pasos (reducción de fricción)
- **Descripción:** la conversión primaria pide primero lo mínimo (nombre, email/WhatsApp, "contame tu problema") y solo después, opcionalmente, el resto (empresa, presupuesto, servicio).
- **Precondiciones:** RF-003 vigente; el schema `leadSchema` ya trata esos campos como opcionales — el backend **no cambia**, solo la presentación.
- **Criterios de aceptación:** paso 1 con ≤ 4 campos; el envío del paso 1 ya crea el lead (`pending`); el paso 2 es opcional y actualiza el mismo lead `[Confirmar si se implementa update o un solo insert diferido]`; tasa de abandono del formulario medible vía RF-017.

### RF-021 — Correo corporativo en dominio propio
- **Descripción:** sustituir `elevaforge@gmail.com` por `contacto@elevaforge.com` (o equivalente) en sitio, metadata y legales.
- **Justificación:** una dirección Gmail en el sitio de un estudio de ingeniería contradice el posicionamiento y reduce confianza (señal de conversión, F-07). El dominio ya existe.
- **Criterios de aceptación:** ninguna referencia a `@gmail.com` en el sitio público; SPF/DKIM/DMARC configurados en el dominio `[PENDIENTE: proveedor de correo]`.

## 17. Requisitos no funcionales

### Rendimiento
- LCP < 2.5 s y TTFB acorde al claim público de "<2s"; si se conserva `force-dynamic`, medir el costo real por request (ver ADR-004).
- Imágenes en AVIF/WebP (ya configurado en `next.config.ts`).

### Disponibilidad
- SLA objetivo `[PENDIENTE: definir]`. El sitio es institucional; RTO/RPO bajos aceptables. Leads: RPO efectivo = 0 hasta el insert (outbox garantiza persistencia previa a la notificación).

### Seguridad (obligatorio — con hallazgos de §26 como requisitos)
- **RNF-SEC-01 (deriva de F-01):** la IP para rate-limit/log se obtiene de una fuente confiable de la plataforma (`x-real-ip`/`x-vercel-forwarded-for`/`ipAddress()`), **no** de `x-forwarded-for.split(',')[0]`. Rate-limit de login/contact en **store compartido** (Vercel KV/Upstash).
- **RNF-SEC-02 (deriva de F-02):** RLS deny-by-default en `leads`, `admin_users`, `site_content`; `anon key` sin `SELECT` sobre `leads`/`admin_users`. `[PENDIENTE: aportar SQL de policies]`.
- **RNF-SEC-03 (deriva de F-03):** `ADMIN_SESSION_SEED` obligatorio y explícito; fail-closed si falta; prohibido usar la service-role key como semilla.
- **RNF-SEC-04 (deriva de F-04):** eliminar credencial admin legacy tras bootstrap; check de arranque que alerte si coexisten admins en DB y env legacy.
- **RNF-SEC-05:** CSP con directivas explícitas (ya presente en `proxy.ts`). Evaluar `script-src` con **hash** en vez de nonce para recuperar generación estática (ADR-004). `style-src 'unsafe-inline'` a reducir. `X-XSS-Protection: 0`.
- **Política de logging de seguridad:** eventos que siempre se registran (auth ok/fallida sin secretos ni password, rate-limit, cambios a entidades críticas, 5xx, 401/403); nunca password/token/PII innecesaria; JSON con timestamp ISO 8601.
- **Autorización:** modelo simple admin/no-admin (RBAC ligero). Zero trust: cada route valida sesión.
- **Datos sensibles identificados:** PII de leads (nombre, email, teléfono, mensaje), credenciales admin, secretos (`SERVICE_ROLE_KEY`, `CRON_SECRET`, `ADMIN_SESSION_SEED`, `DISCORD_WEBHOOK_URL`).
- **Compliance:** Ley 1581/2012 (Colombia). GDPR solo si hay tráfico UE `[Confirmar]`.

### Escalabilidad
- Sitio estático-friendly; el cuello no es escala sino el trade-off nonce/estático (ADR-004).

### Mantenibilidad
- Cobertura de tests mínima `[PENDIENTE: definir]` (hoy `npm test` = solo `typecheck`).
- SAST + dependency scanning + secrets scanning en CI (hoy no verificados; ver §24/§26).

## 18. Casos de uso (resumen)

- **CU-01 Solicitar diagnóstico** (RF-003): prospecto → formulario → lead `pending` → Discord.
- **CU-02 Contactar por WhatsApp** (RF-004).
- **CU-03 Administrar contenido** (RF-008/009): admin → login → edita familias/proyectos → publica.
- **CU-04 Procesar leads** (RF-012): scheduler → worker → notificación.

## 19. Modelo conceptual de datos

Derivado del código (validación, rutas, README). **Las policies RLS son `[PENDIENTE]`.**

**leads**
`id (uuid, pk)`, `nombre`, `email`, `telefono?`, `empresa?`, `mensaje?`, `servicio?`, `presupuesto?`, `contacto_pref?`, `consent (bool)`, `origen`, `status ('pending'|'sent'|'failed')`, `attempts (int)`, `last_attempt_at?`, `discord_sent_at?`, `created_at`.
RLS esperada: **sin acceso** para `anon`; escritura solo vía service-role (server). `[PENDIENTE: confirmar policy]`.

**admin_users**
`username (unique)`, `password_hash (scrypt$...)`, `is_active (bool)`, timestamps.
RLS esperada: **sin acceso** para `anon`. `[PENDIENTE]`.

**site_content**
`key (text pk: 'about'|'projects'|'soluciones')`, `value (jsonb)`, `updated_at`.
Nota de migración: renombrar `packages`→`soluciones` sin dejar la clave vieja (evitar dos fuentes de verdad).
RLS esperada: lectura pública si el contenido se sirve al cliente `[Confirmar cómo se lee]`; escritura solo service-role.

**Storage bucket** `site-assets` (o `SUPABASE_STORAGE_BUCKET`): carpetas `projects|about|members`. Política de acceso `[PENDIENTE]`.

## 20. Arquitectura lógica

```
Cliente (browser)
   │  HTTPS + CSP (nonce/hash)
   ▼
Vercel Edge/Node ── proxy.ts (Next 16): CSP, origin-check, rate-limit login
   ▼
Next.js App Router (RSC + route handlers)
   ├─ Público: /, /nosotros, legales, /api/contact
   ├─ Admin: /admin/*, /api/admin/* (auth en cada handler)
   └─ Workers: /api/workers/* (Bearer CRON_SECRET)
   ▼
Supabase (service-role, server-only): Postgres (leads, admin_users, site_content) + Storage
Vercel Cron ─▶ process-leads / cleanup
process-leads ─▶ Discord webhook (allowlisted)
```

**Principios:** stateless (salvo rate-limit en memoria → mover a store externo, RNF-SEC-01); secretos en env; input validado en la frontera; defensa en profundidad (proxy + route).

## 21. Interfaces (API)

| Endpoint | Método | Auth | Guard | Notas |
|---|---|---|---|---|
| `/api/contact` | POST | pública | `runApiGuard` (4 KB, 5/min) | insert outbox |
| `/api/leads` | POST/GET | pública | igual | **deprecar POST** (§12) |
| `/api/admin/login` | POST | pública | guard (2 KB, 8/min) + proxy login-limit | setea cookie |
| `/api/admin/logout` | POST | sesión | — | limpia cookie |
| `/api/admin/content` | GET/PUT | sesión admin activa | guard (128 KB) | edición de contenido |
| `/api/admin/users`, `/users/[id]` | POST/… | sesión admin | — | gestión admins |
| `/api/admin/uploads/image` | POST | sesión admin | origin + rate-limit + MIME | Storage |
| `/api/workers/process-leads` | POST | Bearer `CRON_SECRET` | timing-safe | cron diario |
| `/api/workers/cleanup` | POST | Bearer `CRON_SECRET` | — | retención |
| `/api/health` | GET | pública | — | liveness |

## 22. Requisitos SEO

- **SEO-01:** `locale`/`hreflang` = **es-CO** (corrige `es_MX`); keywords sin "México" salvo mercado confirmado (ADR-002).
- **SEO-02:** `sitemap.xml` incluye `/nosotros` y toda página indexable; `lastModified` real.
- **SEO-03:** JSON-LD `Organization`/`ProfessionalService` válido; OpenGraph/Twitter completos (ya presentes).
- **SEO-04:** `robots` permite `/`, bloquea `/api/` y `/admin/`.
- **SEO-05:** headings semánticos; una sola `<h1>` por página.
- **SEO-06:** rendimiento como factor SEO — resolver ADR-004 para no degradar Core Web Vitals.

**Expansión v0.2 (derivada del rediseño multipágina + modelo de referencia):**
- **SEO-07 — Una URL por intención de búsqueda:** cada familia de soluciones y cada caso tiene página propia con `<h1>`, metadata y JSON-LD específicos. El single-page actual solo puede rankear como una unidad; esta es la corrección SEO estructural más importante del rediseño.
- **SEO-08 — Datos estructurados por tipo de página:** `Organization` global (con `email` corporativo post-RF-021, `address` Colombia); `Service` en cada página de familia; `Article` en insights; `FAQPage` en la FAQ (RF-019); `BreadcrumbList` en páginas internas.
- **SEO-09 — Contenido server-rendered íntegro:** ningún dato de valor SEO (métricas, cifras, títulos de casos) puede depender de JS para mostrar su valor real (cierra F-08 desde el eje SEO).
- **SEO-10 — Motor de contenido:** si RF-016 entra en v1, cada artículo apunta a keywords problema-céntricas del público objetivo ("cómo digitalizar el inventario de mi tienda"), no tecnología-céntricas — coherente con la restricción del brief de no vender tecnología.
- **SEO-11 — Migración de URLs:** las anclas actuales (`/#precios`, `/#proyectos`, `/#autonomia`, `/#proceso`) reciben redirección 301/anchor-mapping a sus nuevas páginas; `/#precios` redirige a `/soluciones`. Sin 404 de enlaces externos existentes.
- **SEO-12 — Search Console y sitemap dinámico:** alta en Google Search Console `[PENDIENTE: acceso]`; `sitemap.ts` pasa de lista estática a generación desde las rutas/artículos reales, con `lastModified` verídico.

## 23. Requisitos de accesibilidad

- **A11Y-01:** objetivo **WCAG 2.2 AA** (el sitio ya afirma AA y tiene skip-link).
- **A11Y-02:** navegación completa por teclado; foco visible.
- **A11Y-03:** contraste AA (tema oscuro — verificar ratios).
- **A11Y-04:** `alt` en imágenes; formularios con labels asociados y errores accesibles.
- **A11Y-05:** respeto a `prefers-reduced-motion` en animaciones GSAP `[Confirmar implementación]`.

## 24. Casos de prueba (extracto)

| ID | Vinculado | Prueba | Resultado esperado |
|---|---|---|---|
| TC-01 | RF-003 | POST contact válido | 202 + fila `pending` |
| TC-02 | RF-003 | honeypot `_hp` lleno | 200 silencioso, sin insert |
| TC-03 | RF-003/SEC-01 | rate-limit rotando XFF | **429 tras N** (falla hoy) |
| TC-04 | RF-008 | login inválido | 401 genérico |
| TC-05 | SEC-01 | brute-force login multi-instancia | throttling efectivo |
| TC-06 | SEC-02 | `select leads` con anon key | **rechazado por RLS** |
| TC-07 | RF-009 | PUT content sin sesión | 401 |
| TC-08 | RF-012 | worker sin Bearer | 401 fail-closed |
| TC-09 | RF-011 | upload MIME no permitido | 415 |
| TC-10 | SEO-02 | sitemap | contiene `/nosotros` |

## 25. Matriz de trazabilidad (extracto)

| Requisito | Origen | Diseño | Prueba |
|---|---|---|---|
| RF-003 | Objetivo 4 (brief) | /api/contact, outbox | TC-01/02/03 |
| RF-008 | Stakeholder admin | proxy + admin-session | TC-04/05 |
| RNF-SEC-01 | F-01 (auditoría) | IP confiable + KV | TC-03/05 |
| RNF-SEC-02 | F-02 (auditoría) | RLS policies | TC-06 |
| NF-01 | Objetivo 2 (brief) | sección familias | TC-— `[PENDIENTE]` |
| SEO-01 | F-06 (auditoría) | metadata es-CO | TC-10 |

## 26. Riesgos (hallazgos de auditoría, formato completo)

**F-01 [MEDIO-ALTO] Rate-limit derrotable (XFF spoof + store en memoria).**
Impacto: brute-force de login sin throttling; spam de leads. Corrección: IP confiable + store compartido. Falsabilidad: load test rotando XFF nunca alcanza 429. Indicador temprano: ratio IPs distintas / `LOGIN_FAILED` → 1:1 bajo ataque.

**F-02 [PENDIENTE / potencialmente CRÍTICO] RLS no verificable.**
Impacto: si falta RLS y la anon key lee `leads`, fuga de PII. Corrección: RLS deny-by-default. Falsabilidad: `select leads` con anon key devuelve filas. **Bloqueante: aportar SQL de policies.**

**F-03 [MEDIO] Semilla de sesión acoplada a service-role key.** Corrección: seed explícito, fail-closed. Falsabilidad: arrancar sin `ADMIN_SESSION_SEED` no debe funcionar en prod.

**F-04 [MEDIO] Credencial admin legacy en texto plano persistente.** Corrección: remover post-bootstrap + check de arranque. Indicador temprano: ese check.

**F-05 [MEDIO-BAJO] `force-dynamic` global por CSP nonce.** Impacto: pérdida de cacheo estático, costo por request, riesgo al claim de performance. Corrección/ADR-004: CSP con hash + estático. Indicador temprano: TTFB/coste de invocaciones.

**F-06 [BAJO] SEO/consistencia:** sitemap sin `/nosotros`; geo `es_MX`; `X-XSS-Protection` legacy; `username` (email) en logs.

**F-07 [MEDIO — conversión] Señales de fricción y desconfianza observadas en producción.**
Evidencia (fetch del sitio vivo, 2026-07-20): email `elevaforge@gmail.com` como contacto principal; navegación con dos ítems ("Garantía", "Diferencial") apuntando al mismo ancla `#autonomia`; formulario de ~9 campos para la primera conversión; copy "1 proyectos entregados". Impacto: pérdida de credibilidad y abandono en el punto exacto de conversión. Corrección: RF-019/020/021 + regla de navegación de §14. Primer principio: la conversión de un servicio de confianza se gana por señales de profesionalismo consistentes; una sola señal disonante (Gmail) contamina el resto. Falsabilidad: si tras corregir, la tasa formulario-iniciado→enviado (RF-017) no mejora en 60 días, la hipótesis de fricción era incorrecta. Indicador temprano: tasa de abandono por paso del formulario.

**F-08 [MEDIO — conversión y SEO] Métricas de confianza renderizan "0" en el HTML servido.**
Evidencia: el HTML de producción contiene "0 Performance / 0 Accessibility / 0 Best Practices / 0 SEO" (AnimatedNumber client-side). Impacto: crawlers, previews de enlaces y usuarios con JS lento ven al sitio afirmando puntajes de cero en su propia sección de "Trust & Authority" — el argumento de venta se auto-refuta. Corrección: RF-018 (valores reales en SSR, animación como progressive enhancement). Falsabilidad: `curl` al HTML debe contener los valores finales; si vuelve a contener "0", regresó. Indicador temprano: test de CI que asserte los valores en el HTML estático.

**Riesgo del rediseño (nuevo):** adoptar el modelo de referencia a escala equivocada — secciones tipo enterprise (biblioteca de whitepapers, mega-menú) vacías o con contenido de relleno destruyen la confianza que intentan construir. Mitigación: regla de escala honesta de §29.

**Riesgos de negocio:** quitar precios reduce conversión de bajo funnel (aceptado, ADR-003); reposicionamiento puede confundir a prospectos del pipeline actual (mitigar con transición de mensaje).

## 27. Criterios de aceptación (globales)

1. El sitio público no muestra precios ni paquetes; presenta las 3 familias como contenido.
2. Todos los hallazgos ≥ MEDIO (F-01, F-03, F-04) corregidos y con su TC en verde.
3. F-02 (RLS) cerrado con evidencia (TC-06 en verde).
4. SEO: geo es-CO, sitemap completo (TC-10).
5. Ningún `[PENDIENTE]` de este SRS queda abierto al momento de aprobar la versión 1.0.
6. `npm test` incluye más que `typecheck`; CI con SAST + secrets scan.

---

## 28. Requisitos de conversión (CRO)

> **Regla de método:** ningún cambio de conversión se declara exitoso sin medición. RF-017 (analítica) es prerequisito de todo lo demás en esta sección.

- **CRO-01 — Línea base primero:** instrumentación (RF-017) se despliega **antes** del rediseño visual, para poder comparar contra el sitio actual. Sin línea base, el rediseño es opinión.
- **CRO-02 — Conversión primaria única:** "Solicitar diagnóstico". WhatsApp es conversión secundaria (más inmediata pero menos calificada). Cada página tiene exactamente un CTA primario visible sin scroll.
- **CRO-03 — Prueba antes que promesa (patrón del modelo de referencia):** el Home muestra evidencia verificable arriba del fold — caso entregado con métricas reales (renderizadas server-side, RF-018) y proceso con nombre propio. Prohibido inflar: los 6 proyectos "en curso" se presentan como en curso, nunca como entregados (RF-006).
- **CRO-04 — Fricción mínima en el primer contacto:** formulario en dos pasos (RF-020); paso 1 completable en < 60 segundos.
- **CRO-05 — Manejo del vacío de precios:** al retirar precios (ADR-003), la FAQ (RF-019) y la página de proceso responden explícitamente "¿cómo se define la inversión?" — el prospecto que compara por precio necesita una respuesta, aunque no sea un número.
- **CRO-06 — Señales de confianza consistentes:** correo en dominio propio (RF-021), sin errores de copy en cifras, sin enlaces duplicados, legales visibles.
- **CRO-07 — Criterio de éxito medible:** definir con negocio la métrica objetivo `[PENDIENTE: ej. ≥ X solicitudes de diagnóstico/mes o tasa visita→lead ≥ Y%]`. Sin este número, "arreglar la conversión" no es falsable.

## 29. Dirección de diseño y modelo de referencia

**Modelo de referencia:** `ciandt.com` (decisión del cliente, ADR-007). **Alcance de la referencia:** patrones de estructura, jerarquía y estrategia de contenido. **Exclusiones no negociables:** no se copia identidad visual, copy, logo, layout pixel-a-pixel ni activos de CI&T — es referencia de patrones, no fuente de material (propiedad intelectual de terceros).

**Patrones que se adoptan (escalados):**

| Patrón en el modelo | Adaptación honesta a ElevaForge |
|---|---|
| Taxonomía de servicios como navegación (mega-menú) | 3 familias como navegación simple (§14) — sin mega-menú: no hay volumen que lo justifique |
| Prueba primero: cifras, logos, Gartner/Forrester | Cifras reales verificables (4 ingenieros, casos con Lighthouse real vía RF-018); **prohibido** imitar señales de autoridad que no se poseen |
| "Our Work" con casos estructurados | `/proyectos` con plantilla reto → solución → resultado; se lanza con el caso entregado |
| Método propio con nombre (CI&T FLOW) | Nombrar el proceso de ElevaForge `[PENDIENTE: naming — decisión de marca]` y darle página propia (`/proceso`) |
| Motor de contenido (Insights) | `/insights` mínimo viable (RF-016 / ADR-009); sin podcast/webinars/whitepapers |
| FAQ estructurada | RF-019 con `FAQPage` schema |
| CTA persistente "Contact us" | "Solicitar diagnóstico" persistente (CRO-02) |

**Regla de escala honesta (mitiga el riesgo nuevo de §26):** ninguna sección del modelo de referencia se adopta si ElevaForge no puede llenarla con contenido real y mantenerla. Ante la duda, se omite la sección — un sitio más pequeño y verdadero convierte más que uno grande y hueco.

**Requisitos de diseño verificables:**
- **DIS-01:** sistema visual propio (paleta actual naranja/oscuro como punto de partida `[Confirmar]`), tokens definidos en Tailwind config — no estilos ad-hoc por componente.
- **DIS-02:** responsive completo; navegación usable con teclado (enlaza A11Y-02).
- **DIS-03:** animaciones (GSAP) como progressive enhancement, nunca portadoras de contenido (enlaza RF-018), con `prefers-reduced-motion`.
- **DIS-04:** el rediseño no degrada Core Web Vitals respecto de la línea base medida (CRO-01 + SEO-06): LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms en móvil.

---

## Anexo A — Registro de decisiones (ADR ligero) y disidencias

| ADR | Decisión | Por qué | Descartado | Estado |
|---|---|---|---|---|
| ADR-001 | Respetar el brief: reposicionar a estudio de ingeniería, sin precios/paquetes | Decisión del cliente (fuente de verdad) | Respetar el sitio actual | **Aceptada (cliente)** |
| ADR-002 | Geo primario **es-CO**, sin i18n en v1 | WhatsApp +57, COP, proyecto en Colombia | es_MX (actual), LATAM multi | **Recomendada (Arch-Sentinel)** — confirmar |
| ADR-003 | Eliminar precios explícitos | Coherencia de posicionamiento (brief) | Mantener precios | **Aceptada con riesgo registrado:** sube fricción de conversión de bajo funnel |
| ADR-004 | Migrar CSP de nonce a **hash** + recuperar estático | Sostener el claim de performance; menos costo por request | Mantener `force-dynamic` global | **Recomendada** — confirmar |
| ADR-005 | IP confiable de plataforma + rate-limit en store compartido | Sin esto el rate-limit es decorativo (F-01) | Mantener XFF[0] + Map | **Recomendada (no negociable para SEC)** |
| ADR-006 | Eliminar credencial admin legacy tras bootstrap | Credencial durable en texto plano (F-04) | Dejarla "por si acaso" | **Recomendada** |
| ADR-007 | Rediseño multipágina con ciandt.com como modelo de referencia de patrones | Decisión del cliente; además corrige el techo SEO del single-page (SEO-07) y F-07 | Mantener single-page con anclas; clonar la estructura completa de CI&T | **Aceptada (cliente)** con regla de escala honesta (§29) y exclusión de copia de IP |
| ADR-008 | Analítica sin cookies invasivas (Vercel Analytics o Plausible) antes del rediseño | CRO no falsable sin línea base (CRO-01); compatibilidad CSP; Ley 1581 | GA4 (cookies + consent banner, peso, complejidad legal) | **Recomendada** — confirmar herramienta |
| ADR-009 | `/insights` mínimo viable en v1 (solo artículos) | El modelo de referencia usa contenido como motor SEO/autoridad; a escala ElevaForge solo artículos son sostenibles | Biblioteca completa tipo CI&T (whitepapers, podcast, webinars); no tener blog | **Recomendada** — confirmar v1 vs v1.1 y capacidad editorial real |

## Anexo B — `[PENDIENTE]` abiertos (bloquean la versión 1.0)

1. **SQL de migración + policies RLS** de Supabase (bloquea §19, F-02, TC-06).
2. **Confirmar geo** (es-CO vs MX vs LATAM) — ADR-002.
3. **Revisión legal** de privacidad/términos bajo Ley 1581/2012 — RF-007.
4. **Scope de blog/documentación** en v1 — RF-016.
5. **Analítica** (herramienta y alcance) — NF-05.
6. **SLA / RTO / RPO** objetivos y cobertura de tests mínima — §17.
7. **Confirmar** nombres de personas en copy y veracidad de métricas Lighthouse mostradas — RF-005/006.
8. **Compatibilidad** de deprecar `/api/leads` POST con integraciones externas — §12.
9. **Métrica objetivo de conversión** (número concreto) — CRO-07. Sin esto, "arreglar la conversión" no es verificable.
10. **Herramienta de analítica** (Vercel Analytics vs Plausible) — ADR-008 / RF-017.
11. **Naming del método propio** de ElevaForge para `/proceso` — §29 (decisión de marca, no la invento).
12. **Capacidad editorial real** para `/insights` (¿quién escribe y con qué frecuencia?) — ADR-009 / RF-016.
13. **Proveedor de correo** en dominio propio (SPF/DKIM/DMARC) — RF-021.
