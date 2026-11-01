import { applications } from './applications'
import { modes } from './modes'

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
