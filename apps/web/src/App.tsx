import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationToast } from './components/NotificationToast'
import { useSocket } from './hooks/socket.hook'

const client = new QueryClient()

function AppContent() {
  useSocket()
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
