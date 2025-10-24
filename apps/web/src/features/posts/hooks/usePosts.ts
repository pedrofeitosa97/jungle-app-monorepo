import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '../../../api/http'
import type { Post } from '../../../utils/types'

export function usePosts() {
  const queryClient = useQueryClient()

  const posts = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await postsApi.get<Post[]>('/posts')
      return data
    },
  })

  const mCreate = useMutation({
    mutationFn: async (newPost: {
      authorId: string
      title: string
      content: string
    }) => {
      const { data } = await postsApi.post('/posts', newPost)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })

  const mLike = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { data } = await postsApi.post(`/posts/${id}/like`, { userId })
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })

  const mComment = useMutation({
    mutationFn: async ({
      id,
      authorId,
      content,
    }: {
      id: string
      authorId: string
      content: string
    }) => {
      const { data } = await postsApi.post(`/posts/${id}/comments`, {
        authorId,
        content,
      })
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })

  const mDelete = useMutation({
    mutationFn: async (id: string) => {
      await postsApi.delete(`/posts/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })

  return { posts, mCreate, mLike, mComment, mDelete }
}
