'use client'

import { Producto } from '@/types'
import { useOfertas } from '@/hooks/useOfertas'
import PublishOfferForm from './PublishOfferForm'
import OfferTable from './OfferTable'
import VoucherModal, { DatosVoucher } from './VoucherModal'
import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { PRODUCTOS } from '@/lib/productos'

interface Props {
  producto: Producto
}

export default function OfertasSection({ producto }: Props) {
  const {
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
  } = useOfertas(producto.slug)

  const [usuario, setUsuario] = useState<User | null>(null)
  const [voucher, setVoucher] = useState<DatosVoucher | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session?.user ?? null)
    })
  }, [])

  function nombreProducto() {
    const p = PRODUCTOS.find(x => x.slug === producto.slug)
    if (!p) return producto.slug
    return `${p.nombre} · ${p.detalle}`.replace(/\s*×\s*\d+\s*unidades/g, '')
  }

  async function handleCompraDirecta(idVenta: string, comprador: string, cantidad: number): Promise<boolean> {
    const oferta = ofertasVenta.find(o => o.id === idVenta)
    if (!oferta) return false

    // Cargar perfil del vendedor ANTES de ejecutar
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('nombre_completo, email, telefono, rut_personal, nombre_empresa, rut_empresa, direccion_empresa, horario_atencion')
      .eq('id', oferta.vendedor_id)
      .single()

    const exito = await ejecutarCompraDirecta(idVenta, comprador, cantidad)

    if (exito) {
      setVoucher({
        tipo: 'compra',
        fecha: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        producto: nombreProducto(),
        vendedor: oferta.vendedor,
        comprador,
        cantidad,
        precioUnitario: oferta.precio,
        total: cantidad * oferta.precio,
        nombreCompleto: perfil?.nombre_completo ?? null,
        email: perfil?.email ?? null,
        telefono: perfil?.telefono ?? null,
        rutPersonal: perfil?.rut_personal ?? null,
        nombreEmpresa: perfil?.nombre_empresa ?? null,
        rutEmpresa: perfil?.rut_empresa ?? null,
        direccionEmpresa: perfil?.direccion_empresa ?? null,
        horarioAtencion: perfil?.horario_atencion ?? null,
      })
    }
    return exito
  }

  async function handleVentaDirecta(idCompra: string, vendedor: string, cantidad: number): Promise<boolean> {
    const oferta = ofertasCompra.find(o => o.id === idCompra)
    if (!oferta) return false

    // Cargar perfil del comprador ANTES de ejecutar
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('nombre_completo, email, telefono, rut_personal, nombre_empresa, rut_empresa, direccion_empresa, horario_atencion')
      .eq('id', oferta.comprador_id)
      .single()

    const exito = await ejecutarVentaDirecta(idCompra, vendedor, cantidad)

    if (exito) {
      setVoucher({
        tipo: 'venta',
        fecha: new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        producto: nombreProducto(),
        vendedor,
        comprador: oferta.comprador,
        cantidad,
        precioUnitario: oferta.precio,
        total: cantidad * oferta.precio,
        nombreCompleto: perfil?.nombre_completo ?? null,
        email: perfil?.email ?? null,
        telefono: perfil?.telefono ?? null,
        rutPersonal: perfil?.rut_personal ?? null,
        nombreEmpresa: perfil?.nombre_empresa ?? null,
        rutEmpresa: perfil?.rut_empresa ?? null,
        direccionEmpresa: perfil?.direccion_empresa ?? null,
        horarioAtencion: perfil?.horario_atencion ?? null,
      })
    }
    return exito
  }

  return (
    <>
      {/* Voucher modal — vive en OfertasSection para no desmontarse */}
      {voucher && <VoucherModal datos={voucher} onCerrar={() => setVoucher(null)} />}

      {/* ===== SECCIÓN VENDER ===== */}
      <section className="market-section market-section-alt">
        <div className="container">
          <h2 className="section-title">
            <span className="section-title-icon sell">
              <i className="bi bi-currency-dollar"></i>
            </span>
            Ofertas para Vender
          </h2>

          <PublishOfferForm
            tipo="venta"
            onPublicar={(nombre, cantidad, precio) =>
              publicarVenta(nombre, cantidad, precio)
            }
          />

          <OfferTable
            tipo="venta"
            ofertas={ofertasVenta}
            duplicadoId={duplicadoVentaId}
            usuarioId={usuario?.id ?? null}
            productoSlug={producto.slug}
            onEliminar={eliminarVenta}
            onEjecutarDirecto={handleCompraDirecta}
          />

          <div className="table-info">
            <i className="bi bi-info-circle-fill"></i>
            Ingresa la cantidad y el precio por unidad para calcular el total automáticamente.
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN COMPRAR ===== */}
      <section className="market-section">
        <div className="container">
          <h2 className="section-title">
            <span className="section-title-icon buy">
              <i className="bi bi-cart-fill"></i>
            </span>
            Ofertas para Comprar
          </h2>

          <PublishOfferForm
            tipo="compra"
            onPublicar={(nombre, cantidad, precio) =>
              publicarCompra(nombre, cantidad, precio)
            }
          />

          <OfferTable
            tipo="compra"
            ofertas={ofertasCompra}
            duplicadoId={duplicadoCompraId}
            usuarioId={usuario?.id ?? null}
            productoSlug={producto.slug}
            onEliminar={eliminarCompra}
            onEjecutarDirecto={handleVentaDirecta}
          />

          <div className="table-info">
            <i className="bi bi-info-circle-fill"></i>
            Ingresa la cantidad y el precio que estás dispuesto a pagar por unidad.
          </div>
        </div>
      </section>
    </>
  )
}
