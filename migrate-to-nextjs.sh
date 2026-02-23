#!/bin/bash

# Script de migración de Angular a Next.js para ElevaForge
# Ejecutar desde la raíz del proyecto: bash migrate-to-nextjs.sh

echo "🔧 Iniciando migración a Next.js..."

# 1. Crear backup de la carpeta src si existe
if [ -d "src" ]; then
    echo "📦 Creando backup de src..."
    mkdir -p backup
    cp -r src backup/src-angular-backup
fi

# 2. Mover fuentes a public/fonts
echo "📂 Moviendo fuentes..."
mkdir -p public/fonts
if [ -d "src/assets/fonts" ]; then
    cp src/assets/fonts/* public/fonts/
fi

# 3. Eliminar archivos Angular
echo "🗑️  Eliminando archivos Angular..."
rm -rf src angular.json tsconfig.app.json tsconfig.spec.json .angular dist karma.conf.js .browserslistrc

# 4. Renombrar archivos de configuración
echo "📝 Configurando archivos Next.js..."
if [ -f "package-nextjs.json" ]; then
    rm package.json package-lock.json 2>/dev/null
    mv package-nextjs.json package.json
fi

if [ -f "tsconfig-nextjs.json" ]; then
    rm tsconfig.json 2>/dev/null
    mv tsconfig-nextjs.json tsconfig.json
fi

# 5. Renombrar README
if [ -f "README-NEXTJS.md" ]; then
    rm README.md 2>/dev/null
    mv README-NEXTJS.md README.md
fi

# 6. Eliminar node_modules para reinstalar
echo "🧹 Limpiando node_modules..."
rm -rf node_modules

# 7. Crear archivo .env.local si no existe
if [ ! -f ".env.local" ]; then
    echo "📄 Creando .env.local..."
    cp .env.local.example .env.local
fi

# 8. Instalar dependencias
echo "📥 Instalando dependencias de Next.js..."
npm install

echo ""
echo "✅ ¡Migración completada!"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env.local con tus credenciales de Supabase y WhatsApp"
echo "2. Ejecuta: npm run dev"
echo "3. Abre http://localhost:3000"
echo ""
echo "Para crear la tabla de leads en Supabase, ejecuta este SQL:"
echo "----------------------------------------"
cat << 'EOF'
create table public.leads (
  id          uuid default gen_random_uuid() primary key,
  nombre      text not null,
  email       text not null,
  empresa     text,
  mensaje     text,
  origen      text default 'landing_elevaforge',
  created_at  timestamptz default now()
);

alter table public.leads enable row level security;

create policy "Solo service role puede insertar"
  on public.leads for insert
  with check (false);
EOF
echo "----------------------------------------"
