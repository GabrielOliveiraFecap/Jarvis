import { spawn } from 'node:child_process'
import { launchRiotProduct } from './riotClient.js'

export async function launchApplication(application) {
  const child = spawn(application.executablePath, application.args, {
    detached: true,
    stdio: 'ignore'
  })

  child.unref()

  if (application.riotProduct) {
    await launchRiotProduct(application.riotProduct)
  }
}
