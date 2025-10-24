import { create } from 'zustand'
import type { NotificationItem } from '../utils/types'

type NotificationState = {
  items: NotificationItem[]
  add: (notification: NotificationItem) => void
  remove: (id: string) => void
  clear: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],

  add: (notification) =>
    set((state) => ({
      items: [notification, ...state.items].slice(0, 20),
    })),

  remove: (id) =>
    set((state) => ({
      items: state.items.filter((n) => n.id !== id),
    })),

  clear: () => set({ items: [] }),
}))
