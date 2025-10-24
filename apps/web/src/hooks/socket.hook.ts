import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { WS_URL } from '../utils/constants'
import { useNotificationStore } from '../store'

export function useSocket() {
  const add = useNotificationStore((s) => s.add)

  useEffect(() => {
    const socket: Socket = io(WS_URL, { transports: ['websocket'] })

    socket.on('connect', () => {
      add({ type: 'newPost', message: 'Conectado às notificações' })
    })

    socket.on('postCreated', (payload: { title: string }) => {
      add({ type: 'newPost', message: `Novo post: ${payload.title}` })
    })

    socket.on('postLiked', (payload: { by: string; postId: string }) => {
      add({ type: 'like', message: `Seu post foi curtido por ${payload.by}` })
    })

    socket.on('comment:new', (payload: { postId: string }) => {
      add({ type: 'comment', message: `Novo comentário no seu post` })
    })

    return () => socket.disconnect()
  }, [add])
}
