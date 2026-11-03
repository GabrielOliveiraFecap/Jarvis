import { useState, useEffect } from 'react'
import ModeCard from './components/ModeCard'
import ResultItem from './components/ResultItem'

function App() {
  const [version, setVersion] = useState('')
  const [modes, setModes] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadVersion() {
      setVersion(await window.api.getVersion())
    }
    async function loadModes() {
      setModes(await window.api.listModes())
    }
    loadVersion()
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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-8 py-12">
      <header className="relative border-b border-line pb-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Jarvis</h1>
        <p className="mt-1 text-sand">Assistente pessoal</p>
        <span className="absolute top-0 right-0 text-sm text-sand">v{version}</span>
      </header>

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
    </main>
  )
}

export default App
