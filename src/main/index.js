import { app, BrowserWindow, dialog } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from './window'
import { registerIpcHandlers } from './ipc'
import { openDatabase } from './database'
import { runMigrations } from './migrations'
import { seedDatabase } from './seed'
import { createTray } from './tray'

async function start() {
  await app.whenReady()

  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true,
      args: ['--hidden']
    })
  }

  electronApp.setAppUserModelId('jarvis.gabriel')
  const db = openDatabase()
  runMigrations(db)
  seedDatabase(db)

  registerIpcHandlers()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = createMainWindow()
  createTray(mainWindow)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
}

start().catch((error) => {
  console.error('Falha ao iniciar o Jarvis:', error)
  dialog.showErrorBox('Erro ao iniciar o Jarvis', error.message)
  app.exit(1)
})
