# SRS — Evolución del Sitio Institucional de ElevaForge

**Versión:** 0.3
**Fecha:** 2026-07-22
**Autor:** Equipo ElevaForge · **Revisor técnico:** Arch-Sentinel
**Estado:** Borrador para implementación — 0 `[PENDIENTE]` bloqueantes (ver §7, Anexo B)
**Supersede a:** `SRS-ElevaForge-v0.2.md` (se conserva en el repo como historial; v0.3 es la fuente de verdad vigente)
**Norma de referencia:** IEEE 29148 (adaptada a mantenimiento evolutivo)
**Base de reconocimiento:** repo `github.com/Luisceron0/ElevaForge` en el estado real tras el cierre de v0.2 (commits hasta `a40f1a7`, rama `fix/srs-gaps-pii-logging-rf004-seo05`), más 4 capturas de pantalla de `ciandt.com/co` aportadas por el cliente el 2026-07-22 (Contacto, Sobre Nosotros, página de servicio "Digital Product Design", Home).

**Changelog v0.3 (respecto a v0.2):**
1. **Todos los `[PENDIENTE]` de v0.2 quedaron resueltos** con evidencia verificable (§7, Anexo B) — no hay ningún gate de negocio abierto.
2. **Catálogo de soluciones expandido y verificado ya implementado**: Presencia Digital (Landing Page / Sitio Web + 8 capacidades), Sistemas de Gestión (CRM / ERP configurable / PoS + Inventario / Help Desk + 8 capacidades), Software Personalizado (7 dominios de ejemplo + 3 capacidades transversales). Se documenta la **política del catálogo** como requisito explícito (§16, RF-025).
3. **§29 (Dirección de diseño) reescrito de cero.** La v0.2 citaba `ciandt.com` como modelo de referencia sin haberlo visto nunca — era una inferencia razonable pero no verificada. Esta versión analiza 4 capturas reales y especifica patrones concretos (bloques de color saturados alternados, tipografía condensada a gran escala, bloques de cifra/autoridad, iconografía en círculo) más una **propuesta de paleta expandida** (Anexo A, ADR-010) derivada de los tonos de marca ya existentes, no importada de CI&T.
4. Estado actual del sistema (§7-8) actualizado: seguridad endurecida y verificada (F-01 a F-04 y RLS cerrados con evidencia), 4 gaps adicionales de cumplimiento del SRS (PII en logs, teléfono hardcodeado, `<h1>` faltante, señal de precio residual) corregidos y con test de regresión, ADR-004 decidido (mantener `force-dynamic`).
5. Nueva sección de trabajo: **rediseño visual** (RF-026, §29) — paleta, tipografía, ritmo de secciones y motion, con la misma regla de escala honesta de v0.2 y la misma exclusión explícita de copiar identidad visual de terceros.

> **Nota de método.** Todo lo marcado `[PENDIENTE]` en v0.2 se resolvió con evidencia real (introspección de RLS, decisión explícita del cliente, o corrección de código verificada con test) — ninguno se cerró por inferencia. Las decisiones de negocio provienen del brief aprobado (incluido el catálogo detallado aportado por el cliente el 2026-07-22); las decisiones de ingeniería y sus disidencias están en el **Anexo A (ADR)**.

---

## 1. Introducción

Este SRS especifica la **evolución** (no reescritura) del sitio institucional de ElevaForge, continuando el trabajo de `SRS-ElevaForge-v0.2.md`. El sistema ya fue reposicionado de "agencia de desarrollo con paquetes de precio fijo" a "estudio de ingeniería de software" (v0.2, completado), con su capa de seguridad endurecida y verificada, y su catálogo de tres familias de soluciones ya implementado con el nivel de detalle real del negocio (soluciones nombradas + capacidades configurables, sin precios). El objetivo de esta versión es doble: (a) dejar registro formal de que la v0.2 se completó — sin dejar ningún `[PENDIENTE]` de negocio abierto — y (b) especificar un **rediseño visual** que reemplace la estética genérica actual (tarjetas blancas uniformes, un solo tono de fondo, tipografía sin jerarquía dramática) por un lenguaje visual propio, formal pero cercano, inspirado en patrones observados de estudios de transformación digital de referencia (`ciandt.com`), sin copiar su identidad.

## 2. Propósito

Proveer a un equipo de desarrollo la especificación suficiente para implementar el rediseño visual **sin un nuevo levantamiento de requerimientos**, dejando trazado qué del sistema actual se conserva intacto (todo el backend, seguridad, datos y contenido ya especificado en v0.2), qué se amplía (paleta, tipografía, patrones de sección) y qué se agrega (nuevas secciones estructurales de confianza).

## 3. Alcance

**Clasificación (decisión de ingeniería, Arch-Sentinel):**
- **Major release** en: sistema visual (paleta, tipografía, patrones de sección, motion) y estructura de bloques de contenido dentro de páginas ya existentes.
- **Sin cambios** en: arquitectura técnica, stack, capa de seguridad, modelo de datos, rutas/IA de navegación (ya fijada en v0.2 §14), catálogo de soluciones (contenido ya correcto, ver §8).

