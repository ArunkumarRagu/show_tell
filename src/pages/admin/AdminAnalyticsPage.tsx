import { useState } from 'react';
import { BarChart3, Filter, TrendingUp, Target, Award, Clock } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DifficultyBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BarChart, DonutChart, LineChart } from '@/components/ui/Charts';
import { teams, users, activities, activityLogs, teamPerformanceData, difficultyBreakdown } from '@/data/mockData';

type FilterType = 'All' | 'Easy' | 'Medium' | 'Hard';

export function AdminAnalyticsPage() {
  const [filter, setFilter] = useState<FilterType>('All');

  const totalScore = users.filter((u) => u.role === 'user').reduce((sum, u) => sum + u.score, 0);
  const avgScore = Math.round(totalScore / users.filter((u) => u.role === 'user').length);
  const completionRate = Math.round((activityLogs.filter((l) => l.status === 'completed').length / activityLogs.length) * 100);

  const filteredLogs = filter === 'All' ? activityLogs : activityLogs.filter((l) => l.difficulty === filter);
  const filteredAvg = filteredLogs.length > 0 ? Math.round(filteredLogs.reduce((sum, l) => sum + l.score, 0) / filteredLogs.length) : 0;

  const difficultyData = [
    { label: 'Easy', value: activities.filter((a) => a.difficulty === 'Easy').length, color: '#10b981' },
    { label: 'Medium', value: activities.filter((a) => a.difficulty === 'Medium').length, color: '#f59e0b' },
    { label: 'Hard', value: activities.filter((a) => a.difficulty === 'Hard').length, color: '#ef4444' },
  ];

  const filters: FilterType[] = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Scores & Analytics</h1>
        <p className="mt-1 text-sm text-ink-400">Platform-wide performance insights and breakdowns.</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Score" value={totalScore.toLocaleString()} icon={<Award className="h-5 w-5" />} accent="brand" />
        <StatCard label="Average Score" value={avgScore.toLocaleString()} icon={<TrendingUp className="h-5 w-5" />} accent="success" />
        <StatCard label="Completion Rate" value={`${completionRate}%`} icon={<Target className="h-5 w-5" />} accent="accent" />
        <StatCard label="Total Activities" value={activities.length} icon={<Clock className="h-5 w-5" />} accent="warning" />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Team Scores" subtitle="Total score by team" icon={<BarChart3 className="h-5 w-5" />} />
          <div className="p-5 pt-4">
            <BarChart
              data={teamPerformanceData.map((t) => ({ name: t.name, value: t.score, color: t.color }))}
              height={220}
              formatValue={(v) => v.toLocaleString()}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Activity Distribution" subtitle="By difficulty level" icon={<Target className="h-5 w-5" />} />
          <div className="flex items-center justify-center p-5 pt-4">
            <DonutChart data={difficultyData} size={180} centerValue={`${activities.length}`} centerLabel="Activities" />
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

      {/* Difficulty breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        {difficultyBreakdown.map((d) => (
          <Card key={d.difficulty} className="p-5">
            <div className="flex items-center justify-between">
              <DifficultyBadge difficulty={d.difficulty as 'Easy' | 'Medium' | 'Hard'} />
              <span className="text-xs text-ink-400">{d.completed}/{d.total} completed</span>
            </div>
            <div className="mt-4">
              <p className="text-xs text-ink-400">Average Score</p>
              <p className="text-2xl font-bold text-ink-900">{d.avgScore}</p>
              <ProgressBar value={d.avgScore} max={d.difficulty === 'Easy' ? 100 : d.difficulty === 'Medium' ? 200 : 300} color={d.difficulty === 'Easy' ? 'bg-success-500' : d.difficulty === 'Medium' ? 'bg-warning-500' : 'bg-danger-500'} className="mt-2" />
            </div>
          </Card>
        ))}
      </div>

      {/* Individual performance chart */}
      <Card>
        <CardHeader title="Individual Performance Trend" subtitle="Platform-wide score progression" icon={<TrendingUp className="h-5 w-5" />} />
        <div className="p-5 pt-4">
          <LineChart
            data={[
              { label: 'W1', value: 320 },
              { label: 'W2', value: 480 },
              { label: 'W3', value: 410 },
              { label: 'W4', value: 620 },
              { label: 'W5', value: 580 },
              { label: 'W6', value: 740 },
              { label: 'W7', value: 890 },
              { label: 'W8', value: 1240 },
            ]}
            height={220}
            color="#10b981"
          />
        </div>
      </Card>

      {/* Activity performance table */}
      <Card>
        <CardHeader title="Activity Performance" subtitle="Per-activity statistics" icon={<BarChart3 className="h-5 w-5" />} />
        <div className="overflow-x-auto p-5 pt-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100">
                <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">Activity</th>
                <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">Difficulty</th>
                <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">Completions</th>
                <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">Avg Score</th>
                <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-400">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {activities.map((a) => (
                <tr key={a.id} className="text-sm table-row-hover">
                  <td className="px-2 py-3 font-semibold text-ink-800">{a.name}</td>
                  <td className="px-2 py-3"><DifficultyBadge difficulty={a.difficulty} /></td>
                  <td className="px-2 py-3 text-ink-600">{a.completions}</td>
                  <td className="px-2 py-3 font-bold text-ink-900">{a.avgScore}/{a.maxScore}</td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={a.avgScore} max={a.maxScore} size="sm" color="bg-brand-500" className="w-24" />
                      <span className="text-xs text-ink-500">{Math.round((a.avgScore / a.maxScore) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
