// Página de categoría: muestra todos los productos de una categoría
import { notFound } from 'next/navigation'
import {
  getCategoriaBySlug,
  getProductosByCategoria,
  CATEGORIAS,
} from '@/lib/productos'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'

// Next.js 16: params es una Promise
interface Props {
  params: Promise<{ slug: string }>
}

// Pre-genera las rutas estáticas para cada categoría
export function generateStaticParams() {
  return CATEGORIAS.map(cat => ({ slug: cat.slug }))
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params

  const categoria = getCategoriaBySlug(slug)
  if (!categoria) notFound()

  const productos = getProductosByCategoria(slug)

  return (
    <>
      {/* ===== ENCABEZADO DE CATEGORÍA ===== */}
      <section className="page-header">
        <div className="container page-header-content">
          <div className="row align-items-center">
            <div className="col-md-9">
              {/* Miga de pan */}
              <div className="breadcrumb-custom mb-3">
                <Link href="/"><i className="bi bi-house-fill"></i> Inicio</Link>
                <i className="bi bi-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                <span>{categoria.nombre}</span>
              </div>
              <h1>{categoria.nombre}</h1>
              <p>{categoria.descripcion}</p>
            </div>
            <div className="col-md-3 text-end d-none d-md-block">
              <i className={`bi bi-${categoria.icono} header-icon`}></i>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BARRA DE FILTROS (pills de categorías) ===== */}
      <div className="filters-bar">
        <div className="container">
          <div className="filters-content">
            <span className="product-count">
              <strong>{productos.length}</strong> productos encontrados
            </span>
            <div className="category-pills">
              {CATEGORIAS.map(cat => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className={`category-pill ${cat.slug === slug ? 'active' : ''}`}
                >
                  <i className={`bi bi-${cat.icono} me-1`}></i>
                  {cat.nombre}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== GRID DE PRODUCTOS ===== */}
      <main className="main-content" style={{ padding: '3rem 0 5rem' }}>
        <div className="container">
          <div className="row">
            {productos.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
