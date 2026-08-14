import { useState } from 'react';
import { History as HistoryIcon, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { DifficultyBadge, ResultBadge } from '@/components/ui/Badge';
import { activityLogs } from '@/data/mockData';
import type { ActivityLog, Difficulty } from '@/types';

type FilterType = 'All' | Difficulty;

export function HistoryPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>('All');

  if (!user) return null;
  const userLogs = activityLogs.filter((l) => l.userId === user.id);
  const filtered = filter === 'All' ? userLogs : userLogs.filter((l) => l.difficulty === filter);
  const totalScore = userLogs.reduce((sum, l) => sum + (l.status === 'completed' ? l.score : 0), 0);
  const completed = userLogs.filter((l) => l.status === 'completed').length;
  const failed = userLogs.filter((l) => l.status === 'failed').length;
  const avgTime = Math.round(userLogs.reduce((sum, l) => sum + l.timeTaken, 0) / userLogs.length);

  const filters: FilterType[] = ['All', 'Easy', 'Medium', 'Hard'];

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">My Activity History</h1>
        <p className="mt-1 text-sm text-ink-500">Track your progress and review past performances.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <HistoryIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Total Activities</p>
              <p className="text-xl font-bold text-ink-900">{userLogs.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Completed</p>
              <p className="text-xl font-bold text-ink-900">{completed}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Failed</p>
              <p className="text-xl font-bold text-ink-900">{failed}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Avg Time</p>
              <p className="text-xl font-bold text-ink-900">{formatTime(avgTime)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-ink-400" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              filter === f
                ? 'bg-brand-600 text-white shadow-soft'
                : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table<ActivityLog>
          columns={[
            {
              key: 'activity',
              header: 'Activity',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${row.status === 'completed' ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'}`}>
                    {row.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>
                  <span className="font-medium text-ink-800">{row.activityName}</span>
                </div>
              ),
            },
            { key: 'difficulty', header: 'Difficulty', render: (row) => <DifficultyBadge difficulty={row.difficulty} /> },
            { key: 'score', header: 'Score', render: (row) => <span className="font-bold text-ink-900">{row.score}</span> },
            { key: 'time', header: 'Time Taken', render: (row) => <span className="text-ink-600">{formatTime(row.timeTaken)}</span> },
            { key: 'status', header: 'Status', render: (row) => <ResultBadge status={row.status} /> },
            { key: 'date', header: 'Date', render: (row) => <span className="text-ink-500">{row.date}</span> },
          ]}
          data={filtered}
        />
      </Card>
    </div>
  );
}
