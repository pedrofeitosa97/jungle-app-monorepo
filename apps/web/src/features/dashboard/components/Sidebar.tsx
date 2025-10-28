import { useState, useEffect } from 'react'
import { Home, LogOut, Menu } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../../../store'
import { motion, AnimatePresence } from 'framer-motion'

export function Sidebar() {
  const [open, setOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { email, logout } = useAuthStore()
  const nav = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setOpen(!mobile)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Botão hambúrguer (só mobile) */}
      {isMobile && (
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="fixed top-4 left-4 p-2 rounded-md text-white border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-all duration-200 md:hidden"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {(open || !isMobile) && (
          <motion.aside
            key="sidebar"
            initial={{ x: isMobile ? -260 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -260 : 0, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className={`fixed left-0 top-0 h-full bg-neutral-950 border-r border-neutral-800 text-white flex flex-col justify-between transition-all duration-300 ${
              open ? 'w-56' : 'w-16'
            }`}
          >
            {/* Itens */}
            <div className="flex flex-col mt-6 gap-2">
              <Link
                to="/"
                onClick={() => isMobile && setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
              >
                <Home size={20} />
                {open && <span>Dashboard</span>}
              </Link>
            </div>

            {/* Rodapé */}
            <div className="mb-6 flex flex-col items-start px-4 gap-3">
              {open && email && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-neutral-400"
                >
                  Olá, {email}
                </motion.p>
              )}
              <button
                onClick={() => {
                  logout()
                  nav({ to: '/login' })
                }}
                className="flex items-center gap-3 text-red-400 hover:bg-red-600/10 px-3 py-2 rounded-md transition-colors w-full"
              >
                <LogOut size={20} />
                {open && <span>Sair</span>}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay — fecha o menu ao clicar fora */}
      {isMobile && open && (
        <motion.div
          onClick={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black backdrop-blur-sm md:hidden"
        />
      )}
    </>
  )
}
