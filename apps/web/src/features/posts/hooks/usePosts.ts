import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addComment,
  createPost,
  deletePost,
  likePost,
  listPosts,
} from '../services/postsApi'

export function usePosts() {
  const qc = useQueryClient()
  const posts = useQuery({ queryKey: ['posts'], queryFn: listPosts })

  const mCreate = useMutation({
    mutationFn: createPost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })

  const mLike = useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      likePost(id, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })

  const mComment = useMutation({
    mutationFn: ({
      id,
      authorId,
      content,
    }: {
      id: string
      authorId: string
      content: string
    }) => addComment(id, { authorId, content }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })

  const mDelete = useMutation({
    mutationFn: deletePost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })

  return { posts, mCreate, mLike, mComment, mDelete }
}
