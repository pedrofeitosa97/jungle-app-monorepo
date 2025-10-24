import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import DashboardLayout from '../features/dashboard/DashboardLayout'
import Feed from '../features/posts/pages/Feed'
import { useAuthStore } from '../store'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

function requireAuth() {
  const token = useAuthStore.getState().token
  if (!token) throw redirect({ to: '/login' })
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
})

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  beforeLoad: () => requireAuth(),
  component: DashboardLayout,
})

const feedRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  component: Feed,
})

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  appRoute.addChildren([feedRoute]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
