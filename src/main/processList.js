import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export async function listRunningProcesses() {
  const { stdout } = await execFileAsync('tasklist', ['/FO', 'CSV', '/NH'])
  return parseProcessNames(stdout)
}

export function parseProcessNames(output) {
  const lines = output.trim().split('\r\n')

  return lines.map((line) => {
    const firstField = line.split('","')[0]

    return firstField.replace('"', '')
  })
}
