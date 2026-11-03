import { useState, useEffect } from 'react'
import ModeCard from '../components/ModeCard'
import ResultItem from '../components/ResultItem'

export default function Modes() {
  const [modes, setModes] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadModes() {
      setModes(await window.api.listModes())
    }
    loadModes()
  }, [])

  async function handleActivate(id) {
    setLoading(true)
    setResults([])
    try {
      setResults(await window.api.activateMode(id))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium tracking-widest text-sand uppercase">Modos</h2>
        <div className="grid grid-cols-3 gap-4">
          {modes.map((mode) => (
            <ModeCard
              key={mode.id}
              name={mode.name}
              disabled={loading}
              onClick={() => handleActivate(mode.id)}
            />
          ))}
        </div>
      </section>

      {loading && <p className="text-sand">Abrindo aplicações...</p>}

      {results.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium tracking-widest text-sand uppercase">Resultado</h2>
          <ul className="divide-y divide-line rounded-xl border border-line bg-panel">
            {results.map((result) => (
              <ResultItem
                key={result.id}
                id={result.id}
                status={result.status}
                message={result.message}
              />
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
