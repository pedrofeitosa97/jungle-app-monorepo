import { useEffect, useState } from 'react'
import { useNotificationStore } from '../store'

export function NotificationToast() {
  const { items } = useNotificationStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (items.length > 0) {
      setOpen(true)
      const t = setTimeout(() => setOpen(false), 3000)
      return () => clearTimeout(t)
    }
  }, [items.length])

  const last = items[0]
  if (!last) return null

  return (
    <div
      className={`fixed top-4 right-4 transition-all ${
        open
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="bg-[var(--color-bg-soft)] border border-[var(--color-accent)] text-[var(--color-text)] px-4 py-3 rounded-lg shadow-xl min-w-[280px]">
        <div className="text-sm opacity-80 mb-1">{last.type}</div>
        <div className="font-medium">{last.message}</div>
      </div>
    </div>
  )
}
