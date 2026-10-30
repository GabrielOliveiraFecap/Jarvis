import { useState, useEffect } from 'react'

function App() {
  const [version, setVersion] = useState('')
  useEffect(() => {
    async function loadVersion() {
      setVersion(await window.api.getVersion())
    }
    loadVersion()
  }, [])

  return (
    <main>
      <h1>Jarvis</h1>
      <p>Assistente pessoal</p>
      <p>{version}</p>
    </main>
  )
}

export default App
