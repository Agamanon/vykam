'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import supabase from '@/lib/supabase'
import { PRODUCTOS } from '@/lib/productos'

// ── Tipos ──────────────────────────────────────────────────────────
interface Perfil {
  id: string
  nombre_completo: string | null
  avatar_url: string | null
  rol: 'usuario' | 'admin'
  created_at: string
  email: string | null
  rut_personal: string | null
  rut_empresa: string | null
  nombre_empresa: string | null
  direccion_empresa: string | null
  telefono: string | null
  horario_atencion: string | null
}

interface Producto {
  id: string
  titulo: string
  precio: number
  categoria: string | null
  estado: string
  created_at: string
  cantidad?: number
}

interface Compra {
  id: string
  precio_pagado: number
  estado: string
  created_at: string
  productos: { titulo: string } | null
  cantidad?: number
}

interface UsuarioAdmin {
  id: string
  nombre_completo: string | null
  rol: string
  created_at: string
}

interface Transaccion {
  id: string
  producto_slug: string
  vendedor: string
  comprador: string
  cantidad: number
  precio: number
  total: number
  tipo: 'compra_directa' | 'venta_directa'
  created_at: string
}

type Seccion = 'resumen' | 'compras' | 'ventas' | 'perfil' | 'usuarios' | 'productos_admin' | 'transacciones'

