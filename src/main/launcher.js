import { spawn } from 'node:child_process'
import { launchRiotProduct } from './riotClient.js'

function waitForSpawn(child) {
  return new Promise((resolve, reject) => {
    child.once('spawn', resolve)
    child.once('error', reject)
  })
}

export async function launchApplication(application) {
  const child = spawn(application.executablePath, application.args, {
    detached: true,
    stdio: 'ignore'
  })
  await waitForSpawn(child)

  child.unref()

  if (application.riotProduct) {
    await launchRiotProduct(application.riotProduct)
  }
}
