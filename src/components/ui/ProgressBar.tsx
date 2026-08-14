interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, max, color = 'bg-brand-500', className = '', showLabel = false, size = 'md' }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
  return (
    <div className={`${className}`}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-ink-500">{value} / {max}</span>
          <span className="font-bold text-ink-700">{pct}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-ink-100 ${heights[size]}`}>
        <div
          className={`${color} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface RingProgressProps {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}

export function RingProgress({ value, max, size = 120, stroke = 10, color = '#3366ff', label }: RingProgressProps) {
  const pct = Math.min(100, (value / max) * 100);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-ink-900">{Math.round(pct)}%</span>
        {label && <span className="text-xs text-ink-500">{label}</span>}
      </div>
    </div>
  );
}
