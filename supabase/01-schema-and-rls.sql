-- ═══════════════════════════════════════════════════════════════════════
-- ElevaForge — esquema + RLS deny-by-default (RNF-SEC-02 / F-02 / TC-06)
--
-- ESTADO CONFIRMADO (introspección del usuario, 2026-07-22):
-- La query #3 de 00-introspect-current-state.sql confirmó que las policies
-- deny-by-default YA EXISTEN en la base real. Para cada una de las 3 tablas
-- (leads, admin_users, site_content) hay exactamente 4 policies, todas
-- restringidas al rol {service_role}:
--     <tabla>_service_role_select / _insert / _update / _delete
-- NO existe ninguna policy para 'anon' ni 'authenticated' → esos roles
-- quedan denegados por defecto (RLS enabled + sin policy = deny). Este es
-- exactamente el diseño correcto. NO agregues policies para anon/authenticated
-- sin volver a auditar el código primero.
--
-- LO ÚNICO NO CONFIRMADO: la query #2 (relrowsecurity) no se aportó, así que
-- no hay confirmación explícita de que RLS esté *habilitado* en cada tabla.
-- Policies sin RLS habilitado = policies ignoradas (todo permitido). Los
-- statements `alter table ... enable row level security` de abajo son
-- IDEMPOTENTES: correrlos de nuevo no rompe nada y GARANTIZA que RLS quede
-- habilitado. Es seguro re-ejecutar este archivo completo.
--
-- POR QUÉ deny-by-default es correcto acá: se auditó todo app/api/** y
-- NINGUNA ruta usa la anon key sobre estas tablas — todo pasa por
-- SUPABASE_SERVICE_ROLE_KEY (que bypassa RLS). lib/supabase/client.ts
-- (anon key) existe pero no lo importa ningún componente. La app no usa
-- Supabase Auth (la sesión admin es cookie HMAC propia).
--
-- CÓMO EJECUTAR (reconciliación, no destructivo):
--   1. Este archivo NO crea policies → no toca ni pisa las 4 policies
--      service_role que ya existen por tabla. Solo asegura tablas + índices
--      (IF NOT EXISTS) y RLS habilitado (idempotente).
--   2. Corré el archivo completo en el SQL Editor de Supabase.
--   3. Verificá TC-06 con la ANON key (ver bloque al final): un
--      `select * from leads` debe devolver 0 filas (deny silencioso), no
--      un error ni filas reales.
-- ═══════════════════════════════════════════════════════════════════════

-- ── leads ──────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text,
  empresa text,
  mensaje text,
  servicio text,
  presupuesto text,
  contacto_pref text,
  consent boolean not null default false,
  origen text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  attempts integer not null default 0,
  last_attempt_at timestamptz,
  discord_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at);

alter table public.leads enable row level security;
-- Sin policies para anon/authenticated a propósito: deny-by-default total.
-- Solo el service-role (bypassa RLS) lee/escribe, desde app/api/contact,
-- app/api/leads, app/api/admin/leads*, app/api/workers/*.

-- ── admin_users ────────────────────────────────────────────────────────
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- Sin policies para anon/authenticated: deny-by-default total. Solo el
-- service-role lee/escribe, desde lib/security/admin-session.ts,
-- lib/security/admin-access.ts y app/api/admin/users*.

-- ── site_content ───────────────────────────────────────────────────────
create table if not exists public.site_content (
  key text primary key check (key in ('about', 'soluciones')),
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
-- Sin policies para anon/authenticated: deny-by-default total. El
-- contenido público (Home, /nosotros) se sirve vía Server Components que
-- leen con el service-role (lib/site-content.ts:getSiteContent) y lo
-- inyectan al HTML ya renderizado — el navegador nunca consulta
-- site_content directamente con la anon key. Escritura solo vía
-- app/api/admin/content (sesión admin + service-role).
--
-- MIGRACIÓN §11/§12 (packages→soluciones): si tu tabla site_content ya
-- tiene una fila con key='packages' de antes de este cambio, el constraint
-- de arriba la va a rechazar en cualquier UPDATE futuro sobre esa fila
-- (no en filas existentes — Postgres no revalida CHECK en filas que no se
-- tocan). Para limpiarla del todo, una vez que hayas confirmado en el
-- panel admin que "Familias de soluciones" ya tiene el contenido correcto:
--   delete from public.site_content where key = 'packages';
--
-- MIGRACIÓN ADR-012 (eliminación de `projects`): la sección de proyectos
-- entregados/en curso se retiró del sitio, así que la clave `projects` ya no
-- existe en el modelo de contenido. Igual que arriba, el CHECK de este script
-- NO se aplica solo a una tabla ya creada (`create table if not exists` no la
-- altera): hay que correr los 3 pasos, en este orden, una sola vez:
--
--   delete from public.site_content where key = 'projects';
--   alter table public.site_content drop constraint if exists site_content_key_check;
--   alter table public.site_content
--     add constraint site_content_key_check check (key in ('about', 'soluciones'));
--
-- El DELETE va primero: con la fila `projects` todavía presente, el ADD
-- CONSTRAINT falla al validar las filas existentes.
--
-- Las imágenes que esa fila referenciaba (bucket `site-assets`, prefijo
-- `projects/`) quedan huérfanas en Storage. NO se borran automáticamente
-- (`saveSiteContent` solo depura assets de las claves vigentes) — si querés
-- recuperar ese espacio, borralas a mano desde el panel de Storage después de
-- confirmar que el sitio quedó bien.

-- ═══════════════════════════════════════════════════════════════════════
-- Verificación TC-06 — CIERRA el hallazgo F-02 (potencialmente CRÍTICO).
-- Correr con la ANON key (NEXT_PUBLIC_SUPABASE_ANON_KEY), NO con la
-- service-role key. Opción A: desde el SQL Editor con `set role anon;`.
-- Opción B (más fiel, prueba el borde real): desde curl contra la REST API
-- de Supabase con el header apikey = anon key:
--
--   curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/leads?select=*" \
--     -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
--
-- Resultado esperado (RLS deny-by-default funcionando): [] (array vacío)
-- O un 401/403 de permisos — ambos significan cero filas expuestas a
-- `anon`. Lo único que reabre F-02 es que devuelva FILAS reales.
--
-- CORRIDO 2026-07-22 contra el proyecto real — F-02 CERRADO:
--   leads          → 200 []                              (RLS filtra)
--   admin_users    → 401 permission denied for table      (sin GRANT a anon)
--   site_content   → 401 permission denied for table      (sin GRANT a anon)
-- ═══════════════════════════════════════════════════════════════════════
