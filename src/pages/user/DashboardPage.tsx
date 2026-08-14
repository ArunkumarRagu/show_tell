import { useNavigate } from 'react-router-dom';
import {
  Trophy, Target, Users, TrendingUp, Play, Clock,
  CheckCircle2, Award, ChevronRight, Flame,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Avatar } from '@/components/ui/Avatar';
import { DifficultyBadge, RankBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LineChart } from '@/components/ui/Charts';
import { activities, activityLogs, teams, users, individualPerformanceData } from '@/data/mockData';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const userLogs = activityLogs.filter((l) => l.userId === user.id);
  const recentLogs = userLogs.slice(0, 4);
  const team = teams.find((t) => t.id === user.teamId);
  const topUsers = [...users].sort((a, b) => b.score - a.score).slice(0, 5);
  const availableActivities = activities.filter((a) => a.status === 'active').slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 lg:p-8">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 right-32 h-40 w-40 rounded-full bg-accent-500/20 blur-2xl" />
        <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-brand-200">Welcome back,</p>
            <h1 className="mt-1 text-3xl font-bold text-white">{user.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="badge bg-white/15 text-white backdrop-blur">
                <Users className="h-3.5 w-3.5" />
                {user.teamName}
              </span>
              <span className="badge bg-white/15 text-white backdrop-blur">
                <Flame className="h-3.5 w-3.5" />
                {user.activitiesCompleted} activities done
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/activities')}
            className="btn bg-white text-brand-700 hover:bg-brand-50 active:scale-[0.98]"
          >
            <Play className="h-4 w-4" />
            Start Activity
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Individual Score" value={user.score.toLocaleString()} icon={<Trophy className="h-5 w-5" />} trend={{ value: '12%', positive: true }} accent="brand" />
        <StatCard label="Individual Rank" value={`#${user.rank}`} icon={<Award className="h-5 w-5" />} accent="accent" />
        <StatCard label="Team Score" value={team?.score.toLocaleString() ?? '0'} icon={<Users className="h-5 w-5" />} trend={{ value: '8%', positive: true }} accent="success" />
        <StatCard label="Team Rank" value={`#${team?.rank ?? '-'}`} icon={<TrendingUp className="h-5 w-5" />} accent="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Your Performance" subtitle="Score progression over the last 8 weeks" icon={<TrendingUp className="h-5 w-5" />} />
          <div className="p-5 pt-4">
            <LineChart data={individualPerformanceData.map((d) => ({ label: d.week, value: d.score }))} height={200} />
          </div>
        </Card>

        {/* Quick start */}
        <Card>
          <CardHeader title="Quick Start" subtitle="Jump into an activity" icon={<Target className="h-5 w-5" />} />
          <div className="space-y-3 p-5 pt-4">
            {availableActivities.map((a) => (
              <div
                key={a.id}
                onClick={() => navigate(`/activities/${a.id}`)}
                className="card card-hover cursor-pointer p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-800">{a.name}</p>
                    <p className="mt-0.5 text-xs text-ink-400">{a.category} · {Math.floor(a.timeLimit / 60)}m</p>
                  </div>
                  <DifficultyBadge difficulty={a.difficulty} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <Card>
          <CardHeader
            title="Recent Activity"
            subtitle="Your latest completions"
            icon={<Clock className="h-5 w-5" />}
            action={<button onClick={() => navigate('/history')} className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</button>}
          />
          <div className="divide-y divide-ink-100 p-5 pt-0">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 py-3 first:pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-800">{log.activityName}</p>
                  <p className="text-xs text-ink-400">{log.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink-900">+{log.score}</p>
                  <DifficultyBadge difficulty={log.difficulty} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Leaderboard preview */}
        <Card>
          <CardHeader
            title="Leaderboard"
            subtitle="Top performers"
            icon={<Trophy className="h-5 w-5" />}
            action={<button onClick={() => navigate('/leaderboard')} className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</button>}
          />
          <div className="space-y-2 p-5 pt-0">
            {topUsers.map((u, i) => (
              <div
                key={u.id}
                className={`flex items-center gap-3 rounded-xl p-2.5 ${u.id === user.id ? 'bg-brand-50' : ''}`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-ink-500">
                  {i + 1}
                </span>
                <Avatar name={u.name} color={u.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-800">{u.name}</p>
                  <p className="text-xs text-ink-400">{u.teamName}</p>
                </div>
                <span className="text-sm font-bold text-ink-900">{u.score.toLocaleString()}</span>
                <RankBadge rank={u.rank} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Progress overview */}
      <Card>
        <CardHeader title="Progress Overview" subtitle="Activity completion and goals" icon={<Target className="h-5 w-5" />} />
        <div className="grid gap-6 p-5 pt-4 sm:grid-cols-3">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-ink-600">Activities Completed</span>
              <span className="text-sm font-bold text-ink-900">{user.activitiesCompleted}/12</span>
            </div>
            <ProgressBar value={user.activitiesCompleted} max={12} color="bg-brand-500" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-ink-600">Team Contribution</span>
              <span className="text-sm font-bold text-ink-900">{Math.round((user.score / (team?.score ?? 1)) * 100)}%</span>
            </div>
            <ProgressBar value={user.score} max={team?.score ?? 1} color="bg-success-500" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-ink-600">Avg Score Rate</span>
              <span className="text-sm font-bold text-ink-900">87%</span>
            </div>
            <ProgressBar value={87} max={100} color="bg-accent-500" />
          </div>
        </div>
      </Card>
    </div>
  );
}
