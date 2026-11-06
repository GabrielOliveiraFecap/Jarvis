import icon from '../../resources/icon.png?asset'
import { app, Menu, Tray, nativeImage } from 'electron'

let tray
export function createTray(mainWindow) {
  const iconTray = nativeImage.createFromPath(icon).resize({ width: 16, height: 16 })
  tray = new Tray(iconTray)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir Jarvis', click: () => mainWindow.show() },
    { label: 'Fechar Jarvis', click: () => app.quit() }
  ])

  tray.setToolTip('Jarvis')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => mainWindow.show())
}
