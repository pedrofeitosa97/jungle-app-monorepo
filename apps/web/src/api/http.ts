import axios from 'axios'
import { AUTH_URL, POSTS_URL } from '../utils/constants'
import { useAuthStore } from '../store'

export const authApi = axios.create({ baseURL: AUTH_URL })
export const postsApi = axios.create({ baseURL: POSTS_URL })

const attachToken = (config: any) => {
  const token = useAuthStore.getState().token
  if (token)
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    }
  return config
}

authApi.interceptors.request.use(attachToken)
postsApi.interceptors.request.use(attachToken)
