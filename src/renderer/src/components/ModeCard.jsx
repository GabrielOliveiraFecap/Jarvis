export default function ModeCard({ name, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="rounded-xl border border-line bg-panel px-5 py-6 text-left font-medium transition-colors hover:border-cream/40 hover:bg-panel-hover disabled:cursor-not-allowed disabled:opacity-50"
    >
      {name}
    </button>
  )
}
