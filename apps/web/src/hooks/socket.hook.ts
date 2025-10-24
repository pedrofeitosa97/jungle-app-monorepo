import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { WS_URL } from '../utils/constants'
import { useNotificationStore } from '../store'
import { useQueryClient } from '@tanstack/react-query'

export function useSocket() {
  const add = useNotificationStore((s) => s.add)
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket: Socket = io(WS_URL, { transports: ['websocket'] })

    const notify = (type: string, message: string) => {
      add({
        id: crypto.randomUUID(),
        type: type as any,
        message,
        at: Date.now(),
      })
    }

    socket.on('connect', () => {
      notify('system', 'Conectado às notificações')
    })

    socket.on('postCreated', (payload: { title: string }) => {
      notify('newPost', `Novo post: ${payload.title}`)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    })

    socket.on('postLiked', (payload: { by: string; postId: string }) => {
      notify('like', `Seu post foi curtido por ${payload.by}`)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    })

    socket.on('comment_added', (payload: { user: string; comment: string }) => {
      notify(
        'comment',
        `Novo comentário de ${payload.user}: "${payload.comment}"`
      )
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    })

    return () => {
      socket.disconnect()
    }
  }, [add, queryClient])
}
