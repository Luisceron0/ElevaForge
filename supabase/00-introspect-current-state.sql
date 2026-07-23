-- ═══════════════════════════════════════════════════════════════════════
-- PASO 1 — Ejecutar PRIMERO, antes de tocar nada.
-- Pega el resultado de estas 3 queries en el chat si querés que reconcilie
-- este script con lo que ya existe en vez de partir de cero.
-- No modifica nada — es 100% de solo lectura.
-- ═══════════════════════════════════════════════════════════════════════

-- 1. ¿Existen las tablas? ¿Qué columnas tienen?
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('leads', 'admin_users', 'site_content')
order by table_name, ordinal_position;

-- 2. ¿RLS está activado en esas tablas?
select relname as table_name, relrowsecurity as rls_enabled, relforcerowsecurity as rls_forced
from pg_class
where relname in ('leads', 'admin_users', 'site_content')
  and relnamespace = 'public'::regnamespace;

-- 3. ¿Qué policies existen hoy (si las hay)?
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('leads', 'admin_users', 'site_content');
