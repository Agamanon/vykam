// Página de inicio: hero, categorías, productos destacados y características
import { getProductosDestacados, CATEGORIAS, getProductosByCategoria } from '@/lib/productos'
import ProductCard from '@/components/product/ProductCard'
import CategoryCard from '@/components/product/CategoryCard'

export default function HomePage() {
  const destacados = getProductosDestacados()

  const categoriasConConteo = CATEGORIAS.map(cat => ({
    categoria: cat,
    count: getProductosByCategoria(cat.slug).length,
  }))

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container hero-content text-center">
          <h1>Bienvenido a Vykam</h1>
          <p>
            Vykam es el sitio web número 1º en Market Place de Chile respecto a 3 tipos de productos
            de papel del mercado (Papel Higiénico, Toalla de Papel y Servilletas). Descubre nuestra
            selección de productos de papel. Compra y vende con confianza en la plataforma líder de
            Chile.
          </p>
        </div>
      </section>

      {/* ===== CATEGORÍAS ===== */}
      <section style={{ padding: '4rem 0 0' }}>
        <div className="container">
          <div className="section-header">
            <h2>Categorías</h2>
            <div className="section-divider"></div>
            <p>Explora por tipo de producto</p>
          </div>
          <div className="row justify-content-center">
            {categoriasConConteo.map(({ categoria, count }) => (
              <CategoryCard key={categoria.id} categoria={categoria} count={count} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTOS DESTACADOS ===== */}
      <main className="main-content">
        <div className="container">
          <div className="section-header">
            <h2>Productos Destacados</h2>
            <div className="section-divider"></div>
            <p>
              Explora nuestro catálogo de productos seleccionados especialmente para ti
            </p>
          </div>
          <div className="row">
            {destacados.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
