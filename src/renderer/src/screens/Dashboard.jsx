import { useEffect, useState } from 'react'
import ModeCard from '../components/ModeCard'

export default function Dashboard() {
  const [error, setError] = useState('')
  const [applications, setApplications] = useState([])
  const [modes, setModes] = useState([])
  const [activating, setActivating] = useState(false)
  const [activateError, setActivateError] = useState('')
  const [lastActivation, setLastActivation] = useState(null)

  async function loadLastActivations() {
    try {
      setLastActivation(await window.api.lastModeActivation())
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    async function loadModes() {
      try {
        setModes(await window.api.listModes())
      } catch (error) {
        console.error(error)
      }
    }
    async function loadFirstActivation() {
      try {
        setLastActivation(await window.api.lastModeActivation())
      } catch (error) {
        console.error(error)
      }
    }
    loadModes()
    loadFirstActivation()
  }, [])

  async function handleActivate(id) {
    setActivating(true)
    setActivateError('')
    try {
      await window.api.activateMode(id)
      loadLastActivations()
    } catch (error) {
      console.error(error)
      setActivateError('Não foi possível ativar o modo')
    } finally {
      setActivating(false)
    }
  }

  //com set interval
  useEffect(() => {
    async function loadApplications() {
      try {
        setApplications(await window.api.listApplications())
        setError('')
      } catch (error) {
        setError(error.message)
        console.error(error)
      }
    }
    loadApplications()
    const id = setInterval(() => loadApplications(), 3000)

    return () => clearInterval(id)
  }, [])

  const total = applications.length
  const open = applications.filter((application) => application.running)
  const totalOpen = open.length

  const now = new Date()
  let text
  const name = 'Gabriel'
  const dataHoje = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
  if (now.getHours() < 12 && now.getHours() > 5) {
    text = `Olá ${name}. Bom dia!`
  } else if (now.getHours() < 18 && now.getHours() >= 12) {
    text = `Olá ${name}. Boa tarde!`
  } else {
    text = `Olá ${name}. Boa noite!`
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">{text}</h2>
        <p className="mt-1 text-sand first-letter:uppercase">{dataHoje}</p>
      </div>

      <div className="rounded-xl border border-line bg-panel px-5 py-4">
        {error ? (
          <p className="text-fail">Não foi possível verificar as aplicações</p>
        ) : (
          <>
            <p className="text-2xl font-semibold">
              {totalOpen} <span className="text-lg font-normal text-sand">de {total}</span>
            </p>
            <p className="mt-1 text-sand">aplicações abertas</p>

            {totalOpen > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                {open.map((application) => {
                  return (
                    <li
                      key={application.id}
                      className="flex items-center gap-2 rounded-full border border-line bg-ink px-3 py-1 text-sm"
                    >
                      <span className="size-2 rounded-full bg-ok" />
                      {application.name}
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
      </div>

      {lastActivation && (
        <div className="rounded-xl border border-line bg-panel px-5 py-4">
          <p className="text-sm font-medium tracking-widest text-sand uppercase">Último modo</p>
          <p className="mt-1 text-lg font-semibold">{lastActivation.modeName}</p>
          <p className="text-sand">
            {new Date(lastActivation.activatedAt).toLocaleString('pt-BR', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium tracking-widest text-sand uppercase">Ativação rápida</h2>
        {activateError && <p className="text-fail">{activateError}</p>}
        <div className="grid grid-cols-3 gap-4">
          {modes.map((mode) => (
            <ModeCard
              key={mode.id}
              name={mode.name}
              disabled={activating}
              onClick={() => handleActivate(mode.id)}
            />
          ))}
        </div>
      </section>

      {activating && <p className="text-sand">Abrindo aplicações...</p>}
    </>
  )
}
