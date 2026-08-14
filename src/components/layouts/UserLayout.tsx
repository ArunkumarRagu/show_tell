import { NavLink, useNavigate } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, ListTodo, History, Trophy, User as UserIcon,
  LogOut, Menu, X, Zap, Bell, Search,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/activities', label: 'Activities', icon: ListTodo },
  { to: '/history', label: 'My History', icon: History },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: UserIcon },
];

export function UserLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-ink-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-ink-100 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-ink-900">HAT</h1>
            <p className="text-xs text-ink-400">Show & Tell</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-ink-100 p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <Avatar name={user?.name ?? 'Guest'} color={user?.avatarColor ?? '#94a3b8'} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-800">{user?.name}</p>
              <p className="truncate text-xs text-ink-400">{user?.teamName}</p>
            </div>
            <button onClick={handleLogout} className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-danger-50 hover:text-danger-600" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-ink-950/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-200 bg-white/80 px-4 backdrop-blur-md lg:px-8">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="hidden flex-1 sm:block">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search activities, teams..."
                className="w-full rounded-xl border border-ink-200 bg-ink-50 py-2 pl-10 pr-4 text-sm text-ink-700 placeholder-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
            </button>
            <div className="h-8 w-px bg-ink-200" />
            <div className="flex items-center gap-2">
              <Avatar name={user?.name ?? 'Guest'} color={user?.avatarColor ?? '#94a3b8'} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-ink-800">{user?.name}</p>
                <p className="text-xs text-ink-400">{user?.employeeId}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="animate-fade-in p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
