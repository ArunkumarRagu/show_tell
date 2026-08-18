import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Building2, Calendar, LogOut, Settings, Trophy, Target, Clock, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { RankBadge, DifficultyBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LineChart } from '@/components/ui/Charts';
import { teams, activityLogs, individualPerformanceData } from '@/data/mockData';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const team = teams.find((t) => t.id === user.teamId);
  const userLogs = activityLogs.filter((l) => l.userId === user.id);
  const completed = userLogs.filter((l) => l.status === 'completed').length;

  const handleLogout = () => {
    logout();
    toast.info('Signed out successfully');
    navigate('/');
  };


  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Profile header */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-600 to-brand-800" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="rounded-full ring-4 ring-white">
                <Avatar name={user.name} color={user.avatarColor} size="lg" />
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-ink-900">{user.name}</h1>
                <p className="text-sm text-ink-500">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary">
                <Settings className="h-4 w-4" />
                Edit Profile
              </button>
              <button onClick={handleLogout} className="btn-danger">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Info grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal info */}
        <Card className="lg:col-span-1">
          <CardHeader title="Personal Info" icon={<UserIcon className="h-5 w-5" />} />
          <div className="space-y-4 p-5 pt-4">
            <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Employee ID" value={user.employeeId} />
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Team" value={user.teamName} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Joined" value={user.joinedDate} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Last Active" value={user.lastActive} />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-ink-400">Total Score</p>
                <p className="text-xl font-bold text-ink-900">{user.score.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-ink-400">Individual Rank</p>
                <p className="text-xl font-bold text-ink-900">#{user.rank}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-ink-400">Activities Done</p>
                <p className="text-xl font-bold text-ink-900">{user.activitiesCompleted}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-50 text-warning-600">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-ink-400">Team Rank</p>
                <p className="text-xl font-bold text-ink-900">#{team?.rank}</p>
              </div>
            </div>
          </Card>

          {/* Performance chart */}
          <Card className="col-span-2 p-5">
            <h3 className="text-sm font-bold text-ink-900">Score Progression</h3>
            <p className="text-xs text-ink-400">Last 8 weeks</p>
            <div className="mt-3">
              <LineChart data={individualPerformanceData.map((d) => ({ label: d.week, value: d.score }))} height={160} />
            </div>
          </Card>
        </div>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader title="Recent Activity" subtitle="Your latest completions" icon={<Clock className="h-5 w-5" />} />
        <div className="divide-y divide-ink-100 p-5 pt-0">
          {userLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center gap-3 py-3 first:pt-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-800">{log.activityName}</p>
                <div className="mt-1 flex items-center gap-2">
                  <DifficultyBadge difficulty={log.difficulty} />
                  <span className="text-xs text-ink-400">{log.date}</span>
                </div>
              </div>
              <span className="text-sm font-bold text-ink-900">+{log.score}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-50 text-ink-400">{icon}</div>
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm font-semibold text-ink-800">{value}</p>
      </div>
    </div>
  );
}
