import { Link, useNavigate, Outlet } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Users, UserCircle, ListTodo, BarChart3,
  ScrollText, Settings, LogOut, Menu, X, Bell,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Tooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, tooltipKey: 'dashboard' as const },
  { to: '/admin/teams', label: 'Teams', icon: Users, tooltipKey: 'teams' as const },
  { to: '/admin/users', label: 'Users', icon: UserCircle, tooltipKey: 'users' as const },
  { to: '/admin/activities', label: 'Activities', icon: ListTodo, tooltipKey: 'activities' as const },
  { to: '/admin/analytics', label: 'Scores & Analytics', icon: BarChart3, tooltipKey: 'analytics' as const },
  { to: '/admin/logs', label: 'Activity Logs', icon: ScrollText, tooltipKey: 'logs' as const },
  { to: '/admin/settings', label: 'Settings', icon: Settings, tooltipKey: 'settings' as const },
];

export function AdminLayout({ children }: { children?: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-[#0B0E17] text-slate-100 font-sans">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-[#1F293D] bg-[#111625] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-[#1F293D] px-5">
          <img
            src="https://hashagile.com/wp-content/uploads/2022/09/HashAgile-Logo.png"
            alt="HashAgile Logo"
            className="h-8 w-8 object-contain"
          />
          <div>
            <h1 className="text-base font-display font-bold text-white tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              HAT Converse
            </h1>
            <p className="text-[10px] text-purple-400 font-medium">Admin Control Center</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip key={item.to} content={tooltips.layout[item.tooltipKey]} position="right">
                <Link
                  to={item.to}
                  activeOptions={{ exact: true }}
                  onClick={() => setMobileOpen(false)}
                  activeProps={{
                    className:
                      'w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-semibold flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200',
                  }}
                  inactiveProps={{
                    className:
                      'w-full text-slate-400 hover:bg-[#1C2438] hover:text-white flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </Tooltip>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#1F293D] p-3 bg-[#111625]">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <Avatar name={user?.name ?? 'Admin'} color={user?.avatarColor ?? '#954DF9'} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name ?? 'Admin Root'}</p>
              <p className="truncate text-xs text-purple-400">Administrator</p>
            </div>
            <Tooltip content={tooltips.layout.signOut} position="top">
              <button onClick={handleLogout} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/20 hover:text-rose-400">
                <LogOut className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#1F293D] bg-[#111625]/80 px-4 backdrop-blur-md lg:px-8">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-slate-300 hover:bg-[#1C2438] lg:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Tooltip content={tooltips.layout.adminBadge} position="bottom">
              <span className="badge bg-purple-500/15 text-purple-300 border border-purple-500/30 font-display">⚡ Admin Mode</span>
            </Tooltip>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip content={tooltips.layout.notifications} position="bottom">
              <button className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-[#1C2438] hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#111625]" />
              </button>
            </Tooltip>
            <div className="h-8 w-px bg-[#1F293D]" />
            <div className="flex items-center gap-2.5">
              <Avatar name={user?.name ?? 'Admin'} color={user?.avatarColor ?? '#954DF9'} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">{user?.name ?? 'Admin Root'}</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <main className="animate-fade-in p-4 lg:p-8">{children || <Outlet />}</main>
      </div>
    </div>
  );
}
