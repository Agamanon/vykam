// ================================================================
// CATEGORYCARD — Tarjeta de categoría para la página home
//
// Server Component: solo muestra información, no necesita estado.
// ================================================================

import Link from 'next/link'
import { Categoria } from '@/types'

interface Props {
  categoria: Categoria
  count: number  // número de productos en esta categoría
}

export default function CategoryCard({ categoria, count }: Props) {
  return (
    <div className="col-md-4">
      <Link href={`/categoria/${categoria.slug}`} className="category-card">
        {/* Ícono de la categoría */}
        <div className="category-card-icon">
          <i className={`bi bi-${categoria.icono}`}></i>
        </div>

        <h3>{categoria.nombre}</h3>
        <p>{categoria.descripcion}</p>

        {/* Contador de productos */}
        <div className="mt-3">
          <span className="category-pill active">
            {count} productos
          </span>
        </div>
      </Link>
    </div>
  )
}
