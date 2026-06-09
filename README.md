# Vykam

Marketplace B2B de productos de papel para Chile (papel higiénico, toalla de papel, servilletas).
Conecta compradores y proveedores mediante un sistema de ofertas directas.

## Stack

- **Next.js 15** (App Router) — framework frontend y backend
- **TypeScript** — tipado estático para reducir errores
- **Tailwind CSS** — estilos utilitarios
- **Supabase** — base de datos PostgreSQL + autenticación
- **Vercel** — hosting y despliegue continuo

## Cómo correr el proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Correr en modo desarrollo (http://localhost:3000)
npm run dev

# 3. Compilar para producción
npm run build
```

## Variables de entorno

Copia el archivo de ejemplo y completa los valores reales de tu proyecto Supabase:

```bash
cp .env.example .env.local
```

Luego edita `.env.local` con tus credenciales (las encuentras en
Settings → API dentro de tu proyecto Supabase):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

**Importante:** `.env.local` está ignorado por Git. Nunca lo subas al repositorio.

## Estructura del proyecto

```
src/
├── app/              # Rutas y páginas (App Router de Next.js)
├── components/
│   ├── ui/           # Componentes base reutilizables (botones, inputs, badges)
│   ├── layout/       # Estructura de página: Navbar y Footer
│   ├── product/      # ProductCard y ProductDetail
│   └── offers/       # Tabla de ofertas, formulario de publicación, filas de compra/venta directa
├── lib/              # Utilidades compartidas: cliente Supabase (supabase.ts), helpers (utils.ts)
├── types/            # Tipos TypeScript que reflejan la base de datos (database.ts)
└── hooks/            # Custom hooks de React: useUser.ts, useOffers.ts
```

## Estado actual

El proyecto está en **fase inicial de desarrollo**. La estructura base está definida;
los componentes y páginas aún no están implementados.
