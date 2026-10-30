import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isAllowedExternalUrl } from './externalUrl.js'

test('permite URLs http e https', () => {
  assert.equal(isAllowedExternalUrl('https://github.com'), true)
  assert.equal(isAllowedExternalUrl('http://localhost:3000'), true)
  assert.equal(isAllowedExternalUrl('HTTPS://GITHUB.COM'), true)
})

test('recusa protocolos não permitidos e URLs inválidas', () => {
  assert.equal(isAllowedExternalUrl('calculator:'), false)
  assert.equal(isAllowedExternalUrl('file:///C:/Windows/win.ini'), false)
  assert.equal(isAllowedExternalUrl('isso nao e url'), false)
  assert.equal(isAllowedExternalUrl('javascript:alert(1)'), false)
})
