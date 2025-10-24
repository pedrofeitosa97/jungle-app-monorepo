import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { WS_URL } from '../utils/constants'
import { useNotificationStore } from '../store'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
      toast(message)
    }

    socket.on('connect', () => {
      notify('system', 'Conectado às notificações')
    })

    socket.on('postCreated', (payload: { title: string }) => {
      notify('newPost', `Novo post: ${payload.title}`)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    })

    socket.on('postLiked', (payload: { by: string }) => {
      notify('like', `Seu post foi curtido por ${payload.by}`)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    })

    socket.on('postUnliked', (payload: { by: string }) => {
      notify('like', `${payload.by} removeu a curtida do seu post`)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    })

    socket.on('comment_added', (payload: { user: string; comment: string }) => {
      notify(
        'comment',
        `Novo comentário de ${payload.user}: "${payload.comment}"`
      )
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    })

    socket.on('comment_liked', (payload: { user: string }) => {
      notify('like', `Seu comentário foi curtido por ${payload.user}`)
    })

    return () => {
      socket.disconnect()
    }
  }, [add, queryClient])
}
