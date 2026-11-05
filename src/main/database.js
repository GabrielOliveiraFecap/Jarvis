import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { app } from 'electron'

export function openDatabase() {
  const path = join(app.getPath('userData'), 'jarvis.db')
  const db = new DatabaseSync(path)
  return db
}
