import type { MetadataRoute } from 'next'
import { CATEGORIAS, PRODUCTOS } from '@/lib/productos'

const BASE_URL = 'https://vykam.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const home: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  const categorias: MetadataRoute.Sitemap = CATEGORIAS.map(cat => ({
    url: `${BASE_URL}/categoria/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const productos: MetadataRoute.Sitemap = PRODUCTOS.map(producto => ({
    url: `${BASE_URL}/producto/${producto.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  return [...home, ...categorias, ...productos]
}
