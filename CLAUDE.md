# CLAUDE.md — Vykam Project

## ⚠️ Leer antes de tocar cualquier archivo

Este proyecto usa **Next.js con App Router** y puede tener breaking changes respecto a versiones anteriores. Antes de escribir código, lee la guía relevante en `node_modules/next/dist/docs/`.

---

## Stack técnico

- **Framework**: Next.js 14+ con App Router (`src/app/`)
- **Lenguaje**: TypeScript
- **Estilos**: CSS global en `src/app/globals.css` (sin Tailwind, sin CSS Modules)
- **Base de datos**: Supabase (PostgreSQL + Auth)
- **Cliente Supabase**: `src/lib/supabase.ts` — importar siempre como `import supabase from '@/lib/supabase'`
- **Bootstrap**: Solo para componentes del navbar (dropdown, collapse). Íconos: `bootstrap-icons`

---

## Estructura del proyecto

```
src/
├── app/
│   ├── categoria/[slug]/page.tsx
│   ├── dashboard/page.tsx        ← Dashboard de usuario y admin
│   ├── login/page.tsx            ← Página de login
│   ├── producto/[slug]/page.tsx
│   ├── registro/page.tsx         ← Página de registro
│   ├── globals.css               ← TODOS los estilos van aquí
│   ├── layout.tsx
│   └── page.tsx                  ← Home
├── components/
│   ├── layout/                   ← Navbar, Footer
│   ├── offers/                   ← Componentes de ofertas
│   │   ├── BuyDirectRow.tsx
│   │   ├── EmptyState.tsx
│   │   ├── OfertasSection.tsx
│   │   ├── OfferTable.tsx
│   │   ├── PublishOfferForm.tsx
│   │   └── SellDirectRow.tsx
│   ├── product/
│   │   ├── CategoryCard.tsx
│   │   └── ProductCard.tsx
│   └── ui/
├── hooks/
│   └── useOfertas.ts             ← Hook principal de ofertas (usa Supabase)
├── lib/
│   ├── productos.ts              ← Catálogo estático de productos
│   └── supabase.ts               ← Cliente Supabase
└── types/                        ← Tipos TypeScript compartidos
```

---

## Base de datos Supabase

### Tablas existentes

| Tabla | Descripción |
|-------|-------------|
| `perfiles` | Perfil de cada usuario. Se crea automáticamente con trigger al registrarse. Campos: `id`, `nombre_completo`, `avatar_url`, `rol` ('usuario' o 'admin'), `created_at` |
| `ofertas_venta` | Ofertas de venta publicadas. Campos: `id`, `producto_slug`, `vendedor`, `vendedor_id`, `cantidad`, `precio`, `total`, `created_at` |
| `ofertas_compra` | Ofertas de compra publicadas. Campos: `id`, `producto_slug`, `comprador`, `comprador_id`, `cantidad`, `precio`, `total`, `estado`, `created_at` |
| `compras` | Historial de compras (tabla legacy, no usada activamente) |
| `productos` | Tabla legacy, no usada. El catálogo está en `src/lib/productos.ts` |

### RLS (Row Level Security)
Todas las tablas tienen RLS activado. Las políticas permiten:
- `perfiles`: cada usuario lee y edita solo el suyo
- `ofertas_venta`: lectura pública, escritura/eliminación solo del `vendedor_id`
- `ofertas_compra`: lectura pública, escritura/eliminación solo del `comprador_id`

---

## Reglas importantes

### Autenticación
- Usar siempre `supabase.auth.getSession()` o `supabase.auth.getUser()` para verificar sesión
- El Navbar oculta el navbar de Bootstrap en `/login`, `/registro` y cualquier ruta `/dashboard/*`
- El dashboard redirige a `/login` si no hay sesión activa

### Ofertas
- Las ofertas son **persistentes** en Supabase (no en memoria)
- El hook `useOfertas(productoSlug)` recibe el slug del producto y carga las ofertas desde Supabase
- Un usuario **no puede publicar dos ofertas del mismo tipo en el mismo producto**
- Un usuario **no puede comprarse ni venderse a sí mismo**
- El nombre del vendedor/comprador se precarga automáticamente desde `perfiles.nombre_completo` y es de **solo lectura**

### Productos
- El catálogo de productos está definido estáticamente en `src/lib/productos.ts`
- Para convertir un `producto_slug` a nombre legible usar la función `nombreProducto(slug)` del dashboard
- Los slugs siguen el patrón: `{categoria}-{marca}-{cantidad}-{unidad}` (ej: `papel-higienico-noble-48-rollos`)

### Estilos
- **No usar Tailwind**. Todos los estilos van en `src/app/globals.css`
- Las clases del dashboard tienen prefijo `dash-`
- Las clases de ofertas tienen prefijos `new-offer-`, `market-`, `btn-action`
- Los estados del dashboard usan `.dash-estado.activo` (verde), `.dash-estado.activo-compra` (azul), `.dash-estado.admin` (morado)

### Roles de usuario
- `rol: 'usuario'` → acceso normal al dashboard
- `rol: 'admin'` → acceso adicional a secciones "Usuarios" y "Todos los productos" en el dashboard
- El rol se cambia directamente en Supabase → Table Editor → perfiles

---

## Comandos útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Linter
npm run lint
```

---

## Qué NO hacer

- ❌ No modificar `src/lib/supabase.ts` — el cliente ya está configurado con las variables de entorno
- ❌ No agregar tablas nuevas en Supabase sin actualizar este archivo
- ❌ No usar `localStorage` ni `sessionStorage` — la sesión la maneja Supabase
- ❌ No mover el catálogo de productos fuera de `src/lib/productos.ts` sin actualizar `useOfertas.ts` y el dashboard
- ❌ No crear estilos en archivos separados — todo va en `globals.css`
- ❌ No mostrar el Navbar de Bootstrap dentro del dashboard (tiene su propio sidebar)
