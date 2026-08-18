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
        <Card className="p-4 border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Success</p>
              <p className="text-2xl font-display font-extrabold text-white">{adminLogs.filter((l) => l.status === 'success').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Warnings</p>
              <p className="text-2xl font-display font-extrabold text-white">{adminLogs.filter((l) => l.status === 'warning').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-rose-500/30 bg-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Errors</p>
              <p className="text-2xl font-display font-extrabold text-white">{adminLogs.filter((l) => l.status === 'error').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              filter === f.key
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#151E33] text-slate-300 border border-[#26324A] hover:bg-[#1C2742] hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Logs table */}
      <Card className="overflow-hidden border border-[#26324A]">
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
                    <span className="text-xs font-semibold capitalize text-slate-300">{row.status}</span>
                  </div>
                ),
              },
              { key: 'user', header: 'User', render: (row) => <span className="font-semibold text-white">{row.user}</span> },
              { key: 'action', header: 'Action', render: (row) => <span className="text-slate-200 font-medium">{row.action}</span> },
              { key: 'target', header: 'Target', render: (row) => <span className="text-purple-300 font-medium">{row.target}</span> },
              { key: 'timestamp', header: 'Timestamp', render: (row) => <span className="text-slate-400 font-mono text-xs">{row.timestamp}</span> },
            ]}
            data={filtered}
          />
        </div>
      </Card>
    </div>
  );
}

