// ================================================================
// DATOS DE PRODUCTOS Y CATEGORÍAS DE VYKAM
// Este archivo reemplaza la base de datos mientras no tengamos
// Supabase conectado. Los datos vienen del buscador.js del prototipo.
// ================================================================

import { Categoria, Producto } from '@/types'

// Las 3 categorías del marketplace
export const CATEGORIAS: Categoria[] = [
  {
    id: 1,
    nombre: 'Papel Higiénico',
    slug: 'papel-higienico',
    descripcion: 'Encuentra las mejores marcas de papel higiénico al mejor precio',
    icono: 'box-seam-fill',
  },
  {
    id: 2,
    nombre: 'Toalla de Papel',
    slug: 'toalla-de-papel',
    descripcion: 'Toallas absorbentes para hogar y negocio de las mejores marcas',
    icono: 'layers-fill',
  },
  {
    id: 3,
    nombre: 'Servilletas',
    slug: 'servilletas',
    descripcion: 'Servilletas suaves y resistentes para cualquier ocasión',
    icono: 'stars',
  },
]

// Los 13 productos del catálogo
export const PRODUCTOS: Producto[] = [
  // ===== PAPEL HIGIÉNICO (6 productos) =====
  {
    id: 1,
    nombre: 'Noble',
    marca: 'Noble',
    slug: 'papel-higienico-noble-48-rollos',
    categoria: 'papel-higienico',
    descripcion: 'Pack de 48 rollos. Suave, resistente y de alta calidad para el hogar.',
    detalle: 'Doble hoja · 23 mts · manga 48 rollos',
    cantidad: 48,
    unidad: 'rollos',
    imagenUrl: '/images/papel-higienico-noble-48-rollos.jpeg',
    badgeIcono: 'star-fill',
    badgeTexto: 'Popular',
    destacado: true,
  },
  {
    id: 2,
    nombre: 'Confort',
    marca: 'Confort',
    slug: 'papel-higienico-confort-48-rollos',
    categoria: 'papel-higienico',
    descripcion: 'Pack de 48 rollos. Máxima suavidad y absorción para tu comodidad diaria.',
    detalle: 'Doble hoja · 22 mts · manga 48 rollos',
    cantidad: 48,
    unidad: 'rollos',
    imagenUrl: '/images/papel-higienico-confort-48-rollos.jpg',
    badgeIcono: 'heart-fill',
    badgeTexto: 'Favorito',
    destacado: false,
  },
  {
    id: 3,
    nombre: 'Favorita',
    marca: 'Favorita',
    slug: 'papel-higienico-favorita-48-rollos',
    categoria: 'papel-higienico',
    descripcion: 'Pack de 48 rollos. Calidad económica con excelente rendimiento.',
    detalle: 'Acolchado doble hoja · 22 mts · manga 48 rollos',
    cantidad: 48,
    unidad: 'rollos',
    imagenUrl: '/images/papel-higienico-favorita-48-rollos.jpg',
    badgeIcono: 'tag-fill',
    badgeTexto: 'Oferta',
    destacado: false,
  },
  {
    id: 4,
    nombre: 'Scott',
    marca: 'Scott',
    slug: 'papel-higienico-scott-48-rollos',
    categoria: 'papel-higienico',
    descripcion: 'Pack de 48 rollos. Marca reconocida por su durabilidad y suavidad.',
    detalle: 'Rinde Max doble hoja · 25 mts · manga 48 rollos',
    cantidad: 48,
    unidad: 'rollos',
    imagenUrl: '/images/papel-higienico-scott-48-rollos.jpg',
    badgeIcono: 'award-fill',
    badgeTexto: 'Premium',
    destacado: false,
  },
  {
    id: 5,
    nombre: 'Florax',
    marca: 'Florax',
    slug: 'papel-higienico-florax-48-rollos',
    categoria: 'papel-higienico',
    descripcion: 'Pack de 48 rollos. Suave fragancia y textura premium para tu hogar.',
    detalle: 'Doble hoja · 30 mts · manga 48 rollos',
    cantidad: 48,
    unidad: 'rollos',
    imagenUrl: '/images/papel-higienico-florax-48-rollos.jpg',
    badgeIcono: 'flower1',
    badgeTexto: 'Aromático',
    destacado: false,
  },
  {
    id: 6,
    nombre: 'Elite',
    marca: 'Elite',
    slug: 'papel-higienico-elite-48-rollos',
    categoria: 'papel-higienico',
    descripcion: 'Pack de 48 rollos. Triple hoja, máxima resistencia y suavidad superior.',
    detalle: 'Doble hoja · 20 mts · manga 48 rollos',
    cantidad: 48,
    unidad: 'rollos',
    imagenUrl: '/images/papel-higienico-elite-48-rollos.jpeg',
    badgeIcono: 'gem',
    badgeTexto: 'Calidad',
    destacado: false,
  },

  // ===== TOALLA DE PAPEL (4 productos) =====
  {
    id: 7,
    nombre: 'Nova',
    marca: 'Nova',
    slug: 'toalla-de-papel-nova-24-rollos',
    categoria: 'toalla-de-papel',
    descripcion: 'Pack de 24 rollos absorbentes. Ideal para el hogar y negocio.',
    detalle: 'Doble hoja · 12,5 mts · manga 24 rollos',
    cantidad: 24,
    unidad: 'rollos',
    imagenUrl: '/images/toalla-de-papel-nova-24-rollos.jpg',
    badgeIcono: 'lightning-fill',
    badgeTexto: 'Destacado',
    destacado: false,
  },
  {
    id: 8,
    nombre: 'Tork',
    marca: 'Tork',
    slug: 'toalla-de-papel-tork-16-rollos',
    categoria: 'toalla-de-papel',
    descripcion: 'Pack de 16 rollos absorbentes. Ideal para el hogar y negocio.',
    detalle: 'Doble hoja · 24 mts · manga 16 rollos',
    cantidad: 16,
    unidad: 'rollos',
    imagenUrl: '/images/toalla-de-papel-tork-16-rollos.jpg',
    badgeIcono: 'lightning-fill',
    badgeTexto: 'Destacado',
    destacado: true,
  },
  {
    id: 9,
    nombre: 'Abolengo',
    marca: 'Abolengo',
    slug: 'toalla-de-papel-abolengo-6-rollos',
    categoria: 'toalla-de-papel',
    descripcion: 'Pack de 6 rollos. Alta duración, 100 mts de papel por rollo.',
    detalle: 'Doble hoja · 100 mts · manga 6 rollos',
    cantidad: 6,
    unidad: 'rollos',
    imagenUrl: '/images/toalla-de-papel-abolengo-6-rollos.jpg',
    badgeIcono: 'award-fill',
    badgeTexto: 'Premium',
    destacado: false,
  },
  {
    id: 10,
    nombre: 'Elite',
    marca: 'Elite',
    slug: 'toalla-de-papel-elite-12-rollos',
    categoria: 'toalla-de-papel',
    descripcion: 'Pack de 12 rollos. Calidad superior para uso intensivo.',
    detalle: 'Doble hoja · 24 mts · manga 12 rollos',
    cantidad: 12,
    unidad: 'rollos',
    imagenUrl: '/images/toalla-de-papel-elite-12-rollos.jpg',
    badgeIcono: 'gem',
    badgeTexto: 'Calidad',
    destacado: false,
  },

  // ===== SERVILLETAS (3 productos) =====
  {
    id: 11,
    nombre: 'Nova',
    marca: 'Nova',
    slug: 'servilleta-nova-300-unidades',
    categoria: 'servilletas',
    descripcion: 'Pack de 300 unidades. Suaves y resistentes para cualquier ocasión.',
    detalle: 'Paquete · 300 unidades',
    cantidad: 300,
    unidad: 'unidades',
    imagenUrl: '/images/servilleta-nova-300-unidades.jpg',
    badgeIcono: 'heart-fill',
    badgeTexto: 'Favorito',
    destacado: true,
  },
  {
    id: 12,
    nombre: 'Swan',
    marca: 'Swan',
    slug: 'servilleta-swan-300-unidades',
    categoria: 'servilletas',
    descripcion: 'Pack de 300 unidades. Elegancia y calidad en cada servilleta.',
    detalle: 'Paquete · 300 unidades',
    cantidad: 300,
    unidad: 'unidades',
    imagenUrl: '/images/servilleta-swan-300-unidades.jpg',
    badgeIcono: 'star-fill',
    badgeTexto: 'Popular',
    destacado: false,
  },
  {
    id: 13,
    nombre: 'Giulietta',
    marca: 'Giulietta',
    slug: 'servilleta-giulietta-300-unidades',
    categoria: 'servilletas',
    descripcion: 'Pack de 300 unidades. Diseño premium para ocasiones especiales.',
    detalle: 'Paquete · 300 unidades',
    cantidad: 300,
    unidad: 'unidades',
    imagenUrl: '/images/servilleta-giulietta-300-unidades.jpg',
    badgeIcono: 'award-fill',
    badgeTexto: 'Premium',
    destacado: false,
  },
]

