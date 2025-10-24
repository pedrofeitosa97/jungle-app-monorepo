import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationToast } from './components/NotificationToast'
import { useSocket } from './hooks/socket.hook'

const client = new QueryClient()

export default function App() {
  useSocket()
  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
      <NotificationToast />
    </QueryClientProvider>
  )
}
