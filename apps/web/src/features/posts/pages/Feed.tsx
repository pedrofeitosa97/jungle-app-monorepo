import { useState } from 'react'
import { usePosts } from '../hooks/usePosts'
import { PostCard } from '../components/PostCard'
import { useAuthStore } from '../../../store/auth'
import { motion } from 'framer-motion'

export default function Feed() {
  const { userId } = useAuthStore()
  const { posts, mCreate, mLike, mComment, mDelete } = usePosts()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  if (posts.isLoading) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      <motion.h1
        className="text-3xl font-semibold text-center mb-4 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🌿 Bem-vindo ao Jungle Feed
      </motion.h1>

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
        <button className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition">
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
