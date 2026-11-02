import { app, ipcMain } from 'electron'
import { getApplication, listApplications } from './config/configStore'
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
}
