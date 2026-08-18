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
    <div className="min-h-screen bg-[#0B1020] text-slate-100 font-sans">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-[#26324A] bg-[#11182B] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-[#26324A] px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-display font-bold text-white tracking-tight">HAT Admin</h1>
            <p className="text-xs text-slate-400">Control Center</p>
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
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                      : 'text-slate-400 hover:bg-[#1C2742] hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#26324A] p-3 bg-[#11182B]">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <Avatar name={user?.name ?? 'Admin'} color={user?.avatarColor ?? '#7C3AED'} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name ?? 'Admin Root'}</p>
              <p className="truncate text-xs text-purple-400">Administrator</p>
            </div>
            <button onClick={handleLogout} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/20 hover:text-rose-400" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#26324A] bg-[#151E33]/80 px-4 backdrop-blur-md lg:px-8">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-slate-300 hover:bg-[#1C2742] lg:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="badge bg-purple-500/15 text-purple-300 border border-purple-500/30 font-display">⚡ Admin Mode</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-[#1C2742] hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#151E33]" />
            </button>
            <div className="h-8 w-px bg-[#26324A]" />
            <div className="flex items-center gap-2.5">
              <Avatar name={user?.name ?? 'Admin'} color={user?.avatarColor ?? '#7C3AED'} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">{user?.name ?? 'Admin Root'}</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <main className="animate-fade-in p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
