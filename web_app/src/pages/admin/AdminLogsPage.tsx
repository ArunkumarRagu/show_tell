import { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { extractList, extractMeta } from '@/api/client';
import { useAdminLogsQuery } from '@/hooks/queries/useLogs';
import type { AdminLog } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';

export function AdminLogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: logsData, isLoading } = useAdminLogsQuery({ page: currentPage, page_size: pageSize });
  const adminLogs = extractList(logsData);
  const logsMeta = extractMeta(logsData);

  const columns: Column<AdminLog>[] = [
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (log) => (
        <Tooltip content={tooltips.logs.logStatus} position="top">
          {log.status === 'success' ? (
            <span className="badge bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-400" /> Success
            </span>
          ) : log.status === 'warning' ? (
            <span className="badge bg-amber-950/80 text-amber-300 border border-amber-800/50">
              <AlertTriangle className="mr-1 h-3.5 w-3.5 text-amber-400" /> Warning
            </span>
          ) : (
            <span className="badge bg-rose-950/80 text-rose-300 border border-rose-800/50">
              <XCircle className="mr-1 h-3.5 w-3.5 text-rose-400" /> Error
            </span>
          )}
        </Tooltip>
      ),
    },
    {
      key: 'user',
      header: 'Admin User',
      sortable: true,
      render: (log) => <span className="font-semibold text-white">{log.user}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: (log) => (
        <Tooltip content={tooltips.logs.userAction} position="top">
          <span className="text-slate-300">{log.action}</span>
        </Tooltip>
      ),
    },
    {
      key: 'target',
      header: 'Target Entity',
      sortable: true,
      render: (log) => (
        <Tooltip content={tooltips.logs.targetResource} position="top">
          <span className="font-mono text-xs text-purple-300 cursor-pointer">{log.target}</span>
        </Tooltip>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      className: 'text-right',
      render: (log) => (
        <Tooltip content={tooltips.logs.timestamp} position="top">
          <span className="font-mono text-xs text-slate-400 cursor-pointer">{log.timestamp}</span>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-400">Track administrative actions, system modifications, and security events.</p>
      </div>

      <DataTable
        columns={columns}
        data={adminLogs}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search logs by action, target or user..."
        searchFields={(log) => [log.action, log.target, log.user]}
        meta={logsMeta}
        onPageChange={setCurrentPage}
        emptyMessage="No administrative logs found."
      />
    </div>
  );
}
