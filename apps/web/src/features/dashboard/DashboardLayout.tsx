import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './components/Sidebar'
import { NotificationPanel } from '../../components/NotificationPanel'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-16 md:pl-56 pr-80">
        <div className="max-w-3xl mx-auto py-8">
          <Outlet />
        </div>
      </div>
      <NotificationPanel />
    </div>
  )
}
