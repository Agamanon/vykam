// ================================================================
// EMPTYSTATE — Mensaje cuando la tabla de ofertas está vacía
// ================================================================

interface Props {
  tipo: 'venta' | 'compra'
}

export default function EmptyState({ tipo }: Props) {
  const esVenta = tipo === 'venta'

  return (
    <tr className={`empty-row ${esVenta ? 'sell' : 'buy'}`}>
      <td colSpan={5}>
        <div className="empty-message">
          <i className={`bi ${esVenta ? 'bi-cart-x' : 'bi-bag-x'}`}></i>
          <p className="empty-message-title">
            {esVenta ? 'Aún no hay ofertas de venta' : 'Aún no hay ofertas de compra'}
          </p>
          <p className="empty-message-subtitle">
            ¡Sé el primero en publicar! Usa el formulario de arriba para{' '}
            <span className="empty-cta">{esVenta ? 'vender' : 'comprar'}</span>.
          </p>
        </div>
      </td>
    </tr>
  )
}
