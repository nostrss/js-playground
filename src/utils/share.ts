import LZString from 'lz-string'

export function encodeCode(code: string): string {
  return LZString.compressToBase64(code)
}

export function decodeCode(encoded: string): string | null {
  return LZString.decompressFromBase64(encoded)
}

export function getSharedCode(): string | null {
  const hash = window.location.hash
  if (!hash.startsWith('#code=')) return null
  const encoded = hash.slice('#code='.length)
  if (!encoded) return null
  return decodeCode(encoded)
}

export function buildShareUrl(code: string): string {
  const url = new URL(window.location.href)
  url.hash = `code=${encodeCode(code)}`
  return url.toString()
}
