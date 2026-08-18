import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePerformLogin = (empId: string, pass: string) => {
    const loggedUser = login(empId, pass);
    if (loggedUser) {
      toast.success(`Welcome back, ${loggedUser.name}!`);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      const errMsg = 'Invalid credentials. Try "admin" or "EMP001".';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      const errMsg = 'Please enter Employee ID or "admin".';
      setError(errMsg);
      toast.error(errMsg);
      return;
    }
    handlePerformLogin(employeeId, password || 'admin');
  };

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* Left panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 p-12 lg:flex">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-brand-400 blur-3xl" />
          <div className="absolute -left-20 bottom-20 h-80 w-80 rounded-full bg-accent-500 blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">HAT</h1>
              <p className="text-sm text-brand-200">Show & Tell Platform</p>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Compete.<br />Learn.<br/>Win together.
          </h2>
          <p className="mt-4 max-w-md text-lg text-brand-100">
            Join your team in timed challenges, climb the leaderboard, and prove your skills across engineering, architecture, and more.
          </p>
          <div className="mt-8 flex gap-8">
            <div>
              <p className="text-3xl font-bold text-white">6</p>
              <p className="text-sm text-brand-200">Teams</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24+</p>
              <p className="text-sm text-brand-200">Members</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-sm text-brand-200">Activities</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-sm text-brand-200">
          © 2026 HAT Show & Tell. All rights reserved.
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">HAT</h1>
                <p className="text-xs text-ink-400">Show & Tell</p>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-ink-400">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-300">Employee ID / Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="admin or EMP001"
                  className="w-full rounded-xl border border-ink-700 bg-ink-900 py-3 pl-11 pr-4 text-sm text-white placeholder-ink-500 transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-ink-700 bg-ink-900 py-3 pl-11 pr-4 text-sm text-white placeholder-ink-500 transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-danger-800 bg-danger-950/50 px-4 py-3 text-sm text-danger-300">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-ink-400">
                <input type="checkbox" className="rounded border-ink-600 bg-ink-800 text-brand-600 focus:ring-brand-500" defaultChecked />
                Remember me
              </label>
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-base shadow-lg">
              Sign In
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick One-Click Demo Login */}
          <div className="mt-6 rounded-xl border border-ink-800 bg-ink-900/80 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
              <Shield className="h-4 w-4 text-brand-400" />
              <span>One-Click Quick Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePerformLogin('admin', 'admin')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 py-2.5 text-xs font-bold text-purple-300 hover:bg-purple-900/50 transition-all shadow-sm"
              >
                ⚡ Sign In as Admin
              </button>
              <button
                type="button"
                onClick={() => handlePerformLogin('EMP001', 'password')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-950/40 py-2.5 text-xs font-bold text-blue-300 hover:bg-blue-900/50 transition-all shadow-sm"
              >
                👤 Sign In as User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

