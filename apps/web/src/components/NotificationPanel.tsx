import { useEffect } from 'react'
import { useNotificationStore } from '../store/notifications'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { toast } from 'sonner'

export function NotificationPanel() {
  const { items, remove, clear } = useNotificationStore()

  useEffect(() => {
    if (items.length > 0) {
      const latest = items[0]
      toast(latest.message, {
        description: new Date(latest.at).toLocaleTimeString(),
        duration: 4000,
      })
    }
  }, [items])

  if (items.length === 0) {
    return (
      <Card className="fixed top-4 right-4 w-80 bg-neutral-900 text-white shadow-lg border-neutral-700">
        <CardContent className="p-4 text-center text-sm text-neutral-400">
          Nenhuma notificação
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="fixed top-4 right-4 w-80 bg-neutral-900 text-white shadow-lg border-neutral-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-white">Notificações</h3>
          <Button
            size="sm"
            variant="ghost"
            className="text-neutral-400 hover:text-white"
            onClick={clear}
          >
            Limpar
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700">
          {items.map((n, i) => (
            <div
              key={n.id || i}
              className="flex justify-between items-start bg-neutral-800 rounded-lg px-3 py-2 hover:bg-neutral-700 transition"
            >
              <div>
                <p className="text-sm text-white">{n.message}</p>
                <p className="text-xs text-neutral-500">
                  {new Date(n.at).toLocaleTimeString()}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-neutral-400 hover:text-white"
                onClick={() => remove(n.id)}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
