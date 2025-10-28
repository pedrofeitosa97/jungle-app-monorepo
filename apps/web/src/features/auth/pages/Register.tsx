import { useState } from 'react'
import { authApi } from '../../../api/http'
import { useNavigate } from '@tanstack/react-router'

export default function Register() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await authApi.post('/auth/register', { username, email, password })
    nav({ to: '/login' })
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4"
      >
        <h1 className="text-xl font-semibold">Criar conta</h1>
        <input
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700"
          placeholder="nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700"
          placeholder="senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full px-3 py-2 rounded-md bg-white/10 hover:bg-white/20">
          Registrar
        </button>
      </form>
    </div>
  )
}