// ----------------------------------------------------------------
// FUNCIONES HELPER
// Estas funciones facilitan buscar y filtrar productos.
// ----------------------------------------------------------------

// Busca un producto por su slug (para la URL). Retorna undefined si no existe.
export function getProductoBySlug(slug: string): Producto | undefined {
  return PRODUCTOS.find(p => p.slug === slug)
}

// Retorna todos los productos de una categoría específica por su slug.
export function getProductosByCategoria(categoriaSlug: string): Producto[] {
  return PRODUCTOS.filter(p => p.categoria === categoriaSlug)
}

// Busca una categoría por su slug. Retorna undefined si no existe.
export function getCategoriaBySlug(slug: string): Categoria | undefined {
  return CATEGORIAS.find(c => c.slug === slug)
}

// Retorna solo los productos marcados como destacados (para la página home).
export function getProductosDestacados(): Producto[] {
  return PRODUCTOS.filter(p => p.destacado)
}

// Busca productos por texto en nombre, categoría, descripción y detalle.
// Todas las palabras del query deben aparecer para que el producto coincida.
export function searchProductos(query: string): Producto[] {
  if (!query || query.trim() === '') return []

  // Dividimos el query en palabras y buscamos cada una
  const palabras = query.toLowerCase().trim().split(/\s+/)

  return PRODUCTOS.filter(producto => {
    // Juntamos todo el texto del producto en un solo string para buscar
    const textoCompleto = [
      producto.nombre,
      producto.marca,
      CATEGORIAS.find(c => c.slug === producto.categoria)?.nombre ?? '',
      producto.descripcion,
      producto.detalle,
    ]
      .join(' ')
      .toLowerCase()

    // El producto aparece si TODAS las palabras están en su texto
    return palabras.every(palabra => textoCompleto.includes(palabra))
  })
}
