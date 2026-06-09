'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import supabase from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Props {
  tipo: 'venta' | 'compra'
  onPublicar: (nombre: string, cantidad: number, precio: number) => Promise<boolean>
}

export default function PublishOfferForm({ tipo, onPublicar }: Props) {
  const esVenta = tipo === 'venta'
  const router = useRouter()

  const [usuario, setUsuario] = useState<User | null>(null)
  const [cargando, setCargando] = useState(true)
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [precio, setPrecio] = useState('')

  const total =
    cantidad && precio
      ? (parseFloat(cantidad) * parseFloat(precio)).toFixed(2)
      : ''

  useEffect(() => {
    async function cargarUsuario() {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user ?? null
      setUsuario(user)
      if (user) {
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('nombre_completo')
          .eq('id', user.id)
          .single()
        if (perfil?.nombre_completo) setNombre(perfil.nombre_completo)
      }
      setCargando(false)
    }
    cargarUsuario()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!usuario) { router.push('/login'); return }
    const cant = parseFloat(cantidad)
    const prec = parseFloat(precio)
    if (!nombre.trim() || cant <= 0 || prec <= 0 || isNaN(cant) || isNaN(prec)) {
      alert('Por favor completa todos los campos correctamente')
      return
    }
    const exito = await onPublicar(nombre.trim(), cant, prec)
    if (!exito) {
      alert(
        `⚠ Ya tienes una oferta publicada en este producto.\n\n` +
        `Solo puedes publicar una oferta de ${esVenta ? 'venta' : 'compra'} por producto.\n` +
        `Si quieres cambiarla, primero elimínala usando el botón "Quitar".`
      )
      return
    }
    setCantidad('')
    setPrecio('')
  }

  if (cargando) return null

  if (!usuario) {
    return (
      <div className={`new-offer-card ${esVenta ? '' : 'buy-variant'}`}>
        <div className="new-offer-header">
          <i className="bi bi-lock-fill"></i>
          <span>{esVenta ? 'Publica tu oferta de venta' : 'Publica tu oferta de compra'}</span>
        </div>
        <div className="new-offer-auth-msg">
          <i className="bi bi-person-circle"></i>
          <p>Debes iniciar sesión para publicar una oferta de {esVenta ? 'venta' : 'compra'}.</p>
          <Link href="/login" className={`btn-new-offer ${esVenta ? 'sell' : 'buy'}`}>
            <i className="bi bi-box-arrow-in-right"></i>
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`new-offer-card ${esVenta ? '' : 'buy-variant'}`}>
      <div className="new-offer-header">
        <i className="bi bi-plus-circle-fill"></i>
        <span>{esVenta ? 'Publica tu oferta de venta' : 'Publica tu oferta de compra'}</span>
      </div>
      <form className="new-offer-grid" onSubmit={handleSubmit}>
        <div className="new-offer-field">
          <label className="new-offer-label">{esVenta ? 'Vendedor' : 'Comprador'}</label>
          <input
            type="text"
            className="new-offer-input readonly"
            placeholder="Inicia sesión para ver tu nombre"
            required
            readOnly
            value={nombre}
          />
        </div>
        <div className="new-offer-field">
          <label className="new-offer-label">Cantidad</label>
          <input type="number" className="new-offer-input" placeholder="0" min="1" required value={cantidad} onChange={e => setCantidad(e.target.value)} />
        </div>
        <div className="new-offer-field">
          <label className="new-offer-label">Precio Unidad</label>
          <input type="number" className="new-offer-input" placeholder="0" min="0" step="0.01" required value={precio} onChange={e => setPrecio(e.target.value)} />
        </div>
        <div className="new-offer-field">
          <label className="new-offer-label">Valor Total</label>
          <input type="text" className="new-offer-input readonly" readOnly placeholder="0.00" value={total} />
        </div>
        <div className="new-offer-field">
          <label className="new-offer-label">Acción</label>
          <button type="submit" className={`btn-new-offer ${esVenta ? 'sell' : 'buy'}`}>
            <i className={`bi ${esVenta ? 'bi-currency-dollar' : 'bi-cart-fill'}`}></i>
            {esVenta ? 'Vender' : 'Comprar'}
          </button>
        </div>
      </form>
    </div>
  )
}
