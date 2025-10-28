import { useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { WS_URL } from '../utils/constants'
import { useNotificationStore } from '../store'
import { useQueryClient } from '@tanstack/react-query'
import type { NotificationType } from '../utils/types'

export function useSocket() {
  const add = useNotificationStore((s) => s.add)
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const notify = useCallback(
    (type: NotificationType, message: string) => {
      add({ id: crypto.randomUUID(), type, message, at: Date.now() })
    },
    [add]
  )

  const refreshPosts = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }, 400)
  }, [queryClient])

  const connect = useCallback(() => {
    if (socketRef.current) return

    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (!token || !userId) return

    const socket = io(WS_URL, {
      transports: ['websocket'],
      auth: { token, userId },
    })

    socket.on('connect', () =>
      notify('newPost', '🔗 Conectado às notificações')
    )
    socket.on('disconnect', () => notify('newPost', '⚠️ Desconectado'))

    socket.on('postCreated', (p: { title: string }) => {
      notify('newPost', `🆕 Novo post: ${p.title}`)
    })

    socket.on('postLiked', (p: { likedBy: string }) => {
      notify('like', `❤️ ${p.likedBy} curtiu seu post`)
    })

    socket.on('postUnliked', (p: { unlikedBy: string }) => {
      notify('like', `💔 ${p.unlikedBy} removeu a curtida`)
    })

    socket.on('comment.added', (p: { authorId: string; content: string }) => {
      notify('comment', `💬 ${p.authorId} comentou: "${p.content}"`)
    })

    socket.on('posts.refresh', () => {
      refreshPosts()
    })

    socketRef.current = socket
  }, [notify, refreshPosts])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [])

  return { connect, disconnect }
}
