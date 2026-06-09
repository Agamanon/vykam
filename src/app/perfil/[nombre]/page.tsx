// src/app/perfil/[nombre]/page.tsx
// Página de perfil público — solo lectura

import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  params: Promise<{ nombre: string }>
}

function slugToNombre(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, ' ')
}

export default async function PerfilPublicoPage({ params }: Props) {
  const { nombre } = await params
  const nombreBuscado = slugToNombre(nombre)

  // Buscar perfil por nombre_completo (case-insensitive)
  // Fetch all perfiles and find by normalized name
  const { data: perfiles } = await supabaseServer
    .from('perfiles')
    .select('id, nombre_completo, avatar_url, email, telefono, nombre_empresa, direccion_empresa, horario_atencion, created_at')

  const normalize = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-')

  const perfil = (perfiles ?? []).find(p => normalize(p.nombre_completo ?? '') === normalize(nombre))

console.log('nombre del param:', nombre)
console.log('perfiles encontrados:', perfiles?.map(p => ({ nombre: p.nombre_completo, normalizado: normalize(p.nombre_completo ?? '') })))
console.log('perfil encontrado:', perfil)

  if (!perfil) notFound()

  function iniciales(nombre: string | null) {
    if (!nombre) return '?'
    return nombre.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
  }

  function formatFecha(iso: string) {
    return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  return (
    <>
      {/* Miga de pan */}
      <section className="breadcrumb-section">
        <div className="container">
          <div className="breadcrumb-custom">
            <Link href="/"><i className="bi bi-house-fill"></i> Inicio</Link>
            <i className="bi bi-chevron-right" style={{ fontSize: '0.7rem' }}></i>
            <span>Perfil de {perfil.nombre_completo}</span>
          </div>
        </div>
      </section>

      {/* Card de perfil */}
      <section style={{ padding: '3rem 0', minHeight: '60vh', background: 'var(--light)' }}>
        <div className="container">
          <div style={{ maxWidth: 560, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

            {/* Header con avatar */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark, #3730a3) 100%)', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {perfil.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={perfil.avatar_url} alt={perfil.nombre_completo ?? ''} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#fff', border: '3px solid rgba(255,255,255,0.5)' }}>
                  {iniciales(perfil.nombre_completo)}
                </div>
              )}
              <div>
                <h1 style={{ color: '#fff', margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>{perfil.nombre_completo}</h1>
                {perfil.nombre_empresa && (
                  <p style={{ color: 'rgba(255,255,255,0.85)', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
                    <i className="bi bi-building me-1"></i>{perfil.nombre_empresa}
                  </p>
                )}
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                  Miembro desde {formatFecha(perfil.created_at)}
                </p>
              </div>
            </div>

            {/* Información de contacto */}
            <div style={{ padding: '1.5rem' }}>

              {(perfil.email || perfil.telefono) && (
                <>
                  <p style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem' }}>
                    Información personal
                  </p>
                  {perfil.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                      <i className="bi bi-envelope-fill" style={{ color: 'var(--primary)', width: 20 }}></i>
                      <span style={{ color: '#374151' }}>{perfil.email}</span>
                    </div>
                  )}
                  {perfil.telefono && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                      <i className="bi bi-telephone-fill" style={{ color: 'var(--primary)', width: 20 }}></i>
                      <span style={{ color: '#374151' }}>{perfil.telefono}</span>
                    </div>
                  )}
                </>
              )}

              {(perfil.nombre_empresa || perfil.direccion_empresa || perfil.horario_atencion) && (
                <>
                  <p style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '1.25rem 0 0.75rem' }}>
                    Información de empresa
                  </p>
                  {perfil.nombre_empresa && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                      <i className="bi bi-building" style={{ color: 'var(--primary)', width: 20 }}></i>
                      <span style={{ color: '#374151' }}>{perfil.nombre_empresa}</span>
                    </div>
                  )}
                  {perfil.direccion_empresa && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                      <i className="bi bi-geo-alt-fill" style={{ color: 'var(--primary)', width: 20 }}></i>
                      <span style={{ color: '#374151' }}>{perfil.direccion_empresa}</span>
                    </div>
                  )}
                  {perfil.horario_atencion && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                      <i className="bi bi-clock-fill" style={{ color: 'var(--primary)', width: 20 }}></i>
                      <span style={{ color: '#374151' }}>{perfil.horario_atencion}</span>
                    </div>
                  )}
                </>
              )}

              <div style={{ marginTop: '1.5rem' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                  <i className="bi bi-arrow-left"></i> Volver al sitio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
