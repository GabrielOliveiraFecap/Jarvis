import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseProcessNames } from './processList.js'

test('extrai os nomes dos processos', () => {
  const output =
    '"Code.exe","1234","Console","1","150.000 K"\r\n' +
    '"opera.exe","5678","Console","1","90.000 K"\r\n'

  assert.deepEqual(parseProcessNames(output), ['Code.exe', 'opera.exe'])
})
