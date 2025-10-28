import { useMemo, useState } from 'react'
import { usePosts } from '../hooks/usePosts'
import { PostCard } from '../components/PostCard'
import { useAuthStore } from '../../../store/auth'

const PAGE_SIZE = 5

export default function Feed() {
  const { userId } = useAuthStore()
  const { posts, mCreate, mLike, mComment, mDelete } = usePosts()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    const arr = posts.data ? [...posts.data] : []
    return arr.sort((a, b) => {
      const aTime = new Date(a.createdAt ?? 0).getTime()
      const bTime = new Date(b.createdAt ?? 0).getTime()
      return bTime - aTime
    })
  }, [posts.data])

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const current = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page]
  )

  if (posts.isLoading) return <div>Carregando...</div>

  return (
    <div className="h-full flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!userId) return
          if (!title.trim() || !content.trim()) return
          mCreate.mutate({
            authorId: userId,
            title: title.trim(),
            content: content.trim(),
          })
          setTitle('')
          setContent('')
          setPage(1)
        }}
        className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 space-y-2"
      >
        <h2 className="font-semibold">Novo post</h2>
        <input
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700"
          placeholder="Conteúdo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20">
          Publicar
        </button>
      </form>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto scrollarea">
        {current.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onLike={(id) => userId && mLike.mutate({ id, userId })}
            onDelete={(id) => mDelete.mutate(id)}
            onComment={(id, text) =>
              userId && mComment.mutate({ id, authorId: userId, content: text })
            }
            canDelete={userId === p.authorId}
            currentUserId={userId ?? ''}
          />
        ))}
        {!current.length && (
          <p className="text-sm text-neutral-400">Sem posts ainda.</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
        <span className="text-sm text-neutral-400">
          Página {page} de {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-md bg-white/10 disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-md bg-white/10 disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  )
}
