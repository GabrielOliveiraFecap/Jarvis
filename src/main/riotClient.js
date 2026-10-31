import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import https from 'node:https'
import { setTimeout as wait } from 'node:timers/promises'
import { parseLockfile } from './riotLockfile.js'

const LAUNCH_TIMEOUT_MS = 60000
const RETRY_INTERVAL_MS = 1000
const REQUEST_TIMEOUT_MS = 5000
const ALREADY_LAUNCHED_STATUS = 423

function isLaunched(status) {
  return (status >= 200 && status < 300) || status === ALREADY_LAUNCHED_STATUS
}

function getLockfilePath() {
  return join(process.env.LOCALAPPDATA, 'Riot Games', 'Riot Client', 'Config', 'lockfile')
}

function requestLaunch({ port, password }, { product, patchline }) {
  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        host: '127.0.0.1',
        port,
        path: `/product-launcher/v1/products/${product}/patchlines/${patchline}`,
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`riot:${password}`).toString('base64')}` },
        rejectUnauthorized: false,
        timeout: REQUEST_TIMEOUT_MS
      },
      (response) => {
        response.resume()
        response.on('end', () => resolve(response.statusCode))
      }
    )

    request.on('timeout', () => request.destroy(new Error('Tempo esgotado no Riot Client')))
    request.on('error', reject)
    request.end()
  })
}

export async function launchRiotProduct(riotProduct) {
  const deadline = Date.now() + LAUNCH_TIMEOUT_MS

  while (Date.now() < deadline) {
    try {
      const lockfile = parseLockfile(await readFile(getLockfilePath(), 'utf8'))
      const status = await requestLaunch(lockfile, riotProduct)

      if (isLaunched(status)) return
    } catch {
      // O Riot Client ainda pode estar iniciando.
    }

    await wait(RETRY_INTERVAL_MS)
  }

  throw new Error('O Riot Client não iniciou o jogo a tempo.')
}
