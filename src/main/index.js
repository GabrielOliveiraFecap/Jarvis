import { app, BrowserWindow, dialog } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from './window'
import { registerIpcHandlers } from './ipc'

async function start() {
  await app.whenReady()

  electronApp.setAppUserModelId('jarvis.gabriel')

  registerIpcHandlers()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

start().catch((error) => {
  console.error('Falha ao iniciar o Jarvis:', error)
  dialog.showErrorBox('Erro ao iniciar o Jarvis', error.message)
  app.exit(1)
})
