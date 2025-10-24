import { create } from 'zustand'

interface AuthState {
  token: string | null
  userId: string | null
  email: string | null
  setAuth: (token: string, userId: string, email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  email: localStorage.getItem('email'),
  setAuth: (token, userId, email) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('email', email)
    set({ token, userId, email })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    set({ token: null, userId: null, email: null })
  },
}))
