import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '../../../api/http'
import type { Post } from '../../../utils/types'

export function usePosts() {
  const qc = useQueryClient()

  const posts = useQuery({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> => {
      const { data } = await postsApi.get<Post[]>('/posts')
      return data
    },
  })

  const mCreate = useMutation({
    mutationFn: async (input: {
      authorId: string
      title: string
      content: string
    }) => {
      const { data } = await postsApi.post<Post>('/posts', input)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })

  const mLike = useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { data } = await postsApi.post<Post>(`/posts/${id}/like`, {
        userId,
      })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })

  const mComment = useMutation({
    mutationFn: async (input: {
      id: string
      authorId: string
      content: string
    }) => {
      const { data } = await postsApi.post(`/posts/${input.id}/comments`, {
        authorId: input.authorId,
        content: input.content,
      })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })

  const mDelete = useMutation({
    mutationFn: async (id: string) => {
      await postsApi.delete(`/posts/${id}`)
      return true
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })

  return { posts, mCreate, mLike, mComment, mDelete }
}
