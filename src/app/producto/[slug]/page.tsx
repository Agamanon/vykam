// Página de detalle de producto con tablas de ofertas
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductoBySlug, getCategoriaBySlug, PRODUCTOS } from '@/lib/productos'
import OfertasSection from '@/components/offers/OfertasSection'

// Next.js 16: params es una Promise
interface Props {
  params: Promise<{ slug: string }>
}

// Pre-genera las rutas estáticas para cada producto
export function generateStaticParams() {
  return PRODUCTOS.map(p => ({ slug: p.slug }))
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params

  const producto = getProductoBySlug(slug)
  if (!producto) notFound()

  const categoria = getCategoriaBySlug(producto.categoria)

  return (
    <>
      {/* ===== MIGA DE PAN ===== */}
      <section className="breadcrumb-section">
        <div className="container">
          <div className="breadcrumb-custom">
            <Link href="/"><i className="bi bi-house-fill"></i> Inicio</Link>
            <i className="bi bi-chevron-right" style={{ fontSize: '0.7rem' }}></i>
            <Link href={`/categoria/${producto.categoria}`}>{categoria?.nombre}</Link>
            <i className="bi bi-chevron-right" style={{ fontSize: '0.7rem' }}></i>
            <span>{producto.nombre}</span>
          </div>
        </div>
      </section>

      {/* ===== ENCABEZADO DEL PRODUCTO ===== */}
      <section className="product-header">
        <div className="container">
          <div className="row align-items-center g-4">
            {/* Columna izquierda: imagen */}
            <div className="col-lg-6">
              <div className="product-image-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={producto.imagenUrl} alt={producto.nombre} />
              </div>
            </div>

            {/* Columna derecha: información */}
            <div className="col-lg-6">
              {/* Badge (Popular, Favorito, etc.) */}
              <span className="product-badge-large">
                <i className={`bi bi-${producto.badgeIcono}`}></i>
                {producto.badgeTexto}
              </span>

              {/* Nombre de la categoría */}
              <div className="product-category-tag">{categoria?.nombre}</div>

              {/* Título del producto */}
              <h1 className="product-title-main">{producto.nombre}</h1>

              {/* Subtítulo con el detalle */}
              <p className="product-subtitle">{producto.detalle}</p>

              {/* Chips de características */}
              <div className="product-features">
                <span className="feature-chip">
                  <i className="bi bi-shield-check"></i> Calidad Garantizada
                </span>
                <span className="feature-chip">
                  <i className="bi bi-truck"></i> Envío Rápido
                </span>
                <span className="feature-chip">
                  <i className="bi bi-arrow-repeat"></i> Compra y Venta
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TABLAS DE OFERTAS (componente cliente) ===== */}
      <OfertasSection producto={producto} />
    </>
  )
}
