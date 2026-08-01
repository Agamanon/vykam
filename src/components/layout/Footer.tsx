'use client'

// ================================================================
// FOOTER — Pie de página
//
// Es 'use client' porque necesita usePathname para no renderizarse
// en la página de login (que tiene su propio diseño).
// ================================================================

import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Footer() {
  const pathname = usePathname()

  // La página de login tiene su propio layout sin footer
  if (pathname === '/login') return null

  return (
    <footer>
      <div className="container">
        <div className="footer-brand">
          <Image
            src="/images/vykam-icon.svg"
            alt="Vykam"
            width={44}
            height={44}
            className="footer-brand-icon"
          />
          <span className="footer-wordmark-col">
            <span className="footer-wordmark">
              <span className="footer-wordmark-v">v</span>y
              <span className="footer-wordmark-k">k</span>am
            </span>
            <span className="footer-tagline">COMPRAR · VENDER</span>
          </span>
        </div>
        <p>Tu plataforma de confianza para comprar y vender</p>

        <p>&copy; 2026 Vykam. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
