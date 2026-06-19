// ================================================================
// OFFERTABLE — Tabla de ofertas (venta o compra)
// ================================================================

import Link from 'next/link'
import { OfertaVenta, OfertaCompra } from '@/types'
import { normalizarSlug } from '@/lib/utils'
import EmptyState from './EmptyState'
import BuyDirectRow from './BuyDirectRow'
import SellDirectRow from './SellDirectRow'

type Props =
  | {
      tipo: 'venta'
      ofertas: OfertaVenta[]
      duplicadoId: string | null
      usuarioId: string | null
      productoSlug: string
      onEliminar: (id: string) => Promise<void>
      onEjecutarDirecto: (idVenta: string, comprador: string, cantidad: number) => Promise<boolean>
    }
  | {
      tipo: 'compra'
      ofertas: OfertaCompra[]
      duplicadoId: string | null
      usuarioId: string | null
      productoSlug: string
      onEliminar: (id: string) => Promise<void>
      onEjecutarDirecto: (idCompra: string, vendedor: string, cantidad: number) => Promise<boolean>
    }

export default function OfferTable(props: Props) {
  const { tipo, ofertas, duplicadoId, usuarioId, productoSlug, onEliminar, onEjecutarDirecto } = props
  const esVenta = tipo === 'venta'

  return (
    <div className="market-table-wrapper">
      <table className="market-table">
        <thead>
          <tr>
            <th>
              <span className="th-doble">
                {esVenta ? 'Vendedor' : 'Comprador'}
                <br />
                <span className="th-secondary">
                  / {esVenta ? 'Comprador' : 'Vendedor'}
                </span>
              </span>
            </th>
            <th>Cantidad</th>
            <th>Precio Unidad</th>
            <th>Valor Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {ofertas.length === 0 ? (
            <EmptyState tipo={tipo} />
          ) : (
            <>
              {esVenta
                ? (ofertas as OfertaVenta[]).map(oferta => (
                    <>
                      <tr
                        key={oferta.id}
                        className={`oferta-nueva ${usuarioId === oferta.vendedor_id ? 'oferta-propia-venta' : ''} ${duplicadoId === oferta.id ? 'oferta-highlight' : ''}`}
                        data-oferta-id={oferta.id}
                      >
                        <td>
                          <i className="bi bi-person-fill-check text-success me-1"></i>
                          <Link href={`/perfil/${normalizarSlug(oferta.vendedor)}`} className="oferta-perfil-link">
                            <strong>{oferta.vendedor}</strong>
                          </Link>
                          {usuarioId && usuarioId === oferta.vendedor_id && (
                            <span className="badge-tu-oferta">Tu oferta</span>
                          )}
                        </td>
                        <td>
                          <input className="form-control form-control-sm locked-input" value={oferta.cantidad} type="text" readOnly />
                        </td>
                        <td>
                          <input className="form-control form-control-sm locked-input" value={oferta.precio} type="text" readOnly />
                        </td>
                        <td>
                          <input className="form-control form-control-sm locked-input" value={oferta.total.toFixed(2)} type="text" readOnly />
                        </td>
                        <td>
                          {usuarioId === oferta.vendedor_id && (
                            <button
                              type="button"
                              className="btn-action btn-vender"
                              onClick={async () => {
                                if (confirm('¿Eliminar esta oferta?')) {
                                  await onEliminar(oferta.id)
                                }
                              }}
                            >
                              <i className="bi bi-trash"></i> Quitar
                            </button>
                          )}
                        </td>
                      </tr>
                      <BuyDirectRow
                        key={`buy-${oferta.id}`}
                        oferta={oferta}
                        usuarioId={usuarioId}
                        productoSlug={productoSlug}
                        onEjecutar={onEjecutarDirecto as (id: string, nombre: string, cantidad: number) => Promise<boolean>}
                      />
                    </>
                  ))
                : (ofertas as OfertaCompra[]).map(oferta => (
                    <>
                      <tr
                        key={oferta.id}
                        className={`oferta-nueva-compra ${usuarioId === oferta.comprador_id ? 'oferta-propia-compra' : ''} ${duplicadoId === oferta.id ? 'oferta-highlight' : ''}`}
                        data-oferta-id={oferta.id}
                      >
                        <td>
                          <i className="bi bi-person-fill-check text-primary me-1"></i>
                          <Link href={`/perfil/${normalizarSlug(oferta.comprador)}`} className="oferta-perfil-link">
                            <strong>{oferta.comprador}</strong>
                          </Link>
                          {usuarioId && usuarioId === oferta.comprador_id && (
                            <span className="badge-tu-oferta-compra">Tu oferta</span>
                          )}
                        </td>
                        <td>
                          <input className="form-control form-control-sm locked-input" value={oferta.cantidad} type="text" readOnly />
                        </td>
                        <td>
                          <input className="form-control form-control-sm locked-input" value={oferta.precio} type="text" readOnly />
                        </td>
                        <td>
                          <input className="form-control form-control-sm locked-input" value={oferta.total.toFixed(2)} type="text" readOnly />
                        </td>
                        <td>
                          {usuarioId === oferta.comprador_id && (
                            <button
                              type="button"
                              className="btn-action btn-comprar"
                              onClick={async () => {
                                if (confirm('¿Eliminar esta oferta?')) {
                                  await onEliminar(oferta.id)
                                }
                              }}
                            >
                              <i className="bi bi-trash"></i> Quitar
                            </button>
                          )}
                        </td>
                      </tr>
                      <SellDirectRow
                        key={`sell-${oferta.id}`}
                        oferta={oferta}
                        usuarioId={usuarioId}
                        productoSlug={productoSlug}
                        onEjecutar={onEjecutarDirecto as (id: string, nombre: string, cantidad: number) => Promise<boolean>}
                      />
                    </>
                  ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
