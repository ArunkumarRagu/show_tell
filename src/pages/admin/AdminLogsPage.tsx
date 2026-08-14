import { ScrollText, CheckCircle2, AlertTriangle, XCircle, Filter } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { adminLogs } from '@/data/mockData';
import type { AdminLog } from '@/types';

type StatusFilter = 'all' | 'success' | 'warning' | 'error';

export function AdminLogsPage() {
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filtered = filter === 'all' ? adminLogs : adminLogs.filter((l) => l.status === filter);

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'success', label: 'Success' },
    { key: 'warning', label: 'Warning' },
    { key: 'error', label: 'Error' },
  ];

  const statusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle2 className="h-4 w-4 text-success-600" />;
    if (status === 'warning') return <AlertTriangle className="h-4 w-4 text-warning-600" />;
    return <XCircle className="h-4 w-4 text-danger-600" />;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
        <p className="mt-1 text-sm text-ink-400">System and admin activity history.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Success</p>
              <p className="text-xl font-bold text-ink-900">{adminLogs.filter((l) => l.status === 'success').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 text-warning-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Warnings</p>
              <p className="text-xl font-bold text-ink-900">{adminLogs.filter((l) => l.status === 'warning').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Errors</p>
              <p className="text-xl font-bold text-ink-900">{adminLogs.filter((l) => l.status === 'error').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-ink-400" />
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              filter === f.key
                ? 'bg-brand-600 text-white shadow-soft'
                : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Logs table */}
      <Card className="overflow-hidden">
        <CardHeader title="System Logs" subtitle={`${filtered.length} entries`} icon={<ScrollText className="h-5 w-5" />} />
        <div className="px-2 pb-2">
          <Table<AdminLog>
            columns={[
              {
                key: 'status',
                header: 'Status',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    {statusIcon(row.status)}
                    <span className="text-xs font-medium capitalize text-ink-500">{row.status}</span>
                  </div>
                ),
              },
              { key: 'user', header: 'User', render: (row) => <span className="font-semibold text-ink-800">{row.user}</span> },
              { key: 'action', header: 'Action', render: (row) => <span className="text-ink-700">{row.action}</span> },
              { key: 'target', header: 'Target', render: (row) => <span className="text-ink-600">{row.target}</span> },
              { key: 'timestamp', header: 'Timestamp', render: (row) => <span className="text-ink-400">{row.timestamp}</span> },
            ]}
            data={filtered}
          />
        </div>
      </Card>
    </div>
  );
}
