import { launchApplication } from './launcher'
import { getMode } from './config/configStore'
import { getApplication } from './config/configStore'

export async function activateMode(modeId) {
  const mode = await getMode(modeId)
  if (!mode) {
    throw new Error('Modo desconhecido')
  }

  const results = []
  for (const applicationId of mode.applicationIds) {
    const application = await getApplication(applicationId)
    try {
      const status = await launchApplication(application)
      results.push({ id: applicationId, status })
    } catch (error) {
      results.push({ id: applicationId, status: 'error', message: error.message })
    }
  }
  return results
}