**En scope:**
- Paleta de color expandida (Anexo A, ADR-010), derivada de los tonos de marca ya existentes (naranja + azul), sin introducir hues nuevos no relacionados.
- Escala tipográfica más audaz para titulares (tamaños, tracking, quiebres de línea) — extensión de los tokens `fluid-*` ya existentes en `tailwind.config.ts`, no un sistema paralelo.
- Patrón de **secciones de color de página completa alternadas** (en vez de fondo único oscuro + tarjetas blancas) en Home, `/soluciones`, `/nosotros`, `/proceso`.
- Nuevo patrón de **bloque de cifra/autoridad** (números reales de ElevaForge, ya definidos en v0.2 RF-018, con tratamiento tipográfico más audaz).
- Nuevo patrón de **iconografía en círculo** para presentar diferenciales/capacidades sin listas planas.
- Nueva sección honesta de **stack tecnológico** (equivalente a escala real de la grilla de partners de logos del modelo de referencia).
- Verificación de que la paleta expandida **no** degrada WCAG 2.2 AA (riesgo real y explícito de este tipo de cambio, ver §23).

**Fuera de scope (explícito, sin cambios respecto a v0.2):**
- **No** se implementa e-commerce, CRM, ERP, PoS, Help Desk, portal de clientes ni SaaS **en el sitio de ElevaForge**. Estas son **soluciones que ElevaForge construye para sus clientes** — son contenido del catálogo (§8, §16 RF-025), nunca funcionalidad de `elevaforge.com`. Esta distinción es la más importante de todo el documento y se repite aquí porque el catálogo ahora nombra explícitamente esos productos.
- **No** se rediseña la IA de navegación (ya fijada en v0.2 §14) ni se agregan páginas nuevas más allá de lo ya especificado.
- **No** se migra de stack, no se toca la capa de seguridad, no se reabre ningún ADR ya decidido en v0.2 salvo indicación expresa.
- **No** se copian activos, logo, layout pixel-a-pixel ni copy de `ciandt.com` ni de ninguna referencia de diseño — ver regla de escala honesta y exclusión de IP de terceros (§29, heredada de ADR-007).

## 4. Definiciones y glosario

Se hereda el glosario completo de v0.2 §4 (Solución, Familia de soluciones, Capacidad, Diagnóstico, Lead, Outbox, Proxy, RLS, Service-role key). Se agregan:

| Término | Definición |
|---|---|
| **Solución principal** | Producto nombrado dentro de una familia (ej. "CRM", "Landing Page", "Help Desk"). Es contenido del catálogo, no una funcionalidad del sitio de ElevaForge. |
| **Dominio de aplicación** | Para Software Personalizado: un tipo de problema de ejemplo (ej. "plataforma educativa"), no una solución nombrada fija — el brief es explícito en que estas son ilustrativas, no un catálogo cerrado. |
| **Actividad de proceso** | Levantamiento, análisis, diseño, arquitectura, desarrollo, pruebas, documentación, despliegue, capacitación. Forman parte de **cualquier** proyecto de ElevaForge — nunca se presentan como servicios comerciales independientes (política del catálogo, §16 RF-025). |
| **Panel de sección** | Bloque de página completa con un color de fondo saturado propio, unidad estructural del nuevo patrón visual (§29). |
| **Bloque de cifra/autoridad** | Patrón de sección que presenta una métrica real de ElevaForge con tratamiento tipográfico destacado (extensión de RF-018). |

## 5. Stakeholders y usuarios

Sin cambios respecto a v0.2 §5 — se hereda íntegro (prospecto no técnico, administrador de contenido, equipo comercial, equipo de desarrollo, responsable de seguridad).

## 6. Objetivos del proyecto

Objetivos 1-5 de v0.2 §6 se mantienen vigentes y **ya alcanzados** (ver §7). Objetivos de esta versión:

6. Transmitir profesionalismo y formalidad **sin volverse genérico ni frío** — el sitio debe leerse como el de un estudio de ingeniería con criterio propio, no como una plantilla SaaS más.
7. Ampliar el lenguaje visual sin diluir la identidad de marca ya establecida (naranja como acento primario) ni imitar la identidad de un tercero.
8. Mantener, en el copy del catálogo expandido, la política explícita de que **ElevaForge vende soluciones, no tecnologías, módulos, capacidades ni actividades de su propio proceso de ingeniería** (restricción no negociable del brief, ver RF-025).

## 7. Estado actual del sistema

**Cambio respecto a v0.2 §7:** esta sección ya no describe un sistema con hallazgos abiertos — describe el sistema **después** de que v0.2 se implementó y verificó por completo.

