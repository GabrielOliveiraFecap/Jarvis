export default function ApplicationItem({ name, running }) {
  let text
  let className

  if (running) {
    text = 'Aberto'
    className = 'text-ok'
  } else {
    text = 'Fechado'
    className = 'text-sand'
  }

  return (
    <li className="flex justify-between px-5 py-4">
      <span>{name}</span>
      <span className={className}>{text}</span>
    </li>
  )
}
