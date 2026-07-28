// Página de inicio: hero, categorías, productos destacados y características
import Link from 'next/link'
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
        <div className="container hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot"></span>
              Líder en market place de papel · Chile
            </div>
            <h1 className="hero-title">
              Bienvenido a
              <br />
              <span className="hero-title-accent">Vykam</span>
            </h1>
            <p className="hero-subtitle">
              <b>N.º 1 en Chile</b> en 3 categorías del mercado del papel — papel higiénico, toalla de
              papel y servilletas. Descubre nuestra selección de productos de papel y compra o vende
              con confianza en la plataforma líder del país.
            </p>
            <div className="hero-cta-row">
              <a className="hero-btn hero-btn-primary" href="#productos-destacados">
                Explorar productos
              </a>
              <Link className="hero-btn hero-btn-secondary" href="/dashboard">
                Vender en Vykam
              </Link>
            </div>
            <div className="hero-categories">
              <div className="hero-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Papel higiénico
              </div>
              <div className="hero-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M8 4v16" />
                </svg>
                Toalla de papel
              </div>
              <div className="hero-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h10" />
                </svg>
                Servilletas
              </div>
            </div>
          </div>

          <div className="hero-seal-wrap">
            <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path id="heroRingPath" d="M 150,150 m -110,0 a 110,110 0 1,1 220,0 a 110,110 0 1,1 -220,0" />
              </defs>
              <circle cx="150" cy="150" r="128" fill="none" stroke="#E4DDD0" strokeWidth="1" />
              <circle cx="150" cy="150" r="110" fill="none" stroke="#C88A4C" strokeWidth="1.5" strokeDasharray="2 5" />
              <circle cx="150" cy="150" r="92" fill="#2952E3" />
              <text
                fontFamily="IBM Plex Mono, monospace"
                fontSize="11.5"
                fontWeight="500"
                letterSpacing="3"
                fill="#8B5A24"
              >
                <textPath href="#heroRingPath" startOffset="2%">
                  MARKET PLACE DE PAPEL · CHILE · MARKET PLACE DE PAPEL · CHILE ·
                </textPath>
              </text>
              <text
                x="150"
                y="140"
                textAnchor="middle"
                fontFamily="Space Grotesk, sans-serif"
                fontWeight="700"
                fontSize="46"
                fill="#ffffff"
              >
                N.°1
              </text>
              <text
                x="150"
                y="168"
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
                fontSize="12.5"
                fill="#DCE6FB"
                letterSpacing="0.5"
              >
                en 3 categorías
              </text>
            </svg>
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
      <main className="main-content" id="productos-destacados">
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
