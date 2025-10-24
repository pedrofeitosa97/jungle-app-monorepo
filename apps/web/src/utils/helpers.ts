export function formatDate(timestamp: number | string): string {
  const date = new Date(Number(timestamp))
  return date.toLocaleString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function truncateText(text: string, length = 100): string {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

export function randomId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}`
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function safeJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}
