import { app, ipcMain } from 'electron'
import { getApplication } from './config/configStore'
import { launchApplication } from './launcher'

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
}
