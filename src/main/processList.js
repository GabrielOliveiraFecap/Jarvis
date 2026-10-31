export function parseProcessNames(output) {
  const lines = output.trim().split('\r\n')

  return lines.map((line) => {
    const firstField = line.split('","')[0]

    return firstField.replace('"', '')
  })
}