export default function DashboardPage() {
  const router = useRouter()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [seccion, setSeccion] = useState<Seccion>('resumen')
  const [cargando, setCargando] = useState(true)
  const [menuAbierto, setMenuAbierto] = useState(false)

  const [misCompras, setMisCompras] = useState<Compra[]>([])
  const [misVentas, setMisVentas] = useState<Producto[]>([])
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [todosUsuarios, setTodosUsuarios] = useState<UsuarioAdmin[]>([])
  const [todosProductos, setTodosProductos] = useState<Producto[]>([])

  // Perfil editable
  const [nombreEdit, setNombreEdit] = useState('')
  const [emailEdit, setEmailEdit] = useState('')
  const [rutPersonalEdit, setRutPersonalEdit] = useState('')
  const [rutEmpresaEdit, setRutEmpresaEdit] = useState('')
  const [nombreEmpresaEdit, setNombreEmpresaEdit] = useState('')
  const [direccionEmpresaEdit, setDireccionEmpresaEdit] = useState('')
  const [telefonoEdit, setTelefonoEdit] = useState('')
  const [horarioAtencionEdit, setHorarioAtencionEdit] = useState('')
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)
  const [alertaPerfil, setAlertaPerfil] = useState<{ tipo: 'error' | 'success'; texto: string } | null>(null)

  // Avatar
  const [subiendoAvatar, setSubiendoAvatar] = useState(false)
  const inputAvatarRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: p } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (p) {
        setPerfil(p)
        setNombreEdit(p.nombre_completo ?? '')
        setEmailEdit(p.email ?? user.email ?? '')
        setRutPersonalEdit(p.rut_personal ?? '')
        setRutEmpresaEdit(p.rut_empresa ?? '')
        setNombreEmpresaEdit(p.nombre_empresa ?? '')
        setDireccionEmpresaEdit(p.direccion_empresa ?? '')
        setTelefonoEdit(p.telefono ?? '')
        setHorarioAtencionEdit(p.horario_atencion ?? '')
      }
      setCargando(false)
    }
    init()
  }, [router])

  useEffect(() => {
    if (!perfil) return
    if (seccion === 'compras' && misCompras.length === 0) cargarCompras()
    if (seccion === 'ventas' && misVentas.length === 0) cargarVentas()
    if (seccion === 'usuarios' && perfil.rol === 'admin') cargarUsuarios()
    if (seccion === 'productos_admin' && perfil.rol === 'admin') cargarProductosAdmin()
    if (seccion === 'transacciones') cargarTransacciones()
    if (seccion === 'resumen') { cargarCompras(); cargarVentas(); cargarTransacciones() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seccion, perfil])

  async function cargarCompras() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('ofertas_compra')
      .select('id, precio, cantidad, total, estado:estado, created_at, producto_slug')
      .eq('comprador_id', user.id)
      .order('created_at', { ascending: false })
    const mapped = (data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      precio_pagado: (r.total as number) ?? 0,
      precio_unitario: (r.precio as number) ?? 0,
      cantidad: (r.cantidad as number) ?? 0,
      estado: 'activo',
      created_at: r.created_at as string,
      productos: { titulo: r.producto_slug as string },
    }))
    setMisCompras(mapped)
  }

  async function cargarVentas() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('ofertas_venta')
      .select('id, producto_slug, precio, cantidad, total, created_at')
      .eq('vendedor_id', user.id)
      .order('created_at', { ascending: false })
    const mapped = (data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string,
      titulo: r.producto_slug as string,
      precio: (r.precio as number) ?? 0,
      categoria: String((r.total as number) ?? 0),
      cantidad: (r.cantidad as number) ?? 0,
      estado: 'activo',
      created_at: r.created_at as string,
    }))
    setMisVentas(mapped)
  }

  async function cargarUsuarios() {
    const { data } = await supabase.from('perfiles').select('id, nombre_completo, rol, created_at').order('created_at', { ascending: false })
    setTodosUsuarios(data ?? [])
  }

  async function cargarProductosAdmin() {
    const { data } = await supabase.from('ofertas_venta').select('id, producto_slug, precio, cantidad, total, created_at').order('created_at', { ascending: false })
    const mapped = (data ?? []).map((r: Record<string, unknown>) => ({
      id: r.id as string, titulo: r.producto_slug as string,
      precio: (r.precio as number) ?? 0, categoria: String((r.total as number) ?? 0),
      estado: 'activo', created_at: r.created_at as string,
    }))
    setTodosProductos(mapped)
  }

  async function cargarTransacciones() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('transacciones')
      .select('id, producto_slug, vendedor, comprador, cantidad, precio, total, tipo, created_at')
      .or(`vendedor_id.eq.${user.id},comprador_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
    setTransacciones((data ?? []) as Transaccion[])
  }

  async function borrarTransacciones() {
    if (!confirm('¿Eliminar todo el historial de transacciones? Esta acción es irreversible.')) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('transacciones').delete().or(`vendedor_id.eq.${user.id},comprador_id.eq.${user.id}`)
    setTransacciones([])
  }

  async function borrarVentas() {
    if (!confirm('¿Eliminar todo el historial de ofertas de venta? Esta acción es irreversible.')) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('ofertas_venta').delete().eq('vendedor_id', user.id)
    setMisVentas([])
  }

  async function borrarCompras() {
    if (!confirm('¿Eliminar todo el historial de ofertas de compra? Esta acción es irreversible.')) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('ofertas_compra').delete().eq('comprador_id', user.id)
    setMisCompras([])
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function guardarPerfil(e: React.FormEvent) {
    e.preventDefault()
    setGuardandoPerfil(true)
    setAlertaPerfil(null)
    const { error } = await supabase
      .from('perfiles')
      .update({
        nombre_completo: nombreEdit,
        email: emailEdit,
        rut_personal: rutPersonalEdit,
        rut_empresa: rutEmpresaEdit,
        nombre_empresa: nombreEmpresaEdit,
        direccion_empresa: direccionEmpresaEdit,
        telefono: telefonoEdit,
        horario_atencion: horarioAtencionEdit,
      })
      .eq('id', perfil!.id)
    setGuardandoPerfil(false)
    if (error) {
      setAlertaPerfil({ tipo: 'error', texto: 'Error al guardar. Intenta de nuevo.' })
    } else {
      setPerfil(prev => prev ? {
        ...prev,
        nombre_completo: nombreEdit,
        email: emailEdit,
        rut_personal: rutPersonalEdit,
        rut_empresa: rutEmpresaEdit,
        nombre_empresa: nombreEmpresaEdit,
        direccion_empresa: direccionEmpresaEdit,
        telefono: telefonoEdit,
        horario_atencion: horarioAtencionEdit,
      } : prev)
      setAlertaPerfil({ tipo: 'success', texto: '¡Perfil actualizado correctamente!' })
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !perfil) return
    if (!file.type.startsWith('image/')) { setAlertaPerfil({ tipo: 'error', texto: 'Solo se permiten imágenes.' }); return }
    if (file.size > 2 * 1024 * 1024) { setAlertaPerfil({ tipo: 'error', texto: 'La imagen no puede superar los 2MB.' }); return }
    setSubiendoAvatar(true)
    setAlertaPerfil(null)
    const ext = file.name.split('.').pop()
    const path = `${perfil.id}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage.from('avatares').upload(path, file, { upsert: true })
    if (uploadError) { setAlertaPerfil({ tipo: 'error', texto: 'Error al subir la imagen.' }); setSubiendoAvatar(false); return }
    const { data: { publicUrl } } = supabase.storage.from('avatares').getPublicUrl(path)
    const { error: updateError } = await supabase.from('perfiles').update({ avatar_url: publicUrl }).eq('id', perfil.id)
    if (updateError) {
      setAlertaPerfil({ tipo: 'error', texto: 'Imagen subida pero no se pudo guardar en el perfil.' })
    } else {
      setPerfil(prev => prev ? { ...prev, avatar_url: publicUrl } : prev)
      setAlertaPerfil({ tipo: 'success', texto: '¡Avatar actualizado correctamente!' })
    }
    setSubiendoAvatar(false)
  }

  function formatFecha(iso: string) {
    return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  function formatPrecio(n: number) {
    return n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
  }
  function nombreProducto(slug: string) {
    const p = PRODUCTOS.find(p => p.slug === slug)
    if (!p) return slug
    return `${p.nombre} · ${p.detalle}`.replace(/\s*×\s*\d+\s*unidades/g, '')
  }
  function iniciales(nombre: string | null) {
    if (!nombre) return '?'
    return nombre.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  }

  const totalGastado = misCompras.reduce((s, c) => s + c.precio_pagado, 0)
  const totalVendido = misVentas.reduce((s, v) => s + parseFloat(v.categoria ?? '0'), 0)
  const esAdmin = perfil?.rol === 'admin'

  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light)' }}>
        <div style={{ textAlign: 'center', color: 'var(--gray)' }}>
          <div className="dash-spinner" />
          <p style={{ marginTop: '1rem', fontWeight: 500 }}>Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-root">

      {/* ── SIDEBAR ── */}
      <aside className={`dash-sidebar ${menuAbierto ? 'open' : ''}`}>
        <div className="dash-sidebar-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Vykam" className="dash-logo" />
        </div>
        <nav className="dash-nav">
          <p className="dash-nav-label">General</p>
          <button className={`dash-nav-item ${seccion === 'resumen' ? 'active' : ''}`} onClick={() => { setSeccion('resumen'); setMenuAbierto(false) }}><i className="bi bi-grid-fill" /> Resumen</button>
          <button className={`dash-nav-item ${seccion === 'perfil' ? 'active' : ''}`} onClick={() => { setSeccion('perfil'); setMenuAbierto(false) }}><i className="bi bi-person-fill" /> Mi perfil</button>
          <button className={`dash-nav-item ${seccion === 'ventas' ? 'active' : ''}`} onClick={() => { setSeccion('ventas'); setMenuAbierto(false) }}><i className="bi bi-tag-fill" /> Mis ofertas de venta</button>
          <button className={`dash-nav-item ${seccion === 'compras' ? 'active' : ''}`} onClick={() => { setSeccion('compras'); setMenuAbierto(false) }}><i className="bi bi-cart-fill" /> Mis ofertas de compra</button>
          <button className={`dash-nav-item ${seccion === 'transacciones' ? 'active' : ''}`} onClick={() => { setSeccion('transacciones'); setMenuAbierto(false) }}><i className="bi bi-arrow-left-right" /> Transacciones</button>
          {esAdmin && (
            <>
              <p className="dash-nav-label" style={{ marginTop: '1.5rem' }}>Administración</p>
              <button className={`dash-nav-item ${seccion === 'usuarios' ? 'active' : ''}`} onClick={() => { setSeccion('usuarios'); setMenuAbierto(false) }}><i className="bi bi-people-fill" /> Usuarios</button>
              <button className={`dash-nav-item ${seccion === 'productos_admin' ? 'active' : ''}`} onClick={() => { setSeccion('productos_admin'); setMenuAbierto(false) }}><i className="bi bi-box-fill" /> Todos los productos</button>
            </>
          )}
        </nav>
        <div className="dash-sidebar-footer">
          <Link href="/" className="dash-nav-item"><i className="bi bi-house-fill" /> Ir al sitio</Link>
          <button className="dash-nav-item danger" onClick={cerrarSesion}><i className="bi bi-box-arrow-right" /> Cerrar sesión</button>
        </div>
      </aside>

      {menuAbierto && <div className="dash-overlay" onClick={() => setMenuAbierto(false)} />}

      <main className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setMenuAbierto(v => !v)}><i className="bi bi-list" /></button>
          <div className="dash-topbar-right">
            {esAdmin && <span className="dash-badge-admin">Admin</span>}
            {perfil?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={perfil.avatar_url} alt="avatar" className="dash-avatar" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="dash-avatar">{iniciales(perfil?.nombre_completo ?? null)}</div>
            )}
            <span className="dash-topbar-name">{perfil?.nombre_completo ?? 'Usuario'}</span>
          </div>
        </header>

        <div className="dash-content">

          {/* ── RESUMEN ── */}
          {seccion === 'resumen' && (
            <div>
              <h2 className="dash-title">Bienvenido, {perfil?.nombre_completo?.split(' ')[0] ?? 'Usuario'} 👋</h2>
              <p className="dash-subtitle">Aquí tienes un resumen de tu actividad en Vykam.</p>
              <div className="dash-stats">
                <div className="dash-stat-card purple"><div className="dash-stat-icon"><i className="bi bi-tag-fill" /></div><div><p className="dash-stat-label">Productos para vender</p><p className="dash-stat-value">{misVentas.length}</p></div></div>
                <div className="dash-stat-card orange"><div className="dash-stat-icon"><i className="bi bi-graph-up-arrow" /></div><div><p className="dash-stat-label">Total de ventas</p><p className="dash-stat-value">{formatPrecio(totalVendido)}</p></div></div>
                <div className="dash-stat-card blue"><div className="dash-stat-icon"><i className="bi bi-bag-fill" /></div><div><p className="dash-stat-label">Productos para comprar</p><p className="dash-stat-value">{misCompras.length}</p></div></div>
                <div className="dash-stat-card green"><div className="dash-stat-icon"><i className="bi bi-cash-stack" /></div><div><p className="dash-stat-label">Total de compras</p><p className="dash-stat-value">{formatPrecio(totalGastado)}</p></div></div>
                <div className="dash-stat-card green"><div className="dash-stat-icon"><i className="bi bi-arrow-left-right" /></div><div><p className="dash-stat-label">Ventas realizadas</p><p className="dash-stat-value">{transacciones.filter(t => t.vendedor === perfil?.nombre_completo).length}</p></div></div>
                <div className="dash-stat-card blue"><div className="dash-stat-icon"><i className="bi bi-arrow-left-right" /></div><div><p className="dash-stat-label">Compras realizadas</p><p className="dash-stat-value">{transacciones.filter(t => t.comprador === perfil?.nombre_completo).length}</p></div></div>
              </div>
              <div className="dash-card" style={{ marginTop: '2rem' }}>
                <div className="dash-card-header"><h3>Últimas ofertas de venta</h3><button className="dash-link" onClick={() => setSeccion('ventas')}>Ver todas</button></div>
                {misVentas.length === 0 ? <p className="dash-empty">Aún no has publicado ofertas de venta.</p> : (
                  <table className="dash-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Valor total</th><th>Estado</th><th>Fecha</th></tr></thead>
                    <tbody>{misVentas.slice(0, 5).map(p => (<tr key={p.id}><td>{nombreProducto(p.titulo)}</td><td>{p.cantidad ?? '—'}</td><td>{formatPrecio(p.precio)}</td><td>{formatPrecio(parseFloat(p.categoria ?? '0'))}</td><td><span className={`dash-estado ${p.estado}`}>{p.estado}</span></td><td>{formatFecha(p.created_at)}</td></tr>))}</tbody>
                  </table>
                )}
              </div>
              <div className="dash-card" style={{ marginTop: '2rem' }}>
                <div className="dash-card-header"><h3>Últimas ofertas de compra</h3><button className="dash-link" onClick={() => setSeccion('compras')}>Ver todas</button></div>
                {misCompras.length === 0 ? <p className="dash-empty">Aún no has publicado ofertas de compra.</p> : (
                  <table className="dash-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Valor total</th><th>Estado</th><th>Fecha</th></tr></thead>
                    <tbody>{misCompras.slice(0, 5).map(c => (<tr key={c.id}><td>{nombreProducto(c.productos?.titulo ?? '')}</td><td>{c.cantidad ?? '—'}</td><td>{formatPrecio((c as Record<string, unknown>).precio_unitario as number ?? 0)}</td><td>{formatPrecio(c.precio_pagado)}</td><td><span className="dash-estado activo-compra">{c.estado}</span></td><td>{formatFecha(c.created_at)}</td></tr>))}</tbody>
                  </table>
                )}
              </div>
              <div className="dash-card" style={{ marginTop: '2rem' }}>
                <div className="dash-card-header"><h3>Últimas transacciones</h3><button className="dash-link" onClick={() => setSeccion('transacciones')}>Ver todas</button></div>
                {transacciones.length === 0 ? <p className="dash-empty">Aún no hay transacciones registradas.</p> : (
                  <table className="dash-table"><thead><tr><th>Producto</th><th>Vendedor</th><th>Comprador</th><th>Cantidad</th><th>Total</th><th>Tipo</th><th>Fecha</th></tr></thead>
                    <tbody>{transacciones.slice(0, 5).map(t => (<tr key={t.id}><td>{nombreProducto(t.producto_slug)}</td><td>{t.vendedor}</td><td>{t.comprador}</td><td>{t.cantidad}</td><td>{formatPrecio(t.total)}</td><td><span className={`dash-estado ${t.comprador === perfil?.nombre_completo ? 'activo-compra' : 'activo'}`}>{t.comprador === perfil?.nombre_completo ? 'Compra' : 'Venta'}</span></td><td>{formatFecha(t.created_at)}</td></tr>))}</tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── MIS COMPRAS ── */}
          {seccion === 'compras' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                <div>
                  <h2 className="dash-title" style={{ margin: 0 }}>Mis ofertas de compra</h2>
                  <p className="dash-subtitle" style={{ margin: 0 }}>Ofertas de compra que has publicado.</p>
                </div>
                <button onClick={borrarCompras} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <i className="bi bi-trash" /> Borrar historial
                </button>
              </div>
              <div className="dash-card">
                {misCompras.length === 0 ? <p className="dash-empty">Aún no has publicado ofertas de compra.</p> : (
                  <table className="dash-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Valor total</th><th>Estado</th><th>Fecha</th></tr></thead>
                    <tbody>{misCompras.map(c => (<tr key={c.id}><td>{nombreProducto(c.productos?.titulo ?? '')}</td><td>{c.cantidad ?? '—'}</td><td>{formatPrecio((c as Record<string, unknown>).precio_unitario as number ?? 0)}</td><td>{formatPrecio(c.precio_pagado)}</td><td><span className="dash-estado activo-compra">{c.estado}</span></td><td>{formatFecha(c.created_at)}</td></tr>))}</tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── MIS VENTAS ── */}
          {seccion === 'ventas' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                <div>
                  <h2 className="dash-title" style={{ margin: 0 }}>Mis ofertas de venta</h2>
                  <p className="dash-subtitle" style={{ margin: 0 }}>Tus ofertas de venta publicadas.</p>
                </div>
                <button onClick={borrarVentas} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i className="bi bi-trash" /> Borrar historial
                </button>
              </div>
              <div className="dash-card">
                {misVentas.length === 0 ? <p className="dash-empty">Aún no has publicado productos.</p> : (
                  <table className="dash-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Valor total</th><th>Estado</th><th>Fecha</th></tr></thead>
                    <tbody>{misVentas.map(p => (<tr key={p.id}><td>{nombreProducto(p.titulo)}</td><td>{p.cantidad ?? '—'}</td><td>{formatPrecio(p.precio)}</td><td>{formatPrecio(parseFloat(p.categoria ?? '0'))}</td><td><span className={`dash-estado ${p.estado}`}>{p.estado}</span></td><td>{formatFecha(p.created_at)}</td></tr>))}</tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── PERFIL ── */}
          {seccion === 'perfil' && (
            <div>
              <h2 className="dash-title">Mi perfil</h2>
              <p className="dash-subtitle">Administra tu información personal.</p>
              <div className="dash-card" style={{ maxWidth: 560 }}>

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ position: 'relative' }}>
                    {perfil?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={perfil.avatar_url} alt="Avatar" className="dash-avatar-lg" style={{ objectFit: 'cover', cursor: 'pointer' }} onClick={() => inputAvatarRef.current?.click()} />
                    ) : (
                      <div className="dash-avatar-lg" style={{ cursor: 'pointer' }} onClick={() => inputAvatarRef.current?.click()}>{iniciales(perfil?.nombre_completo ?? null)}</div>
                    )}
                    <button type="button" onClick={() => inputAvatarRef.current?.click()} disabled={subiendoAvatar}
                      style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.75rem' }}>
                      {subiendoAvatar ? <span style={{ fontSize: '0.6rem' }}>...</span> : <i className="bi bi-camera-fill" />}
                    </button>
                    <input ref={inputAvatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{perfil?.nombre_completo ?? 'Sin nombre'}</p>
                    <p style={{ color: 'var(--gray)', margin: 0, fontSize: '0.9rem' }}>{esAdmin ? '👑 Administrador' : 'Usuario'}</p>
                    <p style={{ color: 'var(--gray)', margin: 0, fontSize: '0.85rem' }}>Miembro desde {formatFecha(perfil?.created_at ?? '')}</p>
                    <button type="button" onClick={() => inputAvatarRef.current?.click()} disabled={subiendoAvatar}
                      style={{ marginTop: '0.5rem', background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 6, padding: '0.25rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                      {subiendoAvatar ? 'Subiendo...' : 'Cambiar foto'}
                    </button>
                  </div>
                </div>

                {alertaPerfil && (
                  <div className={`alert-msg show ${alertaPerfil.tipo}`} style={{ marginBottom: '1rem' }}>
                    <i className={`bi bi-${alertaPerfil.tipo === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}`} />
                    <span>{alertaPerfil.texto}</span>
                  </div>
                )}

                <form onSubmit={guardarPerfil}>

                  {/* ── Información personal ── */}
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1rem' }}>
                    Información personal
                  </p>

                  <div className="form-group">
                    <label className="form-label">Nombre completo</label>
                    <div className="input-wrapper">
                      <i className="bi bi-person-fill input-icon" />
                      <input type="text" className="form-input" value={nombreEdit} onChange={e => setNombreEdit(e.target.value)} placeholder="Tu nombre completo" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Correo electrónico</label>
                    <div className="input-wrapper">
                      <i className="bi bi-envelope-fill input-icon" />
                      <input type="email" className="form-input" value={emailEdit} onChange={e => setEmailEdit(e.target.value)} placeholder="tucorreo@ejemplo.com" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">RUT personal</label>
                    <div className="input-wrapper">
                      <i className="bi bi-card-text input-icon" />
                      <input type="text" className="form-input" value={rutPersonalEdit} onChange={e => setRutPersonalEdit(e.target.value)} placeholder="12.345.678-9" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <div className="input-wrapper">
                      <i className="bi bi-telephone-fill input-icon" />
                      <input type="tel" className="form-input" value={telefonoEdit} onChange={e => setTelefonoEdit(e.target.value)} placeholder="+56 9 1234 5678" />
                    </div>
                  </div>

                  {/* ── Información de empresa ── */}
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '1.5rem 0 1rem' }}>
                    Información de empresa
                  </p>

                  <div className="form-group">
                    <label className="form-label">Nombre de la empresa</label>
                    <div className="input-wrapper">
                      <i className="bi bi-building input-icon" />
                      <input type="text" className="form-input" value={nombreEmpresaEdit} onChange={e => setNombreEmpresaEdit(e.target.value)} placeholder="Nombre de tu empresa" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">RUT de la empresa</label>
                    <div className="input-wrapper">
                      <i className="bi bi-briefcase-fill input-icon" />
                      <input type="text" className="form-input" value={rutEmpresaEdit} onChange={e => setRutEmpresaEdit(e.target.value)} placeholder="76.543.210-K" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dirección de la empresa</label>
                    <div className="input-wrapper">
                      <i className="bi bi-geo-alt-fill input-icon" />
                      <input type="text" className="form-input" value={direccionEmpresaEdit} onChange={e => setDireccionEmpresaEdit(e.target.value)} placeholder="Av. Ejemplo 123, Santiago" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Horario de atención</label>
                    <div className="input-wrapper">
                      <i className="bi bi-clock-fill input-icon" />
                      <input type="text" className="form-input" value={horarioAtencionEdit} onChange={e => setHorarioAtencionEdit(e.target.value)} placeholder="Lun–Vie 9:00–18:00" />
                    </div>
                  </div>

                  <button type="submit" className="btn-login" disabled={guardandoPerfil}>
                    <span>{guardandoPerfil ? 'Guardando...' : 'Guardar cambios'}</span>
                    {!guardandoPerfil && <i className="bi bi-check-lg" />}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── ADMIN: USUARIOS ── */}
          {seccion === 'usuarios' && esAdmin && (
            <div>
              <h2 className="dash-title">Gestión de usuarios</h2>
              <p className="dash-subtitle">Todos los usuarios registrados en Vykam.</p>
              <div className="dash-card">
                {todosUsuarios.length === 0 ? <p className="dash-empty">No hay usuarios registrados.</p> : (
                  <table className="dash-table"><thead><tr><th>Nombre</th><th>Rol</th><th>Registro</th></tr></thead>
                    <tbody>{todosUsuarios.map(u => (<tr key={u.id}><td>{u.nombre_completo ?? '—'}</td><td><span className={`dash-estado ${u.rol === 'admin' ? 'admin' : 'activo'}`}>{u.rol}</span></td><td>{formatFecha(u.created_at)}</td></tr>))}</tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── TRANSACCIONES ── */}
          {seccion === 'transacciones' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                <div>
                  <h2 className="dash-title" style={{ margin: 0 }}>Transacciones</h2>
                  <p className="dash-subtitle" style={{ margin: 0 }}>Historial de compras y ventas directas completadas.</p>
                </div>
                <button onClick={borrarTransacciones} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i className="bi bi-trash" /> Borrar historial
                </button>
              </div>
              <div className="dash-card">
                {transacciones.length === 0 ? <p className="dash-empty">Aún no hay transacciones registradas.</p> : (
                  <table className="dash-table"><thead><tr><th>Producto</th><th>Vendedor</th><th>Comprador</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th><th>Tipo</th><th>Fecha</th></tr></thead>
                    <tbody>{transacciones.map(t => (<tr key={t.id}><td>{nombreProducto(t.producto_slug)}</td><td>{t.vendedor}</td><td>{t.comprador}</td><td>{t.cantidad}</td><td>{formatPrecio(t.precio)}</td><td>{formatPrecio(t.total)}</td><td><span className={`dash-estado ${t.comprador === perfil?.nombre_completo ? 'activo-compra' : 'activo'}`}>{t.comprador === perfil?.nombre_completo ? 'Compra' : 'Venta'}</span></td><td>{formatFecha(t.created_at)}</td></tr>))}</tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── ADMIN: PRODUCTOS ── */}
          {seccion === 'productos_admin' && esAdmin && (
            <div>
              <h2 className="dash-title">Todos los productos</h2>
              <p className="dash-subtitle">Listado completo de productos publicados en la plataforma.</p>
              <div className="dash-card">
                {todosProductos.length === 0 ? <p className="dash-empty">No hay productos publicados aún.</p> : (
                  <table className="dash-table"><thead><tr><th>Producto</th><th>Precio unitario</th><th>Valor total</th><th>Estado</th><th>Fecha</th></tr></thead>
                    <tbody>{todosProductos.map(p => (<tr key={p.id}><td>{nombreProducto(p.titulo)}</td><td>{formatPrecio(p.precio)}</td><td>{formatPrecio(parseFloat(p.categoria ?? '0'))}</td><td><span className={`dash-estado ${p.estado}`}>{p.estado}</span></td><td>{formatFecha(p.created_at)}</td></tr>))}</tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
