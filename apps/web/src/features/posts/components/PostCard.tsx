import { Heart } from 'lucide-react'
import type { Post } from '../../../utils/types'

type Props = {
  post: Post
  onLike: (id: string) => void
  onDelete?: (id: string) => void
  onComment?: (id: string, content: string) => void
  canDelete?: boolean
}

export function PostCard({
  post,
  onLike,
  onDelete,
  onComment,
  canDelete,
}: Props) {
  return (
    <div className="bg-[var(--color-bg-soft)] border border-neutral-800 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        {canDelete && (
          <button
            className="text-sm opacity-70 hover:opacity-100"
            onClick={() => onDelete?.(post.id)}
          >
            excluir
          </button>
        )}
      </div>
      <p className="opacity-80 mt-2">{post.content}</p>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center gap-1"
        >
          <Heart
            size={20}
            className={
              post.likedByMe
                ? 'text-[var(--color-primary)] fill-[var(--color-primary)]'
                : 'text-white'
            }
          />
          <span className="text-sm opacity-80">{post.likes}</span>
        </button>
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          const content = String(data.get('content') || '')
          if (content.trim().length > 0) {
            onComment?.(post.id, content.trim())
            e.currentTarget.reset()
          }
        }}
      >
        <input
          name="content"
          placeholder="Adicionar comentário..."
          className="flex-1 px-3 py-2 rounded-md bg-black/40 border border-neutral-700 outline-none"
        />
        <button className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20">
          Enviar
        </button>
      </form>

      {post.comments && post.comments.length > 0 && (
        <ul className="mt-3 space-y-2">
          {post.comments.map((c) => (
            <li
              key={c.id}
              className="text-sm opacity-80 border-t border-neutral-800 pt-2"
            >
              {c.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
