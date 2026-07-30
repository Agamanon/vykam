import type { Metadata } from 'next'
import { Poppins, Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// Fuente Poppins con todos los pesos usados en el prototipo
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

// Fuentes usadas en el hero rediseñado de la home
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vykam | Marketplace de Papel',
  description: 'Marketplace B2B de productos de papel',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
