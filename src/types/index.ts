// ================================================================
// TIPOS DE TYPESCRIPT PARA VYKAM
// ================================================================

export interface Categoria {
  id: number
  nombre: string
  slug: string
  descripcion: string
  icono: string
}

export interface Producto {
  id: number
  nombre: string
  marca: string
  slug: string
  categoria: string
  descripcion: string
  detalle: string
  cantidad: number
  unidad: string
  imagenUrl: string
  badgeIcono: string
  badgeTexto: string
  destacado: boolean
}

export interface OfertaVenta {
  id: string
  vendedor: string
  vendedor_id: string
  cantidad: number
  precio: number
  total: number
}

export interface OfertaCompra {
  id: string
  comprador: string
  comprador_id: string
  cantidad: number
  precio: number
  total: number
}

declare module 'html2pdf.js'