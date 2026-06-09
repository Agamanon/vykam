'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

const RUTAS_SIN_NAVBAR = ['/login', '/registro', '/reset-password']

export default function NavbarWrapper() {
  const pathname = usePathname()
  if (RUTAS_SIN_NAVBAR.some(r => pathname.startsWith(r))) return null
  return <Navbar />
}