- **Stack:** Next.js 16.2.11 (App Router, RSC), React 18, TypeScript, Tailwind 3, GSAP. Hosting Vercel. Sin cambios respecto a v0.2.
- **Seguridad — todos los hallazgos de v0.2 §26 (F-01 a F-04) corregidos y verificados:**
  - F-01 (rate-limit derrotable): IP confiable vía `@vercel/functions#ipAddress()` + Upstash Redis con fallback in-memory fail-open (verificado con test de outage simulado).
  - F-02 (RLS no verificable): **cerrado con evidencia real** — TC-06 corrido contra el proyecto Supabase real el 2026-07-22: `leads` → `200 []` (RLS filtra), `admin_users`/`site_content` → `401 permission denied` (sin GRANT a `anon`). Cero filas expuestas a `anon` en las 3 tablas.
  - F-03 (semilla de sesión acoplada a service-role key): corregido, fail-closed sin fallback.
  - F-04 (credencial legacy persistente): check de arranque (`instrumentation.ts`) que alerta si coexisten admins en DB y env legacy.
  - **ADR-004 decidido (mantener `force-dynamic`):** se investigó la vía de migrar CSP de nonce a hash/SRI para recuperar generación estática; Next.js 16.2 documenta que esa migración depende de una feature **experimental desde la v14** (`experimental.sri`) que no cubre scripts generados dinámicamente (el payload de hidratación RSC) — exactamente lo que necesita cualquier página con datos server-side. Se decidió no arriesgar la CSP real por una ganancia de performance todavía especulativa (sin datos reales de tráfico). `force-dynamic` se mantiene.
- **4 gaps adicionales de cumplimiento del SRS**, encontrados en un pase línea-a-línea (no por herramientas) y corregidos con test de regresión: RF-015 (username en claro en logs de login → hash SHA-256), RF-004 (teléfono WhatsApp hardcodeado → derivado de `NEXT_PUBLIC_WHATSAPP_NUMBER`), SEO-05 (`/contacto` sin `<h1>`), señal de precio residual (`priceRange` en JSON-LD, contradecía ADR-003 → eliminado).
- **Catálogo de soluciones — ya implementado con el detalle completo del brief** (ver §8, evidencia en `lib/site-content.ts:135-188`): 3 familias, cada una con soluciones nombradas y capacidades configurables, sin precios, con la política del catálogo ya reflejada en el copy ("las capacidades complementan, no constituyen un producto independiente").
- **Analítica (RF-017):** Vercel Analytics activo, eventos sin PII, compatible con la CSP.
- **Todos los `[PENDIENTE]` de negocio de v0.2 (Anexo B, 13 ítems) resueltos** por el cliente el 2026-07-22: geo es-CO, equipo real de 3 ingenieros (Luis Cerón, Jhonatan Diaz, Santiago Reyes), naming "Estándar Forge" para `/proceso`, correo Zoho (`contacto@elevaforge.com`), leads permanecen en el admin (Discord solo notifica sin PII), `/insights` diferido a v1.1, revisión legal delegada y aplicada estructuralmente. Únicos pendientes restantes son **operativos, fuera del repo**: SPF/DKIM/DMARC de Zoho en DNS, Upstash (opcional), pase de abogado.
- **Tests:** 39 unit (Vitest) + 35 e2e (Playwright, incluye axe-core WCAG AA en 8 páginas) + typecheck + lint + build, todos en verde.

## 8. Análisis del sitio existente

**Fortalezas (con evidencia, ampliado respecto a v0.2):**
- Todo lo de v0.2 §8 (acceso a datos parametrizado, defensa en profundidad, SSRF-allowlist, logging estructurado) **más** ahora verificado con evidencia real de producción (RLS confirmado, no solo diseñado).
- **El catálogo de soluciones ya tiene el detalle de negocio correcto.** Se verificó contra el brief detallado aportado por el cliente (2026-07-22) que `DEFAULT_SOLUCIONES` en `lib/site-content.ts` ya incluye: Presencia Digital → Landing Page / Sitio Web + 8 capacidades (panel admin, blog/catálogo, formularios/agenda/noticias, buscador/multilenguaje, SEO, integraciones, autenticación/gestión documental, dashboards/analítica/notificaciones); Sistemas de Gestión → CRM / ERP configurable / PoS + Inventario / Help Desk + 8 capacidades (inventario-compras-ventas-producción, RRHH/gestión documental, activos/calidad/proyectos, reservas/portales, reportes/dashboards, automatización/APIs, auditoría/control de acceso/firma electrónica, trazabilidad/geolocalización/IA); Software Personalizado → 7 dominios de ejemplo + 3 capacidades transversales. **No hay trabajo de contenido pendiente aquí** — el gap es puramente visual (ver debilidad siguiente).
- Tests reales (39 unit + 35 e2e) y CI, corregido respecto al gap de v0.2 §17.

