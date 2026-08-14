import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  accent?: 'brand' | 'success' | 'warning' | 'danger' | 'accent';
}

const accents = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  danger: 'bg-danger-50 text-danger-600',
  accent: 'bg-accent-50 text-accent-600',
};

export function StatCard({ label, value, icon, trend, accent = 'brand' }: StatCardProps) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accents[accent]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${trend.positive ? 'text-success-600' : 'text-danger-600'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-ink-900">{value}</p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  );
}
