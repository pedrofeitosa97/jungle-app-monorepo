import { create } from 'zustand'

type AuthState = {
  token: string | null
  userId: string | null
  username: string | null
  setAuth: (token: string, userId: string, username?: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  userId: null,
  username: null,
  setAuth: (token, userId, username) => set({ token, userId, username }),
  clearAuth: () => set({ token: null, userId: null, username: null }),
  isAuthenticated: () => !!get().token,
}))
