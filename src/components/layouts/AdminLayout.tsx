import { NavLink, useNavigate } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Users, UserCircle, ListTodo, BarChart3,
  ScrollText, Settings, LogOut, Menu, X, Shield, Bell,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/teams', label: 'Teams', icon: Users },
  { to: '/admin/users', label: 'Users', icon: UserCircle },
  { to: '/admin/activities', label: 'Activities', icon: ListTodo },
  { to: '/admin/analytics', label: 'Scores & Analytics', icon: BarChart3 },
  { to: '/admin/logs', label: 'Activity Logs', icon: ScrollText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-ink-100">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-200 bg-ink-900 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-ink-800 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">HAT Admin</h1>
            <p className="text-xs text-ink-400">Control Center</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-soft'
                      : 'text-ink-400 hover:bg-ink-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-ink-800 p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <Avatar name={user?.name ?? 'Admin'} color={user?.avatarColor ?? '#0f172a'} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name ?? 'Admin Root'}</p>
              <p className="truncate text-xs text-ink-400">Administrator</p>
            </div>
            <button onClick={handleLogout} className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-danger-600 hover:text-white" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-200 bg-white/80 px-4 backdrop-blur-md lg:px-8">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="badge bg-brand-50 text-brand-700 ring-1 ring-brand-200">Admin Mode</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
            </button>
            <div className="h-8 w-px bg-ink-200" />
            <div className="flex items-center gap-2">
              <Avatar name={user?.name ?? 'Admin'} color={user?.avatarColor ?? '#0f172a'} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-ink-800">{user?.name ?? 'Admin Root'}</p>
                <p className="text-xs text-ink-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <main className="animate-fade-in p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
