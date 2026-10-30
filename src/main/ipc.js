import { app, ipcMain } from 'electron'

//cadastro da "rota"
//tipo app.get('/version', () => ...)
export function registerIpcHandlers() {
  ipcMain.handle('app:getVersion', () => app.getVersion())
}
