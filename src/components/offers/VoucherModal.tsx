'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export interface DatosVoucher {
  tipo: 'compra' | 'venta'
  fecha: string
  producto: string
  vendedor: string
  comprador: string
  cantidad: number
  precioUnitario: number
  total: number
  // Perfil del usuario actual
  nombreCompleto: string | null
  email: string | null
  telefono: string | null
  rutPersonal: string | null
  nombreEmpresa: string | null
  rutEmpresa: string | null
  direccionEmpresa: string | null
  horarioAtencion: string | null
}

interface Props {
  datos: DatosVoucher
  onCerrar: () => void
}

function fmt(n: number) {
  return n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
}

export default function VoucherModal({ datos, onCerrar }: Props) {
  const voucherRef = useRef<HTMLDivElement>(null)

  // Cerrar con Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onCerrar])

  async function handleDescargarPDF() {
    const { default: html2pdf } = await import('html2pdf.js')
    const element = voucherRef.current
    if (!element) return
    html2pdf().set({
      margin: 10,
      filename: `voucher-${datos.tipo}-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(element).save()
  }

  function handleImprimir() {
    const contenido = voucherRef.current?.innerHTML
    if (!contenido) return
    const ventana = window.open('', '_blank')
    if (!ventana) return
    ventana.document.write(`
      <html>
        <head>
          <title>Voucher Vykam</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 32px; color: #1a1a2e; }
            .voucher-header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #4f46e5; padding-bottom: 16px; }
            .voucher-logo { font-size: 1.5rem; font-weight: 800; color: #4f46e5; }
            .voucher-badge { display: inline-block; background: #4f46e5; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; margin-top: 8px; }
            .voucher-section { margin-bottom: 20px; }
            .voucher-section-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 600; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
            .voucher-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.9rem; border-bottom: 1px dashed #f3f4f6; }
            .voucher-row:last-child { border-bottom: none; }
            .voucher-row-label { color: #6b7280; }
            .voucher-row-value { font-weight: 500; text-align: right; max-width: 60%; }
            .voucher-total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 1rem; font-weight: 700; border-top: 2px solid #4f46e5; margin-top: 8px; color: #4f46e5; }
            .voucher-footer { text-align: center; font-size: 0.75rem; color: #9ca3af; margin-top: 24px; }
          </style>
        </head>
        <body>${contenido}</body>
      </html>
    `)
    ventana.document.close()
    ventana.focus()
    ventana.print()
    ventana.close()
  }

  const esCompra = datos.tipo === 'compra'

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }} onClick={onCerrar}>
      <div style={{
        background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem 1rem 0', justifyContent: 'flex-end' }}>
          <button onClick={handleDescargarPDF} style={{
            background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8,
            padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            <i className="bi bi-download" /> Descargar PDF
          </button>
          <button onClick={handleImprimir} style={{
            background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8,
            padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            <i className="bi bi-printer" /> Imprimir
          </button>
          <button onClick={onCerrar} style={{
            background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8,
            padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem',
          }}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Contenido del voucher */}
        <div ref={voucherRef} style={{ padding: '1.5rem' }}>

          {/* Header */}
          <div className="voucher-header" style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px solid #4f46e5', paddingBottom: 16 }}>
            <div className="voucher-logo" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5' }}>Vykam</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: 8 }}>Comprobante de {esCompra ? 'Compra' : 'Venta'}</div>
            <div className="voucher-badge" style={{ display: 'inline-block', background: esCompra ? '#2563eb' : '#16a34a', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', marginTop: 8 }}>
              {esCompra ? '🛒 Compra directa' : '💰 Venta directa'}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: 8 }}>{datos.fecha}</div>
          </div>

          {/* Detalle de la transacción */}
          <div className="voucher-section" style={{ marginBottom: 20 }}>
            <div className="voucher-section-title" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', fontWeight: 600, marginBottom: 8, borderBottom: '1px solid #e5e7eb', paddingBottom: 4 }}>
              Detalle de la transacción
            </div>
            {[
              ['Producto', datos.producto],
              ['Vendedor', datos.vendedor],
              ['Comprador', datos.comprador],
              ['Cantidad', String(datos.cantidad)],
              ['Precio unitario', fmt(datos.precioUnitario)],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', borderBottom: '1px dashed #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '1rem', fontWeight: 700, borderTop: '2px solid #4f46e5', marginTop: 8, color: '#4f46e5' }}>
              <span>TOTAL</span>
              <span>{fmt(datos.total)}</span>
            </div>
          </div>

          {/* Información personal */}
          {(datos.nombreCompleto || datos.email || datos.telefono || datos.rutPersonal) && (
            <div className="voucher-section" style={{ marginBottom: 20 }}>
              <div className="voucher-section-title" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', fontWeight: 600, marginBottom: 8, borderBottom: '1px solid #e5e7eb', paddingBottom: 4 }}>
                Información personal
              </div>
              {[
                ['Nombre', datos.nombreCompleto],
                ['Email', datos.email],
                ['Teléfono', datos.telefono],
                ['RUT personal', datos.rutPersonal],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', borderBottom: '1px dashed #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Información de empresa */}
          {(datos.nombreEmpresa || datos.rutEmpresa || datos.direccionEmpresa || datos.horarioAtencion) && (
            <div className="voucher-section" style={{ marginBottom: 20 }}>
              <div className="voucher-section-title" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', fontWeight: 600, marginBottom: 8, borderBottom: '1px solid #e5e7eb', paddingBottom: 4 }}>
                Información de empresa
              </div>
              {[
                ['Empresa', datos.nombreEmpresa],
                ['RUT empresa', datos.rutEmpresa],
                ['Dirección', datos.direccionEmpresa],
                ['Horario', datos.horarioAtencion],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', borderBottom: '1px dashed #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: 24, borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
            Gracias por usar Vykam · Marketplace de Papel
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}
