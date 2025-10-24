import { useState } from 'react'
import { authApi } from '../../../api/http'
import { useAuthStore } from '../../../store/auth'
import { useNavigate } from '@tanstack/react-router'

export default function Login() {
  const nav = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data } = await authApi.post<{
      access_token: string
      userId: string
    }>('/auth/login', { email, password })
    setAuth(data.access_token, data.userId, email)
    nav({ to: '/' })
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-950 text-white">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4"
      >
        <h1 className="text-xl font-semibold">Entrar</h1>
        <input
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700"
          type="password"
          placeholder="senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full px-3 py-2 rounded-md bg-white/10 hover:bg-white/20"
        >
          Entrar
        </button>
        <button
          type="button"
          className="text-sm opacity-70"
          onClick={() => nav({ to: '/register' })}
        >
          Criar conta
        </button>
      </form>
    </div>
  )
}
