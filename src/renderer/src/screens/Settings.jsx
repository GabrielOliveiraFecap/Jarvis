import { useEffect, useState } from 'react'
import ApplicationItem from '../components/ApplicationItem'
import Switch from '../components/Switch'

export default function Settings() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modes, setModes] = useState([])
  const [userName, setUserName] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [startWithWindows, setStartWithWindows] = useState(true)
  const [toggleError, setToggleError] = useState('')

  useEffect(() => {
    async function loadModes() {
      try {
        setModes(await window.api.listModes())
      } catch (error) {
        console.error(error)
      }
    }
    async function loadUserName() {
      try {
        setUserName((await window.api.getSettings('userName')) || '')
      } catch (error) {
        console.error(error)
      }
    }
    async function loadAutoStart() {
      try {
        const saved = await window.api.getSettings('startWithWindows')
        setStartWithWindows(saved !== 'false')
      } catch (error) {
        console.error(error)
      }
    }

    loadModes()
    loadUserName()
    loadAutoStart()
  }, [])

  useEffect(() => {
    async function loadApplications() {
      try {
        setApplications(await window.api.listApplications())
        setError('')
      } catch (error) {
        setError(error.message)
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadApplications()
    const id = setInterval(() => loadApplications(), 3000)

    return () => clearInterval(id)
  }, [])

  async function handleSave(event) {
    event.preventDefault()
    setSaveMessage('')
    try {
      await window.api.setSettings('userName', userName)
      setSaveMessage('Salvo!')
    } catch (error) {
      setSaveMessage('Não foi possível salvar')
      console.error(error)
    }
  }

  async function handleToggle(checked) {
    setToggleError('')
    try {
      await window.api.setSettings('startWithWindows', String(checked))
      setStartWithWindows(checked)
    } catch (error) {
      setToggleError('Não foi possível alterar essa configuração')
      console.error(error)
    }
  }

  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium tracking-widest text-sand uppercase">Perfil</h2>
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-3 rounded-xl border border-line bg-panel px-5 py-4"
        >
          <label htmlFor="userName" className="text-sand">
            Seu nome
          </label>
          <div className="flex gap-2">
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="Como o Jarvis deve te chamar"
              className="flex-1 rounded-xl border border-line bg-ink px-4 py-3 placeholder:text-sand focus:border-cream/40 focus:outline-none"
            />
            <button className="rounded-xl bg-cream px-5 font-medium text-ink hover:bg-cream/90">
              Salvar
            </button>
          </div>
          {saveMessage && <p className="text-sm text-sand">{saveMessage}</p>}
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium tracking-widest text-sand uppercase">Sistema</h2>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-panel px-5 py-4">
          <div>
            <p>Iniciar com o Windows</p>
            <p className="text-sm text-sand">
              O Jarvis abre em segundo plano ao ligar o computador
            </p>
          </div>
          <Switch checked={startWithWindows} onChange={handleToggle} />
        </div>
        {toggleError && <p className="text-fail">{toggleError}</p>}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium tracking-widest text-sand uppercase">Modos</h2>
        <ul className="divide-y divide-line rounded-xl border border-line bg-panel">
          {modes.map((mode) => (
            <li key={mode.id} className="flex justify-between gap-4 px-5 py-4">
              <span>{mode.name}</span>
              <span className="text-right text-sand">{mode.applications.join(', ')}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium tracking-widest text-sand uppercase">Aplicações</h2>
        {error && <p className="text-fail">Não foi possível verificar as aplicações</p>}
        {loading ? (
          <p className="text-sand">Carregando...</p>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-panel">
            {applications.map((application) => (
              <ApplicationItem
                key={application.id}
                name={application.name}
                running={application.running}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
