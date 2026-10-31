export function parseLockfile(content) {
  const [, , port, password, protocol] = content.trim().split(':')

  return { port, password, protocol }
}
