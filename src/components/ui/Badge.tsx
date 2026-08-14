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
      <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
      Active
    </span>
  ) : (
    <span className="badge-inactive">
      <span className="h-1.5 w-1.5 rounded-full bg-ink-400" />
      Inactive
    </span>
  );
}

export function ResultBadge({ status }: { status: 'completed' | 'failed' | 'in-progress' }) {
  if (status === 'completed')
    return <span className="badge bg-success-50 text-success-700 ring-1 ring-success-200">Completed</span>;
  if (status === 'failed')
    return <span className="badge bg-danger-50 text-danger-700 ring-1 ring-danger-200">Failed</span>;
  return <span className="badge bg-brand-50 text-brand-700 ring-1 ring-brand-200">In Progress</span>;
}

export function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="badge bg-amber-50 text-amber-700 ring-1 ring-amber-200">#1</span>;
  if (rank === 2) return <span className="badge bg-ink-100 text-ink-600 ring-1 ring-ink-300">#2</span>;
  if (rank === 3) return <span className="badge bg-orange-50 text-orange-700 ring-1 ring-orange-200">#3</span>;
  return <span className="badge bg-ink-50 text-ink-500 ring-1 ring-ink-200">#{rank}</span>;
}

export function RoleBadge({ role }: { role: 'admin' | 'user' }) {
  if (role === 'admin') {
    return <span className="badge bg-purple-50 text-purple-700 ring-1 ring-purple-200">Admin</span>;
  }
  return <span className="badge bg-blue-50 text-blue-700 ring-1 ring-blue-200">User</span>;
}

export function ActivityTypeBadge({ type }: { type?: 'individual' | 'group' }) {
  if (type === 'group') {
    return <span className="badge bg-amber-50 text-amber-700 ring-1 ring-amber-200">Group</span>;
  }
  return <span className="badge bg-teal-50 text-teal-700 ring-1 ring-teal-200">Individual</span>;
}


