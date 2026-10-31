import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isApplicationRunning, parseProcessNames } from './processList.js'

test('extrai os nomes dos processos', () => {
  const output =
    '"Code.exe","1234","Console","1","150.000 K"\r\n' +
    '"opera.exe","5678","Console","1","90.000 K"\r\n'

  assert.deepEqual(parseProcessNames(output), ['Code.exe', 'opera.exe'])
})

test('identifica se a aplicação está aberta, sem diferenciar maiúsculas', () => {
  const application = { processName: 'Code.exe' }

  assert.equal(isApplicationRunning(application, ['code.exe', 'opera.exe']), true)
  assert.equal(isApplicationRunning(application, ['opera.exe']), false)
})
