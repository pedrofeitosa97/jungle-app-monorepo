import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full bg-neutral-950 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-16 transition-all duration-300 p-6">
        <Outlet />
      </main>
    </div>
  )
}
