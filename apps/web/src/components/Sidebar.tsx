import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Headphones,
  LayoutGrid,
  LogOut,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'


interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Resumen', icon: LayoutGrid, end: true },
  { to: '/orders', label: 'Pedidos', icon: Package },
  { to: '/support', label: 'Atención al cliente', icon: Headphones },
]

const baseItemClasses =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-blue'

const inactiveClasses = 'text-muted hover:bg-surface-hover hover:text-foreground'

function Sidebar() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false)
  const initial = (user?.name ?? user?.email ?? '?').charAt(0).toUpperCase();

  return (
    <nav
      aria-label="Navegación principal"
      className={`sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar p-4 transition-[width] duration-300 ${collapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-1.5">
        <div className="size-9 shrink-0 rounded-xl bg-brand-gradient" />
        {!collapsed && <span className="text-lg font-semibold tracking-tight">Pulse</span>}
      </div>

      {/* Enlaces */}
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `${baseItemClasses} ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-foreground text-background' : inactiveClasses
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
        {/* Usuario */}
        <div
          className={`flex items-center gap-3 ${collapsed ? 'flex-col px-0' : 'justify-between px-3'
            } py-2`}
          title={collapsed ? (user?.email ?? undefined) : undefined}
        >
          <div className='flex gap-2'>
            <div className="bg-brand-gradient flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-background">
              {initial}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user?.name ?? 'Sin nombre'}</p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
              </div>
            )}
          </div>
          {/* Cerrar sesión */}
          <button
            type="button"
            onClick={() => void logout()}
            title={collapsed ? 'Cerrar sesión' : undefined}
            aria-label="Cerrar sesión"
            className={`${baseItemClasses} text-muted hover:bg-negative/15 hover:text-negative ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} className="shrink-0" aria-hidden="true" />
          </button>
        </div>


        {/* Plegar */}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Desplegar menú' : 'Plegar menú'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Desplegar menú' : undefined}
          className={`${baseItemClasses} ${inactiveClasses} ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? (
            <PanelLeftOpen size={20} className="shrink-0" />
          ) : (
            <PanelLeftClose size={20} className="shrink-0" />
          )}
          {!collapsed && <span className="whitespace-nowrap">Plegar</span>}
        </button>
      </div>
    </nav>
  )
}

export default Sidebar