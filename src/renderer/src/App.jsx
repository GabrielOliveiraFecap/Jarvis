import { useState, useEffect } from 'react'
import Modes from './screens/Modes'
import Sidebar from './components/Sidebar'
import TitleBar from './components/TitleBar'
import Chat from './screens/Chat'
import Settings from './screens/Settings'
import Dashboard from './screens/Dashboard'

function App() {
  const [screen, setScreen] = useState('dashboard')
  const [version, setVersion] = useState('')

  useEffect(() => {
    async function loadVersion() {
      setVersion(await window.api.getVersion())
    }
    loadVersion()
  }, [])

  return (
    <div className="flex h-screen flex-col">
      <TitleBar />

      <div className="flex min-h-0 flex-1">
        <Sidebar current={screen} onChange={setScreen} />

        <div className="flex-1 overflow-y-auto">
          <main className="mx-auto flex max-w-3xl flex-col gap-10 px-8 py-12">
            <header className="relative border-b border-line pb-6 text-center">
              <h1 className="text-4xl font-semibold tracking-tight">Jarvis</h1>
              <p className="mt-1 text-sand">Assistente pessoal</p>
              {screen === 'settings' && (
                <span className="absolute top-0 right-0 text-sm text-sand">v{version}</span>
              )}
            </header>

            {screen === 'dashboard' && <Dashboard />}
            {screen === 'modes' && <Modes />}
            {screen === 'chat' && <Chat />}
            {screen === 'settings' && <Settings />}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
