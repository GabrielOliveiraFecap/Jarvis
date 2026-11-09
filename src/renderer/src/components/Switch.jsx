export default function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-cream' : 'bg-line'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-5 rounded-full transition-transform ${checked ? 'translate-x-5 bg-ink' : 'bg-sand'}`}
      />
    </button>
  )
}
