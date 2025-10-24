import { useState } from 'react'
import { Home, PlusSquare, Bell } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Sidebar() {
  const [open, setOpen] = useState(false)

  const Item = ({
    to,
    icon,
    label,
  }: {
    to: string
    icon: JSX.Element
    label: string
  }) => (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors"
    >
      {icon}
      {open && <span>{label}</span>}
    </Link>
  )

  return (
    <nav
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`fixed left-0 top-0 h-full bg-[var(--color-bg-soft)] border-r border-neutral-800 transition-all duration-200 ${
        open ? 'w-56' : 'w-16'
      }`}
    >
      <div className="mt-6 flex flex-col gap-2">
        <Item to="/" icon={<Home size={20} />} label="Dashboard" />
        <Item
          to="/posts/new"
          icon={<PlusSquare size={20} />}
          label="Novo Post"
        />
        <Item
          to="/notifications"
          icon={<Bell size={20} />}
          label="Notificações"
        />
      </div>
    </nav>
  )
}
