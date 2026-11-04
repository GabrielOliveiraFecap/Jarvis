import { useState, useEffect } from 'react'
import ModeCard from '../components/ModeCard'
import ResultItem from '../components/ResultItem'

export default function Modes() {
  const [modes, setModes] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadModes() {
      try {
        setModes(await window.api.listModes())
      } catch (error) {
        setError('Não foi possível carregar os modos')
        console.error(error)
      }
    }
    loadModes()
  }, [])

  async function handleActivate(id) {
    setLoading(true)
    setResults([])
    setError('')
    try {
      setResults(await window.api.activateMode(id))
    } catch (error) {
      setError('Não foi possível ativar o modo')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium tracking-widest text-sand uppercase">Modos</h2>
        {error && <p className="text-fail">{error}</p>}
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
