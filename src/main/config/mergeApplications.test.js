import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mergeApplications } from './mergeApplications.js'

test('combina catálogo e dados locais', () => {
  const applications = [
    { id: 'a', name: 'App A', args: ['--x'] },
    { id: 'b', name: 'App B', args: [] }
  ]
  const localApplications = {
    a: { executablePath: 'C:\\a.exe', args: ['--y'] }
  }
  const expected = [
    { id: 'a', name: 'App A', executablePath: 'C:\\a.exe', args: ['--x', '--y'] },
    { id: 'b', name: 'App B', executablePath: null, args: [] }
  ]

  const result = mergeApplications(applications, localApplications)

  assert.deepEqual(result, expected)
})
