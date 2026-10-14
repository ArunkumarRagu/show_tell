import {
  Users, UserCircle, ListTodo, CheckCircle2, Trophy, TrendingUp, Activity as ActivityIcon, BarChart3, Loader2,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { RankBadge } from '@/components/ui/Badge';
import { BarChart, LineChart } from '@/components/ui/Charts';
import { extractList } from '@/api/client';
import { useAnalyticsOverviewQuery } from '@/hooks/queries/useAnalytics';
import { useTeamsQuery } from '@/hooks/queries/useTeams';
import { useAdminLogsQuery } from '@/hooks/queries/useLogs';
import { tooltips } from '@/data/tooltip';
import { InfoTooltip } from '@/components/ui/Tooltip';

export function AdminDashboardPage() {
  const { data: overview, isLoading: isLoadingAnalytics } = useAnalyticsOverviewQuery();
  const { data: rawTeams, isLoading: isLoadingTeams } = useTeamsQuery();
  const { data: rawLogs, isLoading: isLoadingLogs } = useAdminLogsQuery();

  const teamsList = extractList(rawTeams);
  const adminLogsList = extractList(rawLogs);

  const loading = isLoadingAnalytics || isLoadingTeams || isLoadingLogs;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const sortedTeams = [...teamsList].sort((a, b) => b.score - a.score);
  const recentLogs = adminLogsList.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-ink-400">Overview of teams, users, activities, and platform performance.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Teams" value={overview?.totalTeams || teamsList.length} icon={<Users className="h-5 w-5" />} accent="brand" tooltip={tooltips.dashboard.totalTeams} />
        <StatCard label="Total Users" value={overview?.totalUsers || 24} icon={<UserCircle className="h-5 w-5" />} accent="accent" tooltip={tooltips.dashboard.totalUsers} />
        <StatCard label="Active Users" value={overview?.activeUsers || 23} icon={<TrendingUp className="h-5 w-5" />} accent="success" tooltip={tooltips.dashboard.activeUsers} />
        <StatCard label="Total Activities" value={overview?.totalActivities || 12} icon={<ListTodo className="h-5 w-5" />} accent="warning" tooltip={tooltips.dashboard.totalActivities} />
        <StatCard label="Completed" value={overview?.totalCompletions || 15} icon={<CheckCircle2 className="h-5 w-5" />} accent="success" tooltip={tooltips.dashboard.completedCompletions} />
        <StatCard label="Avg Score Rate" value={`${overview?.avgCompletionRate || 95}%`} icon={<Trophy className="h-5 w-5" />} accent="brand" tooltip={tooltips.dashboard.avgScoreRate} />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Team Performance"
            subtitle="Total score by team"
            icon={<BarChart3 className="h-5 w-5" />}
            action={<InfoTooltip content={tooltips.dashboard.teamPerformanceChart} />}
          />
          <div className="p-5 pt-4">
            <BarChart
              data={(overview?.teamPerformance || teamsList.map(t => ({ name: t.name, score: t.score, color: t.color }))).map((t) => ({ name: t.name, value: t.score, color: t.color }))}
              height={220}
              formatValue={(v) => v.toLocaleString()}
            />
          </div>
        </Card>
        <Card>
          <CardHeader
            title="Individual Performance"
            subtitle="Platform-wide score trend"
            icon={<TrendingUp className="h-5 w-5" />}
            action={<InfoTooltip content={tooltips.dashboard.individualPerformanceTrend} />}
          />
          <div className="p-5 pt-4">
            <LineChart data={(overview?.individualPerformance || []).map((d) => ({ label: d.week, value: d.score }))} height={220} />
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <Card>
          <CardHeader
            title="Recent Activity"
            subtitle="Latest platform events"
            icon={<ActivityIcon className="h-5 w-5" />}
            action={<InfoTooltip content={tooltips.dashboard.recentActivityLogs} />}
          />
          <div className="divide-y divide-[#26324A] p-5 pt-0">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 py-3 first:pt-4">
                <div className={`h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : log.status === 'warning' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{log.action}</p>
                  <p className="text-xs text-slate-400">{log.target}</p>
                </div>
                <span className="text-xs font-mono text-slate-400">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Team leaderboard */}
        <Card>
          <CardHeader
            title="Team Leaderboard"
            subtitle="Current rankings"
            icon={<Trophy className="h-5 w-5" />}
            action={<InfoTooltip content={tooltips.dashboard.teamLeaderboard} />}
          />
          <div className="space-y-2 p-5 pt-0">
            {sortedTeams.map((team, i) => (
              <div key={team.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-[#1C2742] transition-colors">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg font-display text-xs font-bold text-slate-400 bg-[#0B1020] border border-[#26324A]">{i + 1}</span>
                <div className="flex h-8 w-1.5 rounded-full" style={{ backgroundColor: team.color }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{team.name}</p>
                  <p className="text-xs text-slate-400">{team.activitiesCompleted} activities</p>
                </div>
                <span className="font-display text-sm font-extrabold text-white">{team.score.toLocaleString()}</span>
                <RankBadge rank={team.rank || i + 1} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
