import { useState } from 'react'
import { usePosts } from '../hooks/usePosts'
import { PostCard } from '../components/PostCard'
import { useAuthStore } from '../../../store/auth'

export default function Feed() {
  const { userId } = useAuthStore()
  const { posts, mCreate, mLike, mComment, mDelete } = usePosts()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  if (posts.isLoading) return <div>Carregando...</div>

  return (
    <div className="space-y-6 text-white">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!userId) return
          mCreate.mutate({ authorId: userId, title, content })
          setTitle('')
          setContent('')
        }}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2"
      >
        <h2 className="font-semibold">Novo post</h2>
        <input
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700 text-white"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700 text-white"
          placeholder="Conteúdo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white"
        >
          Publicar
        </button>
      </form>

      <div className="space-y-4">
        {posts.data?.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onLike={(id) => userId && mLike.mutate({ id, userId })}
            onDelete={(id) => mDelete.mutate(id)}
            onComment={(id, text) =>
              userId && mComment.mutate({ id, authorId: userId, content: text })
            }
            canDelete={userId === p.authorId}
          />
        ))}
      </div>
    </div>
  )
}
