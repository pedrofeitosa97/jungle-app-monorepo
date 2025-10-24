import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './components/Sidebar'
import { useEffect, useState } from 'react'

export default function DashboardLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-screen w-full bg-neutral-950 text-white overflow-hidden relative">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 p-6 ${
          isMobile ? 'pt-16 ml-0' : 'ml-56'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}
