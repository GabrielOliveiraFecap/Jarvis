import { applications } from './applications'

export async function listApplications() {
  return applications
}

export async function getApplication(id) {
  return applications.find((application) => application.id === id)
}
