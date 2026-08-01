interface Props {
  mensaje: string
}

export default function TableInfo({ mensaje }: Props) {
  return (
    <div className="table-info">
      <i className="bi bi-info-circle-fill"></i>
      {mensaje}
    </div>
  )
}
