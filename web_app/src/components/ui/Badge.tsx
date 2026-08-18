import type { Difficulty, ActivityStatus, UserStatus } from '@/types';

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const classes: Record<Difficulty, string> = {
    Easy: 'badge-easy',
    Medium: 'badge-medium',
    Hard: 'badge-hard',
  };
  const dots: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 };
  return (
    <span className={classes[difficulty]}>
      <span className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={`h-1 w-1 rounded-full ${i < dots[difficulty] ? 'bg-current' : 'bg-current/30'}`}
          />
        ))}
      </span>
      {difficulty}
    </span>
  );
}

export function StatusBadge({ status }: { status: ActivityStatus | UserStatus }) {
  return status === 'active' ? (
    <span className="badge-active">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Active
    </span>
  ) : (
    <span className="badge-inactive">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      Inactive
    </span>
  );
}

export function ResultBadge({ status }: { status: 'completed' | 'failed' | 'in-progress' }) {
  if (status === 'completed')
    return <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Completed</span>;
  if (status === 'failed')
    return <span className="badge bg-rose-500/10 text-rose-400 border border-rose-500/30">Failed</span>;
  return <span className="badge bg-purple-500/10 text-purple-400 border border-purple-500/30">In Progress</span>;
}

export function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="badge bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(251,191,36,0.3)] font-display font-bold">
        👑 #1 Gold
      </span>
    );
  if (rank === 2)
    return (
      <span className="badge bg-slate-300/15 text-slate-200 border border-slate-300/30 shadow-[0_0_10px_rgba(203,213,225,0.2)] font-display font-bold">
        🥈 #2 Silver
      </span>
    );
  if (rank === 3)
    return (
      <span className="badge bg-amber-700/20 text-amber-400 border border-amber-600/30 shadow-[0_0_10px_rgba(205,127,50,0.2)] font-display font-bold">
        🥉 #3 Bronze
      </span>
    );
  return <span className="badge bg-slate-800 text-slate-400 border border-slate-700 font-display">#{rank}</span>;
}

export function RoleBadge({ role }: { role: 'admin' | 'user' }) {
  if (role === 'admin') {
    return <span className="badge bg-purple-500/15 text-purple-300 border border-purple-500/30">Admin</span>;
  }
  return <span className="badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">User</span>;
}

export function ActivityTypeBadge({ type }: { type?: 'individual' | 'group' }) {
  if (type === 'group') {
    return <span className="badge bg-purple-500/15 text-purple-300 border border-purple-500/30">Group</span>;
  }
  return <span className="badge bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Individual</span>;
}
