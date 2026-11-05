import { applications } from './config/applications'
import { modes } from './config/modes'

export function seedDatabase(db) {
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM applications').get()
  if (total > 0) {
    return
  }

  const insertApplication = db.prepare(`
    INSERT INTO applications
      (id, name, process_name, executable_path, args, always_launch, riot_product)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  const insertMode = db.prepare('INSERT INTO modes (id, name) VALUES (?, ?)')
  const insertModeApplication = db.prepare(`
    INSERT INTO mode_applications (mode_id, application_id, position)
    VALUES (?, ?, ?)
  `)

  db.exec('BEGIN')
  try {
    for (const application of applications) {
      insertApplication.run(
        application.id,
        application.name,
        application.processName,
        application.executablePath,
        JSON.stringify(application.args),
        application.alwaysLaunch ? 1 : 0,
        application.riotProduct ? JSON.stringify(application.riotProduct) : null
      )
    }

    for (const mode of modes) {
      insertMode.run(mode.id, mode.name)

      for (let i = 0; i < mode.applicationIds.length; i++) {
        insertModeApplication.run(mode.id, mode.applicationIds[i], i)
      }
    }

    db.exec('COMMIT') // confirma tudo
  } catch (error) {
    db.exec('ROLLBACK') // desfaz tudo
    throw error // repassa o erro, para o Jarvis avisar
  }
}
