import { app } from 'electron'

export function applyStartWithWindows(enabled) {
  if (app.isPackaged) {
    app.setLoginItemSettings({ openAtLogin: enabled, args: ['--hidden'] })
  }
}
