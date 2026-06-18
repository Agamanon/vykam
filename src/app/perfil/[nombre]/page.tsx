'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import supabase from '@/lib/supabase'
import { normalizarSlug } from '@/lib/utils'
import { getProductoBySlug } from '@/lib/productos'

interface Perfil {
  id: string
  nombre_completo: string | null
  avatar_url: string | null
  rol: 'usuario' | 'admin'
  created_at: string
  email: string | null
  rut_personal: string | null
  telefono: string | null
  nombre_empresa: string | null
  rut_empresa: string | null
  direccion_empresa: string | null
  horario_atencion: string | null
}

interface OfertaResumen {
  id: string
  producto_slug: string
  cantidad: number
  precio: number
  total: number
}

interface Props {
  params: Promise<{ nombre: string }>
}

export default function PerfilPage({ params }: Props) {
  const { nombre: slugParam } = use(params)

  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [ofertasVenta, setOfertasVenta] = useState<OfertaResumen[]>([])
  const [ofertasCompra, setOfertasCompra] = useState<OfertaResumen[]>([])
  const [cargando, setCargando] = useState(true)
  const [noEncontrado, setNoEncontrado] = useState(false)

  useEffect(() => {
    async function cargar() {
      const { data: perfiles } = await supabase
        .from('perfiles')
        .select('*')

      const encontrado = (perfiles ?? []).find(
        (p: Perfil) => p.nombre_completo && normalizarSlug(p.nombre_completo) === slugParam
      )

      if (!encontrado) {
        setNoEncontrado(true)
        setCargando(false)
        return
      }

      setPerfil(encontrado)

      const [{ data: ventas }, { data: compras }] = await Promise.all([
        supabase
          .from('ofertas_venta')
          .select('id, producto_slug, cantidad, precio, total')
          .eq('vendedor_id', encontrado.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('ofertas_compra')
          .select('id, producto_slug, cantidad, precio, total')
          .eq('comprador_id', encontrado.id)
          .order('created_at', { ascending: false }),
      ])

      setOfertasVenta(ventas ?? [])
      setOfertasCompra(compras ?? [])
      setCargando(false)
    }

    cargar()
  }, [slugParam])

  const iniciales =
    perfil?.nombre_completo
      ?.split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? '?'

  const fechaMiembro = perfil?.created_at
    ? new Date(perfil.created_at).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
      })
    : ''

  if (cargando) {
    return (
      <div className="perfil-feedback">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando perfil...</p>
      </div>
    )
  }

  if (noEncontrado) {
    return (
      <div className="perfil-feedback">
        <i className="bi bi-person-x perfil-feedback-icon"></i>
        <h2>Perfil no encontrado</h2>
        <p>El usuario que buscas no existe o cambió su nombre.</p>
        <Link href="/" className="btn-product" style={{ display: 'inline-flex', width: 'auto' }}>
          <span>Volver al inicio</span>
          <i className="bi bi-house-fill"></i>
        </Link>
      </div>
    )
  }

  return (
    <div className="perfil-page-bg">
      <div className="perfil-card">

        {/* ── Cabecera azul ── */}
        <div className="perfil-card-header">
          <div className="perfil-avatar">
            {perfil?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={perfil.avatar_url} alt={perfil.nombre_completo ?? ''} className="perfil-avatar-img" />
            ) : (
              <span className="perfil-avatar-iniciales">{iniciales}</span>
            )}
          </div>
          <h1 className="perfil-nombre">{perfil?.nombre_completo}</h1>
          <div className="perfil-header-row">
            <i className="bi bi-building"></i>
            <span>{perfil?.nombre_empresa}</span>
          </div>
          <div className="perfil-header-row">
            <i className="bi bi-calendar3"></i>
            <span>Miembro desde {fechaMiembro}</span>
          </div>
        </div>

        {/* ── Información personal ── */}
        <div className="perfil-info-section">
          <div className="perfil-section-label">INFORMACIÓN PERSONAL</div>
          <div className="perfil-info-row">
            <i className="bi bi-envelope"></i>
            <span>{perfil?.email}</span>
          </div>
          <div className="perfil-info-row">
            <i className="bi bi-file-earmark-person"></i>
            <span>{perfil?.rut_personal}</span>
          </div>
          <div className="perfil-info-row">
            <i className="bi bi-telephone"></i>
            <span>{perfil?.telefono}</span>
          </div>
        </div>

        {/* ── Información de empresa ── */}
        <div className="perfil-info-section">
          <div className="perfil-section-label">INFORMACIÓN DE EMPRESA</div>
          <div className="perfil-info-row">
            <i className="bi bi-building"></i>
            <span>{perfil?.nombre_empresa}</span>
          </div>
          <div className="perfil-info-row">
            <i className="bi bi-briefcase"></i>
            <span>{perfil?.rut_empresa}</span>
          </div>
          <div className="perfil-info-row">
            <i className="bi bi-geo-alt"></i>
            <span>{perfil?.direccion_empresa}</span>
          </div>
          <div className="perfil-info-row">
            <i className="bi bi-clock"></i>
            <span>{perfil?.horario_atencion}</span>
          </div>
        </div>

        {/* ── Volver ── */}
        <div className="perfil-back">
          <Link href="/" className="perfil-back-link">
            ← Volver al sitio
          </Link>
        </div>

      </div>
    </div>
  )
}
