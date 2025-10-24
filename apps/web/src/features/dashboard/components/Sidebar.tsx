import { useState } from 'react'
import { Home, LogOut, Menu } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../../../store'
import { motion, AnimatePresence } from 'framer-motion'

export function Sidebar() {
  const [open, setOpen] = useState(false)
  const { email, logout } = useAuthStore()
  const nav = useNavigate()
  const isMobile = window.innerWidth < 768

  return (
    <>
      {/* Botão hambúrguer (mobile) */}
      {isMobile && (
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="fixed top-4 left-4 z-50 bg-neutral-900 border border-neutral-700 p-2 rounded-md text-white hover:bg-neutral-800 transition-all duration-200 md:hidden"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(open || !isMobile) && (
          <motion.aside
            initial={{ x: isMobile ? -240 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? -240 : 0, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.25 }}
            onMouseEnter={() => !isMobile && setOpen(true)}
            onMouseLeave={() => !isMobile && setOpen(false)}
            className={`fixed left-0 top-0 h-full bg-neutral-950 border-r border-neutral-800 text-white flex flex-col justify-between transition-all duration-300 z-40 ${
              open ? 'w-56' : 'w-16'
            } ${isMobile ? '' : 'hover:w-56'}`}
          >
            {/* Links principais */}
            <div className="flex flex-col mt-6 gap-2">
              <Link
                to="/"
                onClick={() => isMobile && setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-white/10 hover:shadow-inner transition-all duration-200"
              >
                <Home size={20} className="min-w-[20px]" />
                <span
                  className={`whitespace-nowrap transition-all duration-300 ${
                    open
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2 pointer-events-none'
                  }`}
                >
                  Dashboard
                </span>
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
                className="flex items-center gap-3 text-red-400 hover:bg-red-600/10 px-3 py-2 rounded-md transition-all duration-200 w-full"
              >
                <LogOut size={20} className="min-w-[20px]" />
                <span
                  className={`transition-all duration-300 ${
                    open
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2 pointer-events-none'
                  }`}
                >
                  Sair
                </span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Fundo escuro mobile */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black z-30 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}
