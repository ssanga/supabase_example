import { NavLink, Outlet } from 'react-router-dom'
import { Users, Building2, LayoutDashboard } from 'lucide-react'

const navItems = [
  { to: '/',            label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/employees',   label: 'Employees',   icon: Users },
]

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-200">
          <h1 className="text-base font-semibold text-gray-900 tracking-tight">People Hub</h1>
          <p className="text-xs text-gray-400 mt-0.5">Supabase demo</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Powered by Supabase</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
