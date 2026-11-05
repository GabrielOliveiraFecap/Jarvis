import { useEffect, useState } from 'react'
import ApplicationItem from '../components/ApplicationItem'

export default function Settings() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modes, setModes] = useState([])

  useEffect(() => {
    async function loadModes() {
      try {
        setModes(await window.api.listModes())
      } catch (error) {
        console.error(error)
      }
    }
    loadModes()
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

  return (
    <>
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
