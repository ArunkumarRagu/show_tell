import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Lock, User, ArrowRight, Shield, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePerformLogin = async (empId: string, pass: string) => {
    setIsSubmitting(true);
    setError('');
    try {
      const loggedUser = await login(empId, pass);
      if (loggedUser) {
        toast.success(`Welcome back to HAT Converse, ${loggedUser.name}!`);
        if (loggedUser.role === 'admin') {
          navigate({ to: '/admin' });
        } else {
          navigate({ to: '/dashboard' });
        }
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Invalid credentials. Try "admin" or "EMP001".';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
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
    handlePerformLogin(employeeId, password || 'admin123');
  };

  return (
    <div className="flex min-h-screen bg-[#0B0E17]">
      {/* Left panel with HashAgile inspired dark theme & vibrant gradient */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1F1F41] via-[#111625] to-[#0B0E17] p-12 lg:flex border-r border-[#1F293D]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-[#954DF9] blur-[120px]" />
          <div className="absolute -left-20 bottom-20 h-80 w-80 rounded-full bg-[#4A9DFF] blur-[120px]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img
              src="https://hashagile.com/wp-content/uploads/2022/09/HashAgile-Logo.png"
              alt="HashAgile Logo"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                HAT Converse
              </h1>
              <p className="text-xs text-slate-400">Agile Digital Transformation Platform</p>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <span className="badge bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold mb-4 inline-block">
            ⚡ Enterprise Gamified Intelligence
          </span>
          <h2 className="text-4xl font-extrabold leading-tight text-white">
            Transform Data.<br />Elevate Skills.<br />Win Together.
          </h2>
          <p className="mt-4 max-w-md text-base text-slate-300 leading-relaxed">
            Empowering teams through real-time challenges, AI & engineering quizzes, dynamic leaderboards, and collaborative competition.
          </p>
          <div className="mt-8 flex gap-8 border-t border-[#1F293D] pt-6">
            <div>
              <p className="text-3xl font-bold text-white">6</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Active Teams</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24+</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Engineers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Challenges</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-xs text-slate-500">
          © 2026 HAT Converse · HashAgile Digital Transformation Solutions
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <img
                src="https://hashagile.com/wp-content/uploads/2022/09/HashAgile-Logo.png"
                alt="HashAgile Logo"
                className="h-8 w-8 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-white">HAT Converse</h1>
                <p className="text-xs text-slate-400">Digital Transformation</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to your HAT Converse account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Employee ID / Email</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="admin or EMP001"
                  className="w-full rounded-xl border border-[#1F293D] bg-[#111625] py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/15"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#1F293D] bg-[#111625] py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/15"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-800/50 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-3 text-base font-semibold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to HAT Converse
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick One-Click Demo Login */}
          <div className="mt-6 rounded-xl border border-[#1F293D] bg-[#111625] p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Shield className="h-4 w-4 text-purple-400" />
              <span>One-Click Quick Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handlePerformLogin('ADM001', 'admin123')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 py-2.5 text-xs font-bold text-purple-300 hover:bg-purple-900/50 transition-all shadow-sm disabled:opacity-50"
              >
                ⚡ Sign In as Admin
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handlePerformLogin('EMP001', 'password123')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-950/40 py-2.5 text-xs font-bold text-blue-300 hover:bg-blue-900/50 transition-all shadow-sm disabled:opacity-50"
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