**Debilidades (el foco de esta versión):**
- **Estética genérica de plantilla SaaS.** `SolucionesSection.tsx` (evidencia: `components/sections/SolucionesSection.tsx:35-95`) renderiza las 3 familias como tarjetas blancas idénticas sobre un único fondo claro (`bg-forge-bg-light`), con un check-icon naranja repetido y texto pequeño gris para las capacidades — el mismo patrón de "3 tarjetas con ✓" que usa cualquier plantilla de landing genérica. No hay jerarquía visual entre familias, no hay bloque de autoridad/cifra destacado, no hay ritmo de color entre secciones.
- **Un solo tono de fondo por tema** (oscuro `#19192E` en la mayoría de secciones, claro `#E9EAF5` en pocas) sin alternancia deliberada — el sitio se siente monótono en el scroll largo, a diferencia del patrón de bloques de color saturados alternados observado en el modelo de referencia.
- **Tipografía funcional pero sin declaración visual.** Los tokens `fluid-h1/h2/h3` (`tailwind.config.ts:42-45`) están bien construidos técnicamente (clamp fluido, consolidado, sin duplicados) pero se usan de forma uniforme — ningún titular usa quiebres de línea deliberados, tracking ajustado o mezcla de color dentro del mismo titular para dar énfasis, un recurso que el modelo de referencia usa consistentemente para que los titulares se sientan como declaraciones, no como texto de sección.
- Sin sección de "stack tecnológico" o señal de trust por herramientas (el modelo de referencia usa una grilla de logos de partners; ElevaForge no tiene partners de ese tipo, pero sí un stack real y verificable — Next.js, Supabase, Vercel, TypeScript — que hoy no se muestra en ningún lugar como señal de credibilidad técnica).

**Oportunidades:**
- La paleta ya tiene dos familias de color (naranja + azul) con suficiente profundidad (`blue-deep #174166`, `blue-mid`, `blue-light`, `orange-main`, `orange-deep`) para construir 3-4 paneles de sección distintos **sin inventar un hue nuevo** — solo formalizando tonos ya existentes como fondos de sección en vez de solo texto/acento.
- El sistema de tokens Tailwind (`fluid-*`) ya está consolidado (DIS-01, v0.2) — extenderlo con un paso más grande y una utilidad de tracking es una adición de bajo riesgo, no un sistema paralelo.
- El contenido real (3 casos, equipo de 3 personas, métricas Lighthouse reales) es exactamente el tipo de "prueba antes que promesa" que el patrón de bloque de cifra necesita — no hay que inventar ni inflar nada.

## 9. Funcionalidades existentes (inventario actualizado)

Se hereda el inventario EX-01 a EX-14 de v0.2 §9, con estos cambios de estado:
- **EX-06 (precios/paquetes fijos): eliminado**, confirmado (ya no existe en código ni en `site_content`).
- **EX-14 (`/api/leads` deprecado): resuelto** — GET/POST hacen `308` a `/api/contact`, sin lógica de insert duplicada.
- **Nuevo: EX-15 — Catálogo de soluciones expandido** (`SolucionesSection.tsx`, `SolucionesAdminEditor.tsx`, `lib/site-content.ts#DEFAULT_SOLUCIONES`): 3 familias con soluciones nombradas y capacidades, editable desde `/admin`. Es la funcionalidad de contenido que este documento **no** modifica en su datos, solo en su presentación visual (§11).

## 10. Funcionalidades a conservar

Se hereda íntegro v0.2 §10, **más** todo lo que en v0.2 era "funcionalidad nueva" y ya se implementó y verificó: NF-01 (sección de familias), NF-02 (`/proceso`, "Estándar Forge"), NF-03 (flujo de diagnóstico en dos pasos, RF-020), NF-04 (correcciones de seguridad), NF-05 (analítica, RF-017 vía Vercel Analytics). Estas pasan de "nuevas" a "conservar" porque su ciclo de vida ya cerró: están construidas, probadas y en producción.

## 11. Funcionalidades a modificar

- **EX-15 (Catálogo de soluciones) — solo presentación, no datos:** `SolucionesSection.tsx` se reescribe para usar el patrón de panel de sección + iconografía en círculo (§29) en vez de tarjetas blancas uniformes. `FamiliaDeSolucion`, `DEFAULT_SOLUCIONES` y `SolucionesAdminEditor` **no cambian** — el contenido ya es correcto (§8).
- **Home, `/soluciones`, `/nosotros`, `/proceso`:** reestructuración de fondo de sección a paneles de color alternados (§29) — sin cambiar el contenido textual de cada sección, solo su tratamiento visual y de layout.
- **`tailwind.config.ts`:** extensión de tokens de color (Anexo A, ADR-010) y un paso tipográfico adicional (`fluid-mega`) — extensión aditiva, no reemplazo de los tokens `DIS-01` ya consolidados.
- **`components/ui/AnimatedNumber.tsx` y su contenedor de "Trust & Authority" (Home):** tratamiento tipográfico más audaz para el bloque de cifra/autoridad (§29), conservando el requisito ya vigente de RF-018 (valor real en SSR, animación como progressive enhancement, `prefers-reduced-motion` respetado).

## 12. Funcionalidades a eliminar

Ninguna nueva respecto a v0.2 (las eliminaciones de v0.2 — precios, `/api/leads` POST duplicado, credencial legacy — ya se ejecutaron y verificaron).

## 13. Funcionalidades nuevas

