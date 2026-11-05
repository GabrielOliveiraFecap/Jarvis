import { getDatabase } from '../database'
import { applications } from './applications'
import { modes } from './modes'

db = getDatabase()

async function rowToApplication(row){
  db.run(
    ` SELECT id, name, process_name AS processName, executable_path, args, alwaysLaunch, riotProduct FROM applications
    `
  )
}

export async function listApplications() {
  return applications
}

export async function getApplication(id) {
  return applications.find((application) => application.id === id)
}

export async function listModes() {
  return modes
}
export async function getMode(id) {
  return modes.find((mode) => mode.id === id)
}
