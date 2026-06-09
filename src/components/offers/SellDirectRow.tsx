'use client'

import { useState, useEffect } from 'react'
import { OfertaCompra } from '@/types'
import supabase from '@/lib/supabase'

interface Props {
  oferta: OfertaCompra
  usuarioId: string | null
  productoSlug: string
  onEjecutar: (idCompra: string, vendedor: string, cantidadVendida: number) => Promise<boolean>
}

export default function SellDirectRow({ oferta, usuarioId, onEjecutar }: Props) {
  const [nombreVendedor, setNombreVendedor] = useState('')
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
      if (perfil?.nombre_completo) setNombreVendedor(perfil.nombre_completo)
    })
  }, [])

  if (usuarioId && usuarioId === oferta.comprador_id) return null

  const cantidadNum = parseFloat(cantidad) || 0
  const total = cantidadNum > 0 ? (cantidadNum * oferta.precio).toFixed(2) : ''

  async function handleVender() {
    if (!nombreVendedor.trim()) { alert('Por favor ingresa tu nombre como vendedor'); return }
    const cantNum = parseInt(cantidad) || 0
    if (cantNum <= 0) { alert('Por favor ingresa una cantidad válida'); return }
    if (cantNum > oferta.cantidad) {
      alert(`La cantidad ofrecida (${cantNum}) supera lo que el comprador desea (${oferta.cantidad})`)
      setCantidad(String(oferta.cantidad))
      return
    }
    const totalStr = (cantNum * oferta.precio).toFixed(2)
    const confirmar = confirm(
      `¿Confirmar la venta?\n\nComprador: ${oferta.comprador}\nVendedor: ${nombreVendedor}\nCantidad: ${cantNum}\nPrecio unidad: $${oferta.precio}\nTOTAL: $${totalStr}`
    )
    if (!confirmar) return
    await onEjecutar(oferta.id, nombreVendedor.trim(), cantNum)
    setCantidad('')
  }

  return (
    <tr className="fila-vender-directo">
      <td>
        <div className="vender-directo-nombre-wrapper">
          <i className="bi bi-cash-coin vender-directo-icon"></i>
          <input type="text" className="vender-directo-nombre readonly" placeholder="Inicia sesión para ver tu nombre" readOnly value={nombreVendedor} />
        </div>
      </td>
      <td>
        <input type="number" className="vender-directo-cantidad" placeholder="0" min="1" max={oferta.cantidad} value={cantidad}
          onChange={e => {
            const val = parseInt(e.target.value)
            setCantidad(!isNaN(val) && val > oferta.cantidad ? String(oferta.cantidad) : e.target.value)
          }}
        />
      </td>
      <td><input type="text" className="vender-directo-precio" value={oferta.precio} readOnly /></td>
      <td><input type="text" className="vender-directo-total" placeholder="0.00" value={total} readOnly /></td>
      <td>
        <button type="button" className="btn-action btn-vender" onClick={handleVender}>
          <i className="bi bi-currency-dollar"></i> Vender
        </button>
      </td>
    </tr>
  )
}
