import { useState, useEffect } from 'react'

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
    <main>
      <h1 className="text-3xl font-bold">Jarvis</h1>
      <p>Assistente pessoal</p>
      <p>{version}</p>

      {modes.map((mode) => (
        <button key={mode.id} disabled={loading} onClick={() => handleActivate(mode.id)}>
          {mode.name}
        </button>
      ))}

      {loading && <p>Abrindo...</p>}

      <ul>
        {results.map((result) => (
          <li key={result.id}>
            {result.id}: {result.status} {result.message}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
