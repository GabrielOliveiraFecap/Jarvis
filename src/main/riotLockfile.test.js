import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseLockfile } from './riotLockfile.js'

test('extrai porta, senha e protocolo do lockfile', () => {
  const result = parseLockfile('Riot Client:1:12345:abc:https')

  assert.deepEqual(result, { port: '12345', password: 'abc', protocol: 'https' })
})

test('ignora a quebra de linha no fim do lockfile', () => {
  const result = parseLockfile('Riot Client:1:12345:abc:https\n')

  assert.equal(result.protocol, 'https')
})
