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
            Descubre nuestra selección de productos de calidad.
            Compra y vende con confianza en la plataforma líder.
          </p>
          <div className="hero-badges">
            <div className="hero-badge">
              <i className="bi bi-shield-check me-1"></i> Calidad Garantizada
            </div>
            <div className="hero-badge">
              <i className="bi bi-truck me-1"></i> Envío Rápido
            </div>
            <div className="hero-badge">
              <i className="bi bi-star-fill me-1"></i> Mejores Precios
            </div>
          </div>
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

      {/* ===== CARACTERÍSTICAS ===== */}
      <section className="features">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-truck"></i>
                </div>
                <h5>Envío Rápido</h5>
                <p>Recibe tus productos en tiempo récord con nuestro servicio de entrega</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5>Compra Segura</h5>
                <p>Tus transacciones están protegidas con los más altos estándares de seguridad</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-headset"></i>
                </div>
                <h5>Soporte 24/7</h5>
                <p>Nuestro equipo está disponible para ayudarte en cualquier momento</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
