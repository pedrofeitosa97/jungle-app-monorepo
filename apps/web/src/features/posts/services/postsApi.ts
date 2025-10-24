import { postsApi } from '../../../api/http'
import type { Comment, Post } from '../../../utils/types'

export async function listPosts() {
  const { data } = await postsApi.get<Post[]>('/posts')
  return data
}

export async function createPost(input: {
  authorId: string
  title: string
  content: string
}) {
  const { data } = await postsApi.post<Post>('/posts', input)
  return data
}

export async function likePost(id: string, userId: string) {
  const { data } = await postsApi.post<Post>(`/posts/${id}/like`, { userId })
  return data
}

export async function addComment(
  id: string,
  input: { authorId: string; content: string }
) {
  const { data } = await postsApi.post<Comment>(`/posts/${id}/comments`, input)
  return data
}

export async function deletePost(id: string) {
  const { data } = await postsApi.delete<{ ok: true }>(`/posts/${id}`)
  return data
}
