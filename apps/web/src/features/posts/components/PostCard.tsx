import { useState } from 'react'
import { Heart, Trash2, MessageCircle } from 'lucide-react'
import type { Post } from '../../../utils/types'
import { toast } from 'sonner'

export function PostCard({
  post,
  onLike,
  onDelete,
  onComment,
  canDelete,
}: {
  post: Post
  onLike: (id: string) => void
  onDelete: (id: string) => void
  onComment: (id: string, text: string) => void
  canDelete: boolean
}) {
  const [liked, setLiked] = useState(post.likedByMe ?? false)
  const [likes, setLikes] = useState(post.likes)
  const [comment, setComment] = useState('')

  function toggleLike() {
    setLiked(!liked)
    setLikes((prev) => (liked ? prev - 1 : prev + 1))
    onLike(post.id)
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-white">{post.title}</h3>
          <p className="text-sm text-neutral-400">{post.content}</p>
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
          className={`flex items-center gap-1 transition ${
            liked ? 'text-red-500' : 'hover:text-red-400'
          }`}
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
            if (comment.trim()) {
              onComment(post.id, comment)
              toast(`Novo comentário adicionado!`, {
                description: comment,
              })
              setComment('')
            }
          }}
          className="text-neutral-400 hover:text-white"
        >
          <MessageCircle size={18} />
        </button>
      </div>
    </div>
  )
}