- **NF-06 — Sección "Stack tecnológico".** Grilla honesta de las herramientas reales que ElevaForge usa (Next.js, Supabase, Vercel, TypeScript, Tailwind) como señal de credibilidad técnica — equivalente a escala real de la grilla de logos de partners del modelo de referencia. **No** son logos de clientes (ElevaForge no tiene el volumen ni el permiso para eso) ni afirman una alianza comercial con esos proveedores — son las tecnologías reales del proyecto, presentadas como evidencia de criterio técnico.
- **NF-07 — Bloque de cifra/autoridad rediseñado.** Extiende RF-018: mismo dato real (Lighthouse, equipo, proyectos), nuevo tratamiento tipográfico a gran escala sobre un panel de color saturado, con la regla de "prueba antes que promesa" ya establecida en CRO-03 (v0.2 §28).

## 14. Arquitectura de navegación (IA)

**Sin cambios respecto a v0.2 §14.** La IA multipágina ya está implementada y verificada (`/`, `/soluciones` + 3 familias, `/proyectos` + casos, `/proceso`, `/nosotros`, `/contacto`, `/preguntas-frecuentes`, legales, `/admin`). Este documento no agrega ni quita rutas — el rediseño ocurre **dentro** de las páginas existentes.

## 15. Modelo del dominio

Sin cambios respecto a v0.2 §15. Se aclara la relación ya implementada en código: **FamiliaDeSolucion** (3 instancias fijas: `presencia-digital`, `sistemas-de-gestion`, `software-personalizado`) → cada una con un array `soluciones: string[]` (soluciones principales nombradas, ej. "CRM") y un array `capacidades: string[]` (complementos configurables, nunca productos independientes). Para Software Personalizado, `soluciones` contiene **dominios de aplicación de ejemplo**, no un catálogo cerrado — el brief es explícito en que la lista es ilustrativa.

## 16. Requisitos funcionales

> Se heredan íntegros RF-001 a RF-021 de v0.2 §16 (todos implementados y verificados salvo indicación contraria). Se agregan:

### RF-022 — Presentación del catálogo sin jerarquía de "producto premium"
- **Descripción:** las 3 familias y sus soluciones/capacidades se presentan con paridad visual — ninguna familia se destaca como "la principal" o "la más avanzada". El orden de presentación (Presencia Digital → Sistemas de Gestión → Software Personalizado) refleja complejidad creciente del problema, no jerarquía de valor.
- **Criterios de aceptación:** las 3 familias comparten el mismo patrón de panel/tarjeta; ninguna tiene badge tipo "recomendado" o "más popular" (evitaría reintroducir el encuadre de "paquetes" que ADR-003 eliminó).

### RF-023 — Soluciones principales visibles sin ser el foco exclusivo
- **Descripción:** dentro de cada familia, las soluciones nombradas (ej. CRM, Help Desk) se listan de forma legible, pero el texto que las envuelve mantiene el foco en el **problema de negocio que resuelven**, no en sus características técnicas.
- **Criterios de aceptación:** ninguna solución nombrada tiene una lista de "features" técnicas en el sitio público (esa conversación es del diagnóstico/proceso comercial, no del sitio).

### RF-024 — Dominios de ejemplo de Software Personalizado marcados como ilustrativos
- **Descripción:** el copy debe dejar explícito que la lista de dominios (plataformas educativas, logísticas, etc.) es un conjunto de ejemplos, no un catálogo cerrado — un prospecto con un problema no listado no debe asumir que ElevaForge no lo atiende.
- **Criterios de aceptación:** el copy de la familia "Software Personalizado" incluye una frase que generalice más allá de la lista (ya presente en `descripcion` de `DEFAULT_SOLUCIONES`: "para necesidades que no encajan en un molde").

### RF-025 — Política del catálogo (no negociable, ya vigente, se formaliza como requisito verificable)
- **Descripción:** ElevaForge comercializa **soluciones**. No comercializa tecnologías, módulos, capacidades ni actividades propias del proceso de ingeniería como productos o servicios independientes. Las capacidades complementan una solución; las actividades de proceso (levantamiento, análisis, diseño, arquitectura, desarrollo, pruebas, documentación, despliegue, capacitación) forman parte del proceso normal de trabajo de cualquier proyecto.
- **Criterios de aceptación:** ningún texto del sitio público presenta una capacidad (ej. "dashboards", "geolocalización") con su propio precio, CTA de compra independiente o página propia fuera de su familia; ninguna actividad de proceso (ej. "documentación", "pruebas") aparece listada como un servicio contratable por separado.

### RF-026 — Rediseño visual (paleta, tipografía, patrones de sección)
- **Descripción:** ver especificación completa en §29. Resumen: paneles de sección de color completo alternados, escala tipográfica más audaz para titulares, bloque de cifra/autoridad rediseñado, iconografía en círculo, sección de stack tecnológico.
- **Precondiciones:** Anexo A ADR-010 (paleta expandida) confirmado por el cliente antes de implementar.
- **Criterios de aceptación:** ver §27 (criterios globales) y §29 (requisitos de diseño verificables DIS-05 a DIS-08).

## 17. Requisitos no funcionales

Se heredan íntegros de v0.2 §17 (rendimiento, disponibilidad, seguridad, escalabilidad, mantenibilidad), **todos ya cumplidos o decididos** (ver §7). Se agrega:

