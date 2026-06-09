'use client'

// ================================================================
// FOOTER — Pie de página
//
// Es 'use client' porque necesita usePathname para no renderizarse
// en la página de login (que tiene su propio diseño).
// ================================================================

import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  // La página de login tiene su propio layout sin footer
  if (pathname === '/login') return null

  return (
    <footer>
      <div className="container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-blanco.svg" alt="Vykam" className="footer-logo" />
        <p>Tu plataforma de confianza para comprar y vender</p>

        {/* Redes sociales */}
        <div className="social-links">
          <a href="#" aria-label="Facebook">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#" aria-label="Twitter/X">
            <i className="bi bi-twitter-x"></i>
          </a>
          <a href="#" aria-label="WhatsApp">
            <i className="bi bi-whatsapp"></i>
          </a>
        </div>

        <p>&copy; 2026 Vykam. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
