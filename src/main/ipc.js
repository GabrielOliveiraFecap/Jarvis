import { app, ipcMain } from 'electron'
import { getApplication, listApplications, listModes } from './config/configStore'
import { launchApplication } from './launcher'
import { listRunningProcesses, isApplicationRunning } from './processList'
import { activateMode } from './modeManager'

//cadastro da "rota"
//tipo app.get('/version', () => ...)
export function registerIpcHandlers() {
  ipcMain.handle('app:getVersion', () => app.getVersion())

  ipcMain.handle('applications:launch', async (event, id) => {
    const application = await getApplication(id)
    if (!application) {
      throw new Error('Aplicação desconhecida')
    }
    return launchApplication(application)
  })

  ipcMain.handle('applications:list', async () => {
    const applications = await listApplications()
    const processes = await listRunningProcesses()
    const resultado = applications.map((application) => {
      return {
        id: application.id,
        name: application.name,
        running: isApplicationRunning(application, processes)
      }
    })
    return resultado
  })

  ipcMain.handle('modes:activate', (event, id) => {
    return activateMode(id)
  })

  ipcMain.handle('modes:list', async () => {
    const modes = await listModes()
    const result = []

    for (const mode of modes) {
      const applications = []

      for (const applicationId of mode.applicationIds) {
        const application = await getApplication(applicationId)
        if (application) {
          applications.push(application.name)
        }
      }

      result.push({ id: mode.id, name: mode.name, applications })
    }

    return result
  })
}
