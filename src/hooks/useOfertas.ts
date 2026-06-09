'use client'

// ================================================================
// HOOK useOfertas — Maneja ofertas persistentes en Supabase
// ================================================================

import { useState, useEffect } from 'react'
import { OfertaVenta, OfertaCompra } from '@/types'
import supabase from '@/lib/supabase'

export interface UseOfertasReturn {
  ofertasVenta: OfertaVenta[]
  ofertasCompra: OfertaCompra[]
  duplicadoVentaId: string | null
  duplicadoCompraId: string | null
  publicarVenta: (vendedor: string, cantidad: number, precio: number) => Promise<boolean>
  publicarCompra: (comprador: string, cantidad: number, precio: number) => Promise<boolean>
  eliminarVenta: (id: string) => Promise<void>
  eliminarCompra: (id: string) => Promise<void>
  ejecutarCompraDirecta: (idVenta: string, comprador: string, cantidadComprada: number) => Promise<boolean>
  ejecutarVentaDirecta: (idCompra: string, vendedor: string, cantidadVendida: number) => Promise<boolean>
}

export function useOfertas(productoSlug: string): UseOfertasReturn {
  const [ofertasVenta, setOfertasVenta] = useState<OfertaVenta[]>([])
  const [ofertasCompra, setOfertasCompra] = useState<OfertaCompra[]>([])
  const [duplicadoVentaId, setDuplicadoVentaId] = useState<string | null>(null)
  const [duplicadoCompraId, setDuplicadoCompraId] = useState<string | null>(null)

  useEffect(() => {
    if (!productoSlug) return
    cargarOfertas()
  }, [productoSlug])

  async function cargarOfertas() {
    const [{ data: ventas }, { data: compras }] = await Promise.all([
      supabase
        .from('ofertas_venta')
        .select('*')
        .eq('producto_slug', productoSlug)
        .order('precio', { ascending: true }),
      supabase
        .from('ofertas_compra')
        .select('*')
        .eq('producto_slug', productoSlug)
        .order('precio', { ascending: false }),
    ])
    setOfertasVenta((ventas ?? []).map(mapVenta))
    setOfertasCompra((compras ?? []).map(mapCompra))
  }

  function mapVenta(row: Record<string, unknown>): OfertaVenta {
    return {
      id: row.id as string,
      vendedor: row.vendedor as string,
      vendedor_id: row.vendedor_id as string,
      cantidad: row.cantidad as number,
      precio: row.precio as number,
      total: row.total as number,
    }
  }

  function mapCompra(row: Record<string, unknown>): OfertaCompra {
    return {
      id: row.id as string,
      comprador: row.comprador as string,
      comprador_id: row.comprador_id as string,
      cantidad: row.cantidad as number,
      precio: row.precio as number,
      total: row.total as number,
    }
  }

  async function publicarVenta(vendedor: string, cantidad: number, precio: number): Promise<boolean> {
    const existente = ofertasVenta.find(
      o => o.vendedor.toLowerCase().trim() === vendedor.toLowerCase().trim()
    )
    if (existente) {
      setDuplicadoVentaId(existente.id)
      setTimeout(() => setDuplicadoVentaId(null), 2000)
      return false
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase.from('ofertas_venta').insert({
      producto_slug: productoSlug,
      vendedor,
      vendedor_id: user.id,
      cantidad,
      precio,
      total: cantidad * precio,
    })

    if (error) { console.error(error); return false }
    await cargarOfertas()
    return true
  }

  async function publicarCompra(comprador: string, cantidad: number, precio: number): Promise<boolean> {
    const existente = ofertasCompra.find(
      o => o.comprador.toLowerCase().trim() === comprador.toLowerCase().trim()
    )
    if (existente) {
      setDuplicadoCompraId(existente.id)
      setTimeout(() => setDuplicadoCompraId(null), 2000)
      return false
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase.from('ofertas_compra').insert({
      producto_slug: productoSlug,
      comprador,
      comprador_id: user.id,
      cantidad,
      precio,
      total: cantidad * precio,
    })

    if (error) { console.error(error); return false }
    await cargarOfertas()
    return true
  }

  async function eliminarVenta(id: string): Promise<void> {
    await supabase.from('ofertas_venta').delete().eq('id', id)
    setOfertasVenta(prev => prev.filter(o => o.id !== id))
  }

  async function eliminarCompra(id: string): Promise<void> {
    await supabase.from('ofertas_compra').delete().eq('id', id)
    setOfertasCompra(prev => prev.filter(o => o.id !== id))
  }

  async function ejecutarCompraDirecta(
    idVenta: string,
    comprador: string,
    cantidadComprada: number
  ): Promise<boolean> {
    const oferta = ofertasVenta.find(o => o.id === idVenta)
    if (!oferta || cantidadComprada <= 0 || cantidadComprada > oferta.cantidad) return false

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: ofertaDB } = await supabase
      .from('ofertas_venta')
      .select('vendedor_id')
      .eq('id', idVenta)
      .single()

    const cantidadRestante = oferta.cantidad - cantidadComprada

    if (cantidadRestante <= 0) {
      await supabase.from('ofertas_venta').delete().eq('id', idVenta)
    } else {
      await supabase
        .from('ofertas_venta')
        .update({ cantidad: cantidadRestante, total: cantidadRestante * oferta.precio })
        .eq('id', idVenta)
    }

    await supabase.from('transacciones').insert({
      producto_slug: productoSlug,
      vendedor: oferta.vendedor,
      vendedor_id: ofertaDB?.vendedor_id ?? null,
      comprador,
      comprador_id: user.id,
      cantidad: cantidadComprada,
      precio: oferta.precio,
      total: cantidadComprada * oferta.precio,
      tipo: 'compra_directa',
    })

    await cargarOfertas()
    return true
  }

  async function ejecutarVentaDirecta(
    idCompra: string,
    vendedor: string,
    cantidadVendida: number
  ): Promise<boolean> {
    const oferta = ofertasCompra.find(o => o.id === idCompra)
    if (!oferta || cantidadVendida <= 0 || cantidadVendida > oferta.cantidad) return false

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: ofertaDB } = await supabase
      .from('ofertas_compra')
      .select('comprador_id')
      .eq('id', idCompra)
      .single()

    const cantidadRestante = oferta.cantidad - cantidadVendida

    if (cantidadRestante <= 0) {
      await supabase.from('ofertas_compra').delete().eq('id', idCompra)
    } else {
      await supabase
        .from('ofertas_compra')
        .update({ cantidad: cantidadRestante, total: cantidadRestante * oferta.precio })
        .eq('id', idCompra)
    }

    await supabase.from('transacciones').insert({
      producto_slug: productoSlug,
      vendedor,
      vendedor_id: user.id,
      comprador: oferta.comprador,
      comprador_id: ofertaDB?.comprador_id ?? null,
      cantidad: cantidadVendida,
      precio: oferta.precio,
      total: cantidadVendida * oferta.precio,
      tipo: 'venta_directa',
    })

    await cargarOfertas()
    return true
  }

  return {
    ofertasVenta,
    ofertasCompra,
    duplicadoVentaId,
    duplicadoCompraId,
    publicarVenta,
    publicarCompra,
    eliminarVenta,
    eliminarCompra,
    ejecutarCompraDirecta,
    ejecutarVentaDirecta,
  }
}
