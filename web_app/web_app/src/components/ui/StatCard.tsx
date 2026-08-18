import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  accent?: 'brand' | 'success' | 'warning' | 'danger' | 'accent';
}

const accents = {
  brand: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
  accent: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
};

export function StatCard({ label, value, icon, trend, accent = 'brand' }: StatCardProps) {
  return (
    <div className="card card-hover p-5 border border-theme-border">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accents[accent]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-display font-extrabold text-white tracking-tight">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}
