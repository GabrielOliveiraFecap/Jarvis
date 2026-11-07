import { getDatabase } from '../database'

function rowToApplication(row) {
  return {
    id: row.id,
    name: row.name,
    processName: row.process_name,
    executablePath: row.executable_path,
    args: JSON.parse(row.args),
    alwaysLaunch: row.always_launch === 1,
    riotProduct: row.riot_product ? JSON.parse(row.riot_product) : null
  }
}

export async function listApplications() {
  const db = getDatabase()
  const rows = db.prepare('SELECT * FROM applications').all()
  return rows.map(rowToApplication)
}

export async function getApplication(id) {
  const db = getDatabase()
  const row = db.prepare('SELECT * FROM applications WHERE id = ?').get(id)
  if (row === undefined) {
    return undefined
  }
  return rowToApplication(row)
}

function rowToMode(row) {
  const db = getDatabase()
  const links = db
    .prepare('SELECT application_id FROM mode_applications WHERE mode_id = ? ORDER BY position')
    .all(row.id)

  return {
    id: row.id,
    name: row.name,
    applicationIds: links.map((link) => link.application_id)
  }
}

export async function listModes() {
  const db = getDatabase()
  const rows = db.prepare('SELECT * FROM modes').all()
  return rows.map(rowToMode)
}

export async function getMode(id) {
  const db = getDatabase()
  const row = db.prepare('SELECT * FROM modes WHERE id = ?').get(id)
  if (row === undefined) {
    return undefined
  }
  return rowToMode(row)
}

export async function recordModeActivation(modeId) {
  const db = getDatabase()
  db.prepare('INSERT INTO mode_activations (mode_id, activated_at) VALUES (?, ?)').run(
    modeId,
    new Date().toISOString()
  )
}

export async function getLastModeActivation() {
  const db = getDatabase()
  const row = db
    .prepare(
      'SELECT m.name, ma.activated_at FROM mode_activations ma JOIN modes m ON ma.mode_id = m.id ORDER BY ma.id DESC LIMIT 1'
    )
    .get()
  if (row === undefined) {
    return null
  }
  return {
    modeName: row.name,
    activatedAt: row.activated_at
  }
}

export async function getSetting(key) {
  const db = getDatabase()
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key)
  if (row === undefined) {
    return null
  }

  return row.value
}

export async function setSetting(key, value) {
  const db = getDatabase()
  const row = db
    .prepare(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
    )
    .run(key, value)
  if (row === undefined) {
    return null
  }
}
