export function isAllowedExternalUrl(url) {
  const allowedProtocols = ['https:', 'http:']
  try {
    const protocol = new URL(url).protocol
    return allowedProtocols.includes(protocol)
  } catch {
    return false
  }
}
