import { useState } from 'react';
import { Search, Filter, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useUserLogsQuery } from '@/hooks/queries/useLogs';
import { DifficultyBadge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';

import { extractList } from '@/api/client';

export function HistoryPage() {
  const { data: logsData, isLoading } = useUserLogsQuery();
  const logs = extractList(logsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.difficulty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Activity History</h1>
          <p className="mt-1 text-sm text-ink-500">Track your past completions, scores, and performance.</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search completed activities..."
            className="input pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-ink-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select py-2 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden border border-[#26324A] bg-[#151E33] shadow-xl">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No history logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#26324A] bg-[#11182B] text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Activity</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Time Taken</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26324A]">
                {filteredLogs.map((log) => {
                  const minutes = Math.floor(log.timeTaken / 60);
                  const seconds = log.timeTaken % 60;
                  const timeStr = `${minutes}m ${seconds}s`;

                  return (
                    <tr key={log.id} className="hover:bg-[#1C2742]/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{log.activityName}</td>
                      <td className="px-6 py-4">
                        <Tooltip content={tooltips.activities.difficulty} position="top">
                          <DifficultyBadge difficulty={log.difficulty} />
                        </Tooltip>
                      </td>
                      <td className="px-6 py-4 font-bold text-purple-400">
                        <Tooltip content={tooltips.users.score} position="top">
                          <span className="cursor-pointer">+{log.score} pts</span>
                        </Tooltip>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{timeStr}</td>
                      <td className="px-6 py-4">
                        <Tooltip content={tooltips.profile.recentAttempts} position="top">
                          {log.status === 'completed' ? (
                            <span className="badge bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              Completed
                            </span>
                          ) : (
                            <span className="badge bg-rose-950/80 text-rose-300 border border-rose-800/50">
                              <XCircle className="h-3.5 w-3.5 text-rose-400" />
                              Failed
                            </span>
                          )}
                        </Tooltip>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{log.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
