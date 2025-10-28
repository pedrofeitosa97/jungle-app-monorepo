import { useState, useEffect, useMemo } from 'react'
import { Heart, Trash2, MessageCircle } from 'lucide-react'
import type { Post } from '../../../utils/types'

export function PostCard({
  post,
  onLike,
  onDelete,
  onComment,
  canDelete,
  currentUserId,
}: {
  post: Post
  onLike: (id: string) => void
  onDelete: (id: string) => void
  onComment: (id: string, text: string) => void
  canDelete: boolean
  currentUserId: string
}) {
  console.log('Rendering PostCard for post:', post)
  const initiallyLiked = useMemo(
    () =>
      Boolean(post.likedByMe) ||
      (post.likedUsers?.includes(currentUserId) ?? false),
    [post.likedByMe, post.likedUsers, currentUserId]
  )
  const [liked, setLiked] = useState(initiallyLiked)
  const [likes, setLikes] = useState(post.likes)
  const [comment, setComment] = useState('')

  useEffect(() => {
    setLiked(initiallyLiked)
    setLikes(post.likes)
  }, [initiallyLiked, post.likes, post.id])

  function toggleLike() {
    setLiked((prev) => !prev)
    setLikes((prev) => (liked ? Math.max(0, prev - 1) : prev + 1))
    onLike(post.id)
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-white">{post.title}</h3>
            <p className="text-sm text-neutral-400">{post.content}</p>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-400 hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-neutral-400">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 transition ${liked ? 'text-red-500' : 'hover:text-red-400'}`}
        >
          <Heart
            size={18}
            fill={liked ? 'rgb(239 68 68)' : 'transparent'}
            strokeWidth={2}
          />
          {likes}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md bg-black/40 border border-neutral-700 text-sm"
          placeholder="Comente algo..."
        />
        <button
          onClick={() => {
            const text = comment.trim()
            if (text) {
              onComment(post.id, text)
              setComment('')
            }
          }}
          className="text-neutral-400 hover:text-white"
        >
          <MessageCircle size={18} />
        </button>
      </div>

      {post.comments?.length ? (
        <div className="mt-3 space-y-2 border-t border-neutral-800 pt-2 max-h-40 overflow-y-auto scrollarea">
          {post.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <p className="text-sm text-neutral-400 flex-1">💬 {c.content}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
