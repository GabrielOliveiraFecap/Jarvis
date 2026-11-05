import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { app } from 'electron'

let db

export function openDatabase() {
  const path = join(app.getPath('userData'), 'jarvis.db')
  const db = new DatabaseSync(path)
  db.exec('PRAGMA foreign_keys = ON')
  return db
}

export function getDatabase() {
  return db
}