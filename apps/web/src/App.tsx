import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationToast } from './components/NotificationToast'
import { useEffect } from 'react'
import { useSocket } from './hooks/socket.hook'
import { useAuthStore } from './store/auth'

const client = new QueryClient()

function AppContent() {
  const { token } = useAuthStore()
  const { connect, disconnect } = useSocket()

  useEffect(() => {
    if (token) connect()
    else disconnect()
  }, [token, connect, disconnect])

  return (
    <>
      <RouterProvider router={router} />
      <NotificationToast />
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <AppContent />
    </QueryClientProvider>
  )
}