### Diseño
- **RNF-DIS-01:** la paleta expandida (Anexo A, ADR-010) debe mantener WCAG 2.2 AA (4.5:1 texto normal, 3:1 texto grande/iconografía) en **toda** combinación fondo/texto usada — verificación obligatoria con axe-core antes de mergear, no solo revisión visual (lección ya aprendida en v0.2: el contraste falla de forma no evidente a simple vista).
- **RNF-DIS-02:** cualquier panel de color nuevo se define como token en `tailwind.config.ts` — cero colores ad-hoc en `style={{}}` o clases arbitrarias `bg-[#...]`.

## 18. Casos de uso (resumen)

Se heredan CU-01 a CU-04 de v0.2 §18. Se agrega:

- **CU-05 Explorar familia de soluciones** (RF-022/023): prospecto entra a `/soluciones/[familia]` → ve el panel de la familia con sus soluciones nombradas y capacidades → hace clic en WhatsApp o "Solicitar diagnóstico".

## 19. Modelo conceptual de datos

**Sin cambios respecto a v0.2 §19.** El shape de `FamiliaDeSolucion` (`id`, `nombre`, `descripcion`, `soluciones: string[]`, `capacidades: string[]`) ya soporta el catálogo completo del brief — confirmado en `lib/site-content.ts:12-20` y `:135-188`. No se requiere migración de esquema para el rediseño visual: es un cambio de presentación de datos ya existentes.

## 20. Arquitectura lógica

Sin cambios respecto a v0.2 §20. `force-dynamic` se mantiene (ADR-004, §7).

## 21. Interfaces (API)

Sin cambios respecto a v0.2 §21. Ningún endpoint se agrega, modifica ni elimina en esta versión.

## 22. Requisitos SEO

Se heredan SEO-01 a SEO-12 de v0.2 §22, todos implementados y verificados (incluido SEO-05, `<h1>` en `/contacto`, cerrado en el gap-fix del 2026-07-22). Sin requisitos SEO nuevos — el rediseño visual no debe alterar la estructura semántica (`<h1>` único, jerarquía de headings, JSON-LD) ya correcta.

## 23. Requisitos de accesibilidad

Se heredan A11Y-01 a A11Y-05 de v0.2 §23 (WCAG 2.2 AA, navegación por teclado, contraste, `alt`/labels, `prefers-reduced-motion`), todos verificados con axe-core en 8 páginas. Se agrega:

- **A11Y-06:** los paneles de sección con paleta expandida (§29) deben re-verificarse con axe-core como parte del mismo pipeline — no es un chequeo nuevo, es una repetición obligatoria del A11Y-03 existente sobre las páginas que cambien de fondo.

## 24. Casos de prueba (extracto, nuevos)

| ID | Vinculado | Prueba | Resultado esperado |
|---|---|---|---|
| TC-11 | RNF-DIS-01 | axe-core sobre cada panel de color nuevo | 0 violaciones de contraste |
| TC-12 | RF-022 | inspección de `/soluciones` | ninguna familia con badge "recomendado"/"más popular" |
| TC-13 | RF-025 | grep de copy público | ninguna capacidad o actividad de proceso con CTA de compra propio |
| TC-14 | DIS-04 (heredado v0.2) | Lighthouse post-rediseño | CWV no degrada respecto a la línea base de Fase 5 |

## 25. Matriz de trazabilidad (extracto, nuevos)

| Requisito | Origen | Diseño | Prueba |
|---|---|---|---|
| RF-025 | Política del catálogo (brief, 2026-07-22) | Copy de `SolucionesSection.tsx` | TC-13 |
| RF-026 | Objetivo 6/7 (este documento) | §29, `tailwind.config.ts` | TC-11, TC-14 |
| RNF-DIS-01 | Lección de v0.2 (contraste no evidente a simple vista) | axe-core en CI | TC-11 |

## 26. Riesgos

Se heredan los riesgos de v0.2 §26 ya mitigados (F-01 a F-08, todos corregidos o decididos). Riesgos nuevos de esta versión:

**R-01 [MEDIO] Paleta expandida sin disciplina de tokens degrada a caos visual.**
Impacto: si cada componente define su propio color ad-hoc en vez de usar tokens, el sitio termina con más inconsistencia que antes del rediseño (regresión respecto al trabajo de consolidación de DIS-01 en v0.2). Mitigación: RNF-DIS-02 (todo color nuevo es un token Tailwind, cero `style={{}}`/arbitrary values). Indicador temprano: grep de `bg-\[#` o `style={{.*color` en componentes.

**R-02 [MEDIO] Paneles pastel con texto blanco fallan contraste.**
Impacto: el modelo de referencia usa fondos pastel claros (celeste, malva) — si ElevaForge adopta tonos pastel similares y mantiene texto blanco (patrón usado hoy en las secciones oscuras), el contraste falla silenciosamente (el mismo tipo de bug ya encontrado y corregido en v0.2 con los botones CTA naranja). Mitigación: RNF-DIS-01 + regla explícita en §29 (paneles claros siempre usan texto oscuro, nunca blanco). Indicador temprano: TC-11.

