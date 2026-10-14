import { BarChart3, TrendingUp, PieChart as PieChartIcon, Activity as ActivityIcon, Users, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { BarChart, LineChart, PieChart } from '@/components/ui/Charts';
import { useAnalyticsOverviewQuery } from '@/hooks/queries/useAnalytics';
import { InfoTooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';

export function AdminAnalyticsPage() {
  const { data, isLoading } = useAnalyticsOverviewQuery();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics & Insights</h1>
        <p className="mt-1 text-sm text-ink-400">Detailed performance metrics, completion rates, and difficulty breakdowns.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Completions" value={data?.totalCompletions || 15} icon={<CheckCircle2 className="h-5 w-5" />} accent="brand" tooltip={tooltips.dashboard.completedCompletions} />
        <StatCard label="Active Users" value={data?.activeUsers || 23} icon={<Users className="h-5 w-5" />} accent="success" tooltip={tooltips.dashboard.activeUsers} />
        <StatCard label="Active Activities" value={data?.activeActivities || 12} icon={<ActivityIcon className="h-5 w-5" />} accent="warning" tooltip={tooltips.dashboard.totalActivities} />
        <StatCard label="Completion Rate" value={`${data?.avgCompletionRate || 95}%`} icon={<TrendingUp className="h-5 w-5" />} accent="accent" tooltip={tooltips.analytics.completionRate} />
      </div>

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
              data={(data?.teamPerformance || []).map((t) => ({ name: t.name, value: t.score, color: t.color }))}
              height={220}
              formatValue={(v) => v.toLocaleString()}
            />
          </div>
        </Card>
        <Card>
          <CardHeader
            title="Score Progression"
            subtitle="Weekly engagement"
            icon={<TrendingUp className="h-5 w-5" />}
            action={<InfoTooltip content={tooltips.dashboard.individualPerformanceTrend} />}
          />
          <div className="p-5 pt-4">
            <LineChart data={(data?.individualPerformance || []).map((d) => ({ label: d.week, value: d.score }))} height={220} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Difficulty Breakdown"
            subtitle="Completions by difficulty"
            icon={<PieChartIcon className="h-5 w-5" />}
            action={<InfoTooltip content={tooltips.analytics.scoreDistribution} />}
          />
          <div className="p-5 pt-4">
            <div className="space-y-4">
              {(data?.difficultyBreakdown || []).map((item) => (
                <div key={item.difficulty} className="rounded-xl border border-ink-800 bg-ink-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{item.difficulty}</span>
                    <span className="text-xs text-brand-400 font-bold">{item.completed} completions</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-ink-400">
                    <span>Average Score: {item.avgScore} pts</span>
                    <span>Total Activities: {item.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader
            title="Overall Completion"
            subtitle="Ratio of completed vs remaining challenges"
            icon={<PieChartIcon className="h-5 w-5" />}
            action={<InfoTooltip content={tooltips.analytics.completionRate} />}
          />
          <div className="flex justify-center p-5 pt-4">
            <PieChart data={data?.completionRateData || []} size={200} />
          </div>
        </Card>
      </div>
    </div>
  );
}
