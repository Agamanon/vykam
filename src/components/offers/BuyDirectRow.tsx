'use client'

import { useState, useEffect } from 'react'
import { OfertaVenta } from '@/types'
import supabase from '@/lib/supabase'

interface Props {
  oferta: OfertaVenta
  usuarioId: string | null
  productoSlug: string
  onEjecutar: (idVenta: string, comprador: string, cantidadComprada: number) => Promise<boolean>
}

export default function BuyDirectRow({ oferta, usuarioId, onEjecutar }: Props) {
  const [nombreComprador, setNombreComprador] = useState('')
  const [cantidad, setCantidad] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user
      if (!user) return
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('nombre_completo')
        .eq('id', user.id)
        .single()
      if (perfil?.nombre_completo) setNombreComprador(perfil.nombre_completo)
    })
  }, [])

  if (usuarioId && usuarioId === oferta.vendedor_id) return null

  const cantidadNum = parseFloat(cantidad) || 0
  const total = cantidadNum > 0 ? (cantidadNum * oferta.precio).toFixed(2) : ''

  async function handleComprar() {
    if (!nombreComprador.trim()) { alert('Por favor ingresa tu nombre como comprador'); return }
    const cantNum = parseInt(cantidad) || 0
    if (cantNum <= 0) { alert('Por favor ingresa una cantidad válida'); return }
    if (cantNum > oferta.cantidad) {
      alert(`La cantidad solicitada (${cantNum}) supera la disponibilidad del vendedor (${oferta.cantidad})`)
      setCantidad(String(oferta.cantidad))
      return
    }
    const totalStr = (cantNum * oferta.precio).toFixed(2)
    const confirmar = confirm(
      `¿Confirmar la compra?\n\nVendedor: ${oferta.vendedor}\nComprador: ${nombreComprador}\nCantidad: ${cantNum}\nPrecio unidad: $${oferta.precio}\nTOTAL: $${totalStr}`
    )
    if (!confirmar) return
    await onEjecutar(oferta.id, nombreComprador.trim(), cantNum)
    setCantidad('')
  }

  return (
    <tr className="fila-comprar-directo">
      <td>
        <div className="comprar-directo-nombre-wrapper">
          <i className="bi bi-cart-plus comprar-directo-icon"></i>
          <input type="text" className="comprar-directo-nombre readonly" placeholder="Inicia sesión para ver tu nombre" readOnly value={nombreComprador} />
        </div>
      </td>
      <td>
        <input type="number" className="comprar-directo-cantidad" placeholder="0" min="1" max={oferta.cantidad} value={cantidad}
          onChange={e => {
            const val = parseInt(e.target.value)
            setCantidad(!isNaN(val) && val > oferta.cantidad ? String(oferta.cantidad) : e.target.value)
          }}
        />
      </td>
      <td><input type="text" className="comprar-directo-precio" value={oferta.precio} readOnly /></td>
      <td><input type="text" className="comprar-directo-total" placeholder="0.00" value={total} readOnly /></td>
      <td>
        <button type="button" className="btn-action btn-comprar" onClick={handleComprar}>
          <i className="bi bi-cart-fill"></i> Comprar
        </button>
      </td>
    </tr>
  )
}
