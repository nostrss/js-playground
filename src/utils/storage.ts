export function saveCode(key: string, code: string): void {
  try {
    window.localStorage.setItem(key, code)
  } catch {
    // Private Browsing 등 localStorage 불가 환경 방어
  }
}

export function loadCode(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}
