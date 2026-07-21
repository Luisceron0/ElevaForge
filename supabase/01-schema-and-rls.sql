-- ═══════════════════════════════════════════════════════════════════════
-- ElevaForge — esquema + RLS deny-by-default (RNF-SEC-02 / F-02 / TC-06)
--
-- CONTEXTO: este archivo no existía en el repo pese a que README.md lo
-- referenciaba ("Ejecuta supabase-migrations.sql en SQL Editor") — de ahí
-- que el SRS marcara "RLS no verificable" como PENDIENTE bloqueante.
--
-- DISEÑO: se auditó el código real (todas las rutas app/api/**) y NINGUNA
-- ruta de servidor usa la anon key para leer/escribir estas tablas — todo
-- pasa por SUPABASE_SERVICE_ROLE_KEY (que bypassa RLS por diseño de
-- Supabase). El cliente anon-key (lib/supabase/client.ts) existe en el
-- repo pero no lo importa ningún componente ni página. Esta app tampoco
-- usa Supabase Auth (la sesión admin es una cookie HMAC propia, no
-- auth.users) — por lo tanto ni 'anon' ni 'authenticated' necesitan NINGÚN
-- acceso a estas tablas. La política correcta es deny-by-default total:
-- activar RLS y no crear ninguna policy de lectura/escritura para esos
-- roles. Esto es intencional, no un olvido — no "arregles" esto agregando
-- una policy permisiva sin volver a auditar el código primero.
--
-- CÓMO EJECUTAR:
--   1. Corré antes 00-introspect-current-state.sql (solo lectura) y
--      confirmá si las tablas ya existen con datos reales.
--   2. Si las tablas YA EXISTEN con datos: los CREATE TABLE de abajo son
--      no-destructivos (IF NOT EXISTS), pero revisá que los tipos de
--      columna coincidan con lo que trajo el paso 1 antes de aplicar la
--      parte de RLS.
--   3. Si es una base nueva o preferís partir de cero (como preguntaste):
--      corré este archivo completo tal cual en el SQL Editor de Supabase.
--   4. Verificá con TC-06: con la anon key, `select * from leads` debe
--      devolver 0 filas (no un error — RLS deniega silenciosamente, lo
--      cual es el comportamiento esperado y correcto).
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
  key text primary key check (key in ('about', 'projects', 'soluciones')),
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

-- ═══════════════════════════════════════════════════════════════════════
-- Verificación TC-06 (correr con la ANON key, no con la service-role key):
--   select count(*) from public.leads;        -- debe dar 0 filas, no error
--   select count(*) from public.admin_users;   -- debe dar 0 filas, no error
--   select count(*) from public.site_content;  -- debe dar 0 filas, no error
-- ═══════════════════════════════════════════════════════════════════════