**R-03 [BAJO] Catálogo expandido se lee como venta de tecnología/módulos.**
Impacto: al nombrar explícitamente CRM/ERP/PoS/Help Desk y listar 8+ capacidades por familia, el copy corre el riesgo de sonar como un catálogo técnico de productos en vez de un mapa de problemas de negocio — justo lo que el brief prohíbe explícitamente. Mitigación: RF-025 como requisito verificable + revisión de copy antes de publicar cualquier cambio a `DEFAULT_SOLUCIONES`.

## 27. Criterios de aceptación (globales)

Se heredan los 6 criterios de v0.2 §27 (ya cumplidos). Nuevos para esta versión:

7. La paleta expandida pasa axe-core (0 violaciones de contraste) en las páginas rediseñadas.
8. Ningún color nuevo existe fuera de `tailwind.config.ts` (cero valores arbitrarios en componentes).
9. El catálogo de soluciones (contenido) no cambia — solo su presentación visual.
10. Ninguna capacidad o actividad de proceso se presenta con CTA de compra independiente (RF-025/TC-13).
11. Core Web Vitals no degradan respecto a la línea base de Fase 5 (TC-14).

---

## 28. Requisitos de conversión (CRO)

Se hereda íntegro v0.2 §28 (CRO-01 a CRO-07), con estado actualizado: CRO-01 (línea base) **ya tiene el mecanismo de medición activo** (RF-017/Vercel Analytics desplegado) — la ventana de datos reales sigue pendiente de tiempo de tráfico, no de trabajo de desarrollo. CRO-07 (métrica objetivo numérica) sigue sin definir por decisión explícita del cliente ("el objetivo es cumplir el SRS", no una prioridad ahora) — no es un `[PENDIENTE]` bloqueante, es una decisión ya tomada de no fijar ese número todavía.

## 29. Dirección de diseño y modelo de referencia

**Cambio de método respecto a v0.2:** la versión anterior citaba `ciandt.com` como modelo de referencia sin haberlo visto — una inferencia razonable a partir de su reputación de mercado, pero no verificada. Esta versión se basa en **4 capturas de pantalla reales** aportadas por el cliente el 2026-07-22 (Contacto, Sobre Nosotros, página de servicio "Digital Product Design", Home de `ciandt.com`/`ciandt.com/co`).

**Alcance de la referencia (sin cambios respecto a ADR-007):** patrones de estructura, jerarquía tipográfica y ritmo de color. **Exclusión no negociable:** no se copia paleta, logo, copy, activos ni layout pixel-a-pixel de CI&T — es referencia de patrones, no fuente de material (propiedad intelectual de terceros).

### Patrones observados (evidencia de las 4 capturas)

| Patrón observado | Dónde se ve | Adaptación honesta a ElevaForge |
|---|---|---|
| **Paneles de sección de color completo alternados** (coral saturado → azul marino oscuro → malva/púrpura profundo → celeste pastel → blanco), no un solo tono de fondo | Las 4 páginas — cada sección tiene un fondo saturado propio, nunca dos secciones seguidas del mismo color | ElevaForge alterna entre tonos **ya existentes en su marca** (naranja, azul profundo, azul claro pastel, oscuro institucional) en vez de un fondo único — ver ADR-010 |
| **Titulares condensados a gran escala con quiebre de línea deliberado** ("CON TAC T US", "MÁS DE 8.000 BUILDERS DE IA") | Contacto (hero), Sobre Nosotros (bloque "TODAY") | Extender `fluid-h1`/`fluid-display` con un paso más grande (`fluid-mega`) para el titular principal de Home y de cada familia; permitir quiebre de línea manual en 2-3 titulares clave, no en todo el sitio |
| **Mezcla de color dentro de un mismo titular** para dar énfasis a una cifra o palabra | "MÁS DE **8.000** BUILDERS...", números en color de acento dentro de texto blanco | Aplicar al bloque de cifra/autoridad rediseñado (NF-07): el número real (ej. "**100** Lighthouse", "**3** ingenieros") en `orange-main`, el resto del texto en blanco/oscuro según el panel |
| **Bloque de cifra/autoridad sobre panel saturado**, con logos de reconocimiento externo (Gartner/Forrester) | Sobre Nosotros, Home | ElevaForge no tiene reconocimiento externo de ese tipo — el equivalente honesto es su propia cifra real (Lighthouse, proyectos, equipo), **nunca** imitar el patrón con logos de terceros que no aplican (regla de escala honesta, ya en v0.2) |
| **Iconografía en círculo** para presentar features/diferenciales en 3 columnas | Página de servicio ("Workflow optimization", "New revenue streams", "Customer engagement") | Aplicar a las capacidades de cada familia de soluciones (hoy listadas como texto plano separado por "·") y a la sección de diferenciales existente |
| **Formas geométricas abstractas como textura de fondo** (triángulos diagonales, blobs orgánicos) dentro de paneles de color, nunca como el lenguaje visual completo | Contacto (triángulo malva sobre celeste), Home (blob en panel malva) | Uso opcional y moderado — 1-2 secciones, no en todo el sitio; formas simples (círculos, no triángulos que evocarían el logo/mark de CI&T) |
| **Fotografía enmascarada en formas orgánicas** (círculos, blobs) en vez de rectángulos | Sobre Nosotros, Contacto | ElevaForge no tiene banco de fotografía de equipo real más allá de lo ya usado — este patrón se marca como **opcional, futuro**, no parte de este rediseño (no inventar fotos que no existen) |
| **Grilla de logos de partners/tecnologías en escala de grises** | Página de servicio ("Partnerships": Google, AWS, Salesforce, Microsoft...) | NF-06 — grilla honesta del stack tecnológico real de ElevaForge (Next.js, Supabase, Vercel, TypeScript, Tailwind), **no** logos de clientes ni de alianzas comerciales inexistentes |
| **Botones tipo píldora** (completamente redondeados) en vez de esquinas rectas/ligeramente redondeadas | Todas las capturas | Adoptar para CTAs primarios (`CTAButton.tsx`) — cambio de bajo riesgo, alto impacto de "sensación de marca" |
| **Voz de copy que combina formalidad corporativa con una frase punch/memorable ocasional** ("PARECE MAGIA, PERO EN REALIDAD ES SOLO MALDITAMENTE BUENA MATEMÁTICA") | Home (panel malva) | Adoptar con moderación **y sin groserías** — una frase de cierre memorable por página como máximo, revisada por el cliente antes de publicar (es contenido, no diseño — no se decide unilateralmente) |
| **Barra de navegación minimalista** (hamburguesa + logo + búsqueda/selector) | Home, todas | Fuera de scope — la navegación de ElevaForge ya está fijada en v0.2 §14 con su propia regla (máx. 6 ítems, CTA persistente) |

