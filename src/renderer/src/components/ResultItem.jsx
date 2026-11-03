const statusLabels = {
  launched: { text: 'Aberto', className: 'text-ok' },
  'already-running': { text: 'Já estava aberto', className: 'text-warn' },
  error: { text: 'Erro', className: 'text-fail' }
}

export default function ResultItem({ id, status, message }) {
  const label = statusLabels[status]

  return (
    <li className="flex flex-col gap-1 px-5 py-4">
      <div className="flex justify-between">
        <span>{id}</span>
        <span className={label.className}>{label.text}</span>
      </div>
      {message && <p className="text-sm text-sand">{message}</p>}
    </li>
  )
}
