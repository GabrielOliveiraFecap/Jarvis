const items = [
  { id: 'modes', label: 'Modos' },
  { id: 'chat', label: 'Chat' },
  { id: 'settings', label: 'Configurações' }
]

export default function Sidebar({ current, onChange }) {
  return (
    <nav className="flex w-52 shrink-0 flex-col gap-1 border-r border-line p-4">
      {items.map((item) => {
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={
              item.id === current
                ? 'rounded-lg bg-panel px-4 py-2 text-left text-cream'
                : 'rounded-lg px-4 py-2 text-left text-sand hover:bg-panel hover:text-cream'
            }
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
