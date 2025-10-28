import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authApi } from '../../../api/http'
import { useAuthStore } from '../../../store/auth'
import { useSocket } from '../../../hooks/socket.hook'

export default function Login() {
  const nav = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { connect } = useSocket()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const { data } = await authApi.post('/auth/login', { email, password })

      const token = data?.access_token
      const user = data?.user || {}
      const userId = user.id || user.userId || null
      const userEmail = user.email || email

      if (!token || !userId) {
        throw new Error('Resposta inválida do servidor')
      }

      setAuth(token, userId, userEmail)
      connect()
      nav({ to: '/' })
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Erro ao fazer login, tente novamente.'
      setError(Array.isArray(msg) ? msg.join(', ') : msg)
      console.error('Erro no login:', err)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4"
      >
        <h1 className="text-xl font-semibold">Entrar</h1>

        <input
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          Entrar
        </button>

        <button
          type="button"
          className="w-full px-3 py-2 rounded-md border border-neutral-700 hover:bg-white/10 transition"
          onClick={() => nav({ to: '/register' })}
        >
          Criar conta
        </button>
      </form>
    </div>
  )
}
