'use client'

// ================================================================
// NAVBAR — Barra de navegación principal
//
// 'use client' es necesario porque:
//   1. Usamos useState para manejar el buscador
//   2. Usamos usePathname para saber en qué página estamos
//   3. Cargamos Bootstrap JS (que necesita el DOM del navegador)
// ================================================================

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { searchProductos, PRODUCTOS } from '@/lib/productos'
import { Producto } from '@/types'
import supabase from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  // Estado del buscador
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<Producto[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [focused, setFocused] = useState(false)

  // Estado de autenticación
  const [usuario, setUsuario] = useState<User | null>(null)

  // Referencia para detectar clics fuera del buscador y cerrarlo
  const searchWrapperRef = useRef<HTMLDivElement>(null)

  // Carga Bootstrap JS en el cliente (necesita el DOM del navegador)
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js').catch(console.error)
  }, [])

  // Obtiene la sesión actual y escucha cambios de auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session?.user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // Cierra los resultados al hacer clic fuera del buscador
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setMostrarResultados(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // La página de login tiene su propio diseño sin navbar
  if (pathname === '/login' || pathname === '/registro' || pathname.startsWith('/dashboard')) return null

  // Se ejecuta cada vez que el usuario escribe en el buscador
  function handleBuscar(valor: string) {
    setQuery(valor)
    if (valor.trim() === '') {
      setResultados([])
      setMostrarResultados(false)
      return
    }
    const encontrados = searchProductos(valor)
    setResultados(encontrados)
    setMostrarResultados(true)
  }

  // Al presionar Enter, navega al primer resultado
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (resultados.length > 0) {
        router.push(`/producto/${resultados[0].slug}`)
        setMostrarResultados(false)
        setQuery('')
      }
    }
  }

  // Al hacer clic en "Buscar", navega al primer resultado
  function handleClickBuscar() {
    if (resultados.length > 0) {
      router.push(`/producto/${resultados[0].slug}`)
      setMostrarResultados(false)
      setQuery('')
    }
  }

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Vykam - Comprar y Vender" />
        </Link>

        {/* Botón hamburguesa para móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          {/* Menú de categorías */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-grid-3x3-gap-fill me-1"></i>Menú
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className={`dropdown-item ${pathname === '/categoria/papel-higienico' ? 'active-category' : ''}`}
                    href="/categoria/papel-higienico"
                  >
                    <i className="bi bi-box-seam me-2"></i>Papel Higiénico
                  </Link>
                </li>
                <li>
                  <Link
                    className={`dropdown-item ${pathname === '/categoria/toalla-de-papel' ? 'active-category' : ''}`}
                    href="/categoria/toalla-de-papel"
                  >
                    <i className="bi bi-box-seam me-2"></i>Toalla de Papel
                  </Link>
                </li>
                <li>
                  <Link
                    className={`dropdown-item ${pathname === '/categoria/servilletas' ? 'active-category' : ''}`}
                    href="/categoria/servilletas"
                  >
                    <i className="bi bi-box-seam me-2"></i>Servilletas
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Botón de sesión */}
          {usuario ? (
            <div className="nav-item dropdown">
              <a
                className="iniciarsesion dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i>
                {usuario.email?.split('@')[0]}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
  <li>
    <Link className="dropdown-item" href="/dashboard">
      <i className="bi bi-grid-fill me-2"></i>Mi dashboard
    </Link>
  </li>
  <li><hr className="dropdown-divider" /></li>
  <li>
    <button
      className="dropdown-item text-danger"
      onClick={() => supabase.auth.signOut()}
    >
      <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
    </button>
  </li>
</ul>
            </div>
          ) : (
            <Link className="iniciarsesion" href="/login">
              <i className="bi bi-person-circle me-1"></i>Iniciar sesión
            </Link>
          )}

          {/* Buscador con resultados desplegables */}
          <div className="search-form-wrapper" ref={searchWrapperRef}>
            <form
              className="d-flex search-form"
              role="search"
              onSubmit={e => {
                e.preventDefault()
                handleClickBuscar()
              }}
            >
              <div className="position-relative">
                <i className="bi bi-search search-icon"></i>
                <input
                  id="searchInputGlobal"
                  className="form-control"
                  placeholder="Buscar productos..."
                  aria-label="Search"
                  type="search"
                  autoComplete="off"
                  value={query}
                  onChange={e => handleBuscar(e.target.value)}
                  onFocus={() => {
                    setFocused(true)
                    if (query.trim() !== '') setMostrarResultados(true)
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                className="btn btn-search"
                type="button"
                onClick={handleClickBuscar}
              >
                Buscar
              </button>
            </form>

            {/* Dropdown de resultados */}
            <div
              id="searchResultsGlobal"
              className={`search-results-dropdown ${mostrarResultados || (focused && query.trim() === '') ? 'show' : ''}`}
            >
              {query.trim() === '' ? (
                <>
                  <div className="search-results-header">
                    <span>Productos destacados</span>
                  </div>
                  {PRODUCTOS.map(producto => (
                    <Link
                      key={producto.id}
                      href={`/producto/${producto.slug}`}
                      className="search-result-item"
                      onClick={() => {
                        setFocused(false)
                        setQuery('')
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        className="search-result-img"
                      />
                      <div className="search-result-info">
                        <div className="search-result-category">
                          {producto.categoria.replace(/-/g, ' ')}
                        </div>
                        <div className="search-result-name">{producto.nombre}</div>
                        <div className="search-result-desc">{producto.descripcion}</div>
                      </div>
                      <i className="bi bi-arrow-right search-result-arrow"></i>
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {resultados.length === 0 ? (
                    <div className="search-no-results">
                      <i className="bi bi-search"></i>
                      <p>
                        No se encontraron productos para{' '}
                        <strong>&ldquo;{query}&rdquo;</strong>
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="search-results-header">
                        <span>
                          <strong>{resultados.length}</strong>{' '}
                          {resultados.length === 1
                            ? 'resultado encontrado'
                            : 'resultados encontrados'}
                        </span>
                      </div>
                      {resultados.map(producto => (
                        <Link
                          key={producto.id}
                          href={`/producto/${producto.slug}`}
                          className="search-result-item"
                          onClick={() => {
                            setMostrarResultados(false)
                            setQuery('')
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={producto.imagenUrl}
                            alt={producto.nombre}
                            className="search-result-img"
                          />
                          <div className="search-result-info">
                            <div className="search-result-category">
                              {producto.categoria.replace(/-/g, ' ')}
                            </div>
                            <div className="search-result-name">{producto.nombre}</div>
                            <div className="search-result-desc">{producto.descripcion}</div>
                          </div>
                          <i className="bi bi-arrow-right search-result-arrow"></i>
                        </Link>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