**Regla de escala honesta (sin cambios respecto a v0.2 §26/§29):** ninguna sección del modelo de referencia se adopta si ElevaForge no puede llenarla con contenido real y mantenerla. Ante la duda, se omite la sección.

### Requisitos de diseño verificables

Se heredan DIS-01 a DIS-04 de v0.2 §29 (todos implementados: escala tipográfica consolidada, responsive, motion como progressive enhancement, CWV). Nuevos:

- **DIS-05:** cada página que adopte el patrón de paneles de sección usa como mínimo 3 tonos de fondo distintos en el scroll (no monótono), y nunca dos secciones consecutivas del mismo color.
- **DIS-06:** todo color de fondo de panel es un token en `tailwind.config.ts` (RNF-DIS-02) — verificado antes de mergear.
- **DIS-07:** todo panel con fondo claro/pastel usa texto oscuro (`forge-bg-dark` o equivalente AA-safe); todo panel con fondo oscuro/saturado usa texto claro verificado contra ese fondo específico — nunca blanco por defecto sin chequear (lección de v0.2: el bug de contraste del botón CTA no era visible a simple vista).
- **DIS-08:** los patrones "opcionales, futuro" de la tabla anterior (fotografía enmascarada) quedan explícitamente fuera de esta iteración — no se implementan como relleno visual sin contenido real detrás.

---

## Anexo A — Registro de decisiones (ADR ligero) y disidencias

Se heredan ADR-001 a ADR-009 de v0.2 (todos con estado final, ver changelog). Nuevo:

| ADR | Decisión | Por qué | Descartado | Estado |
|---|---|---|---|---|
| ADR-010 | Paleta expandida derivada de los tonos de marca ya existentes: reutilizar `forge-blue-deep` (`#174166`, ya en el sistema) como fondo de panel "autoridad/cifra"; reutilizar `forge-bg-light` (`#E9EAF5`, ya en el sistema) como panel "contenido claro"; reutilizar `forge-orange-main` como panel "energía/CTA" (con texto `forge-bg-dark`, ya verificado AA); **agregar un único token nuevo** `forge-peach-tint` (tono cálido muy claro derivado del naranja, ej. `#FBEADD`, a verificar contraste) para un panel "humano/equipo" | Reproduce el ritmo de paneles alternados del modelo de referencia (§29) usando casi exclusivamente tonos que ya existen en el sistema — mínimo riesgo de deriva de marca, máxima coherencia con el naranja/azul ya establecido | Importar la paleta literal de CI&T (Carnation/Sail/Mauve/Tyrian Purple/East Bay) — descartado explícitamente: sería copiar identidad de un tercero (violaría la exclusión de ADR-007) y diluiría la marca ya construida de ElevaForge | **Recomendada — confirmar antes de implementar** (valor exacto de `forge-peach-tint` y verificación de contraste pendiente de la fase de implementación) |

## Anexo B — `[PENDIENTE]` abiertos

**Ninguno de negocio.** Los 13 ítems de v0.2 Anexo B están resueltos (ver changelog, §7). Quedan únicamente pendientes **operativos, fuera del repo, no bloqueantes para este SRS:**
1. SPF/DKIM/DMARC de Zoho Mail en DNS.
2. Upstash KV para rate-limit compartido (opcional, recomendado antes de escalar a múltiples instancias).
3. Pase de abogado sobre `/privacidad` y `/terminos` antes de v1.0 productiva.
4. **Nuevo de esta versión:** confirmación del cliente sobre ADR-010 (paleta expandida) antes de iniciar la implementación del rediseño visual.
