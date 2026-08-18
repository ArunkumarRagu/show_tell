import { useEffect, useState } from 'react';

interface TimerProps {
  totalSeconds: number;
  remainingSeconds: number;
  onTimeUp?: () => void;
}

export function Timer({ totalSeconds, remainingSeconds, onTimeUp }: TimerProps) {
  const pct = (remainingSeconds / totalSeconds) * 100;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const color = pct > 50 ? '#3366ff' : pct > 25 ? '#f59e0b' : '#ef4444';
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  useEffect(() => {
    if (remainingSeconds <= 0) onTimeUp?.();
  }, [remainingSeconds, onTimeUp]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="300" height="300" className="-rotate-90">
        <circle cx="150" cy="150" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-linear"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-6xl font-bold tracking-tight text-ink-900" style={{ color }}>
          {display}
        </span>
        <span className="mt-2 text-sm font-medium text-ink-400">Time Remaining</span>
      </div>
    </div>
  );
}

export function useCountdown(totalSeconds: number) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining <= 0]);

  const reset = (newTotal?: number) => setRemaining(newTotal ?? totalSeconds);

  return { remaining, reset };
}
