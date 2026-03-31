# ElevaForge Landing Page

Landing page de ElevaForge construida con Next.js 14, Tailwind CSS y Supabase.

## Requisitos

- Node.js 18+
- npm o pnpm

## Instalación

1. **Limpiar proyecto Angular anterior (si existe):**

```bash
rm -rf src angular.json tsconfig.app.json tsconfig.spec.json .angular node_modules package-lock.json
```

2. **Renombrar archivos de configuración:**

```bash
mv package-nextjs.json package.json
mv tsconfig-nextjs.json tsconfig.json
```

3. **Mover fuentes:**

```bash
mkdir -p public/fonts
cp /tmp/elevaforge-backup/fonts/* public/fonts/ 2>/dev/null || true
# O si la fuente está en src/assets/fonts:
# cp src/assets/fonts/* public/fonts/
```

4. **Instalar dependencias:**

```bash
npm install
```

5. **Configurar variables de entorno:**

```bash
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase y número de WhatsApp
```

6. **Crear/actualizar tablas en Supabase:**

Ejecutar en el SQL Editor de Supabase:

```sql
-- Ejecuta el script completo incluido en el repositorio:
-- supabase-migrations.sql
```

Este script agrega:
- Campos completos de leads (telefono, servicio, estado, etc.)
- Tabla site_content para contenido editable del panel admin
- Tabla admin_users para múltiples administradores

7. **Iniciar servidor de desarrollo:**

```bash
npm run dev
```

## Panel de administración

- URL: /admin/login
- Variables requeridas:
  - ADMIN_SESSION_SEED (requerido en producción)
- Variables opcionales de migración (legacy):
  - ADMIN_USERNAME
  - ADMIN_PASSWORD

El login valida credenciales contra la tabla `admin_users` en Supabase.

### Migración a múltiples admins (Supabase)

1. Ejecuta `supabase-migrations.sql` en SQL Editor.
2. Define `ADMIN_SESSION_SEED` en local y producción.
3. Inicia sesión con admin legacy (si aún lo usas).
4. En el panel admin, sección **Administradores**, crea los nuevos usuarios.
5. Verifica que el nuevo usuario pueda entrar en `/admin/login`.
6. Elimina `ADMIN_USERNAME` y `ADMIN_PASSWORD` de tus variables cuando ya no sean necesarios.

Desde el panel puedes:
- Revisar leads completos y actualizar estado
- Crear administradores y activar/desactivar cuentas
- Editar sección Quiénes somos
- Editar paquetes
- Editar proyectos (incluyendo imageUrl)

## Estructura del Proyecto

```
/
├── app/
│   ├── layout.tsx              # Layout principal con fuentes y metadata
│   ├── page.tsx                # Página principal
│   ├── globals.css             # Estilos globales con Tailwind
│   └── api/
│       ├── leads/route.ts      # API para guardar leads
│       └── health/route.ts     # Health check del servidor
│
├── components/
│   ├── sections/               # Secciones de la landing
│   │   ├── HeroSection.tsx
│   │   ├── ForgeStandards.tsx
│   │   ├── AutonomySection.tsx
│   │   └── RoadmapSection.tsx
│   ├── ui/                     # Componentes de UI reutilizables
│   │   ├── CTAButton.tsx
│   │   ├── Badge.tsx
│   │   ├── SectionWrapper.tsx
│   │   └── GlowDivider.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Cliente browser
│   │   └── server.ts           # Cliente servidor
│   ├── whatsapp.ts             # Helper para links de WhatsApp
│   └── validations.ts          # Schemas de validación con Zod
│
├── types/
│   └── lead.ts                 # Tipos TypeScript
│
├── public/
│   └── fonts/
│       └── Humanist531BT-BlackA.woff2
│
└── tailwind.config.ts          # Configuración con Design System
```

## Design System

### Colores (forge-*)

- `bg-dark`: #19192E - Fondo principal oscuro
- `bg-light`: #E9EAF5 - Secciones alternas claras
- `blue-primary`: #3185C5 - Azul principal
- `blue-deep`: #174166 - Azul profundo
- `blue-light`: #49ACED - Azul claro / acentos
- `blue-mid`: #306A9C - Azul medio / bordes
- `orange-main`: #F97300 - CTAs principales
- `orange-gold`: #FBA81E - Highlights / hover
- `card-bg`: #1F1F3A - Fondo de cards

### Sombras

- `shadow-cta`: Glow naranja para botones
- `shadow-card`: Sombra profunda para cards
- `shadow-glow-blue`: Glow azul para hover

## Scripts

```bash
npm run dev     # Desarrollo
npm run build   # Build de producción
npm run start   # Servidor de producción
npm run lint    # Linting
```

## Objetivos de Lighthouse

- Performance: 100
- SEO: 100
- Best Practices: 100
- Accessibility: 90+

## Preparación para separar Frontend/Backend

Este proyecto está diseñado para facilitar la separación futura:

- **Frontend**: Todo en `/app`, `/components`, `/public`
- **Backend**: API routes en `/app/api`, lógica en `/lib`
- **Shared**: Types en `/types`

Para separar, puedes:
1. Mover `/app/api` a un proyecto backend separado (Express, Fastify, etc.)
2. Actualizar las llamadas del frontend para apuntar al nuevo backend
3. Mantener los types compartidos como un paquete npm

## Licencia

© 2025 ElevaForge. Todos los derechos reservados.
