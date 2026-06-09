// ================================================================
// PRODUCTCARD — Tarjeta de producto reutilizable
//
// Se usa en la página home y en las páginas de categoría.
// Es un Server Component (sin 'use client') porque no necesita
// estado ni eventos del navegador — solo muestra datos.
// ================================================================

import Link from 'next/link'
import { Producto } from '@/types'
import { CATEGORIAS } from '@/lib/productos'

interface Props {
  producto: Producto
}

export default function ProductCard({ producto }: Props) {
  // Busca el nombre de la categoría para mostrarlo en la tarjeta
  const categoria = CATEGORIAS.find(c => c.slug === producto.categoria)

  return (
    <div className="product-item col-md-6 col-lg-4">
      <div className="product-card">
        {/* Imagen con enlace al producto */}
        <Link href={`/producto/${producto.slug}`} className="text-decoration-none">
          <div className="product-image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={producto.imagenUrl} alt={producto.nombre} />
            {/* Badge flotante (Popular, Favorito, etc.) */}
            <span className="product-badge">
              <i className={`bi bi-${producto.badgeIcono}`}></i>
              {producto.badgeTexto}
            </span>
          </div>
        </Link>

        {/* Información del producto */}
        <div className="product-body">
          <div className="product-category">{categoria?.nombre}</div>
          <h5 className="product-title">{producto.nombre}</h5>
          <p className="product-description">{producto.descripcion}</p>

          {/* Botón que lleva a la página de detalle del producto */}
          <Link href={`/producto/${producto.slug}`} className="btn-product">
            <span>Ver producto</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  )
}
