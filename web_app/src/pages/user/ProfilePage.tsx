import { useNavigate } from '@tanstack/react-router';
import { User as UserIcon, Mail, Building2, Calendar, LogOut, Trophy, Target, Clock, Award, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { DifficultyBadge } from '@/components/ui/Badge';
import { LineChart } from '@/components/ui/Charts';
import { useUserLogsQuery } from '@/hooks/queries/useLogs';
import { Tooltip, InfoTooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';
import { extractList } from '@/api/client';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: userLogsData, isLoading } = useUserLogsQuery();
  const userLogs = extractList(userLogsData);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out successfully');
    navigate({ to: '/' });
  };

  const sampleProgression = [
    { label: 'W1', value: 320 },
    { label: 'W2', value: 480 },
    { label: 'W3', value: 410 },
    { label: 'W4', value: 620 },
    { label: 'W5', value: 580 },
    { label: 'W6', value: 740 },
    { label: 'W7', value: 890 },
    { label: 'W8', value: user.score || 1240 },
  ];

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
              <Tooltip content={tooltips.layout.signOut} position="left">
                <button onClick={handleLogout} className="btn-danger">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </Tooltip>
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
            <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Employee ID" value={user.employeeId} tooltip={tooltips.users.employeeId} />
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} tooltip={tooltips.users.email} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Team" value={user.teamName || 'Phoenix'} tooltip={tooltips.users.team} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Joined" value={user.joinedDate || '2025-01-15'} tooltip={tooltips.profile.joinedDate} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Last Active" value={user.lastActive || 'Just now'} tooltip={tooltips.profile.lastActive} />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-2">
          <Tooltip content={tooltips.dashboard.userTotalScore} position="top" className="w-full">
            <Card className="p-5 w-full cursor-pointer">
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
          </Tooltip>
          <Tooltip content={tooltips.dashboard.userGlobalRank} position="top" className="w-full">
            <Card className="p-5 w-full cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-ink-400">Individual Rank</p>
                  <p className="text-xl font-bold text-ink-900">#{user.rank || 1}</p>
                </div>
              </div>
            </Card>
          </Tooltip>
          <Tooltip content={tooltips.dashboard.userCompletedActivities} position="top" className="w-full">
            <Card className="p-5 w-full cursor-pointer">
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
          </Tooltip>
          <Tooltip content={tooltips.users.role} position="top" className="w-full">
            <Card className="p-5 w-full cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-50 text-warning-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-ink-400">Role</p>
                  <p className="text-xl font-bold text-ink-900 uppercase">{user.role}</p>
                </div>
              </div>
            </Card>
          </Tooltip>

          {/* Performance chart */}
          <Card className="col-span-2 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink-900">Score Progression</h3>
                <p className="text-xs text-ink-400">Last 8 weeks</p>
              </div>
              <InfoTooltip content={tooltips.dashboard.individualPerformanceTrend} />
            </div>
            <div className="mt-3">
              <LineChart data={sampleProgression} height={160} />
            </div>
          </Card>
        </div>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader title="Recent Activity" subtitle="Your latest completions" icon={<Clock className="h-5 w-5" />} />
        <div className="divide-y divide-ink-100 p-5 pt-0">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          ) : userLogs.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-400">No activity history yet.</p>
          ) : (
            userLogs.slice(0, 5).map((log) => (
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
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ icon, label, value, tooltip }: { icon: React.ReactNode; label: string; value: string; tooltip?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-50 text-ink-400">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs text-ink-400">{label}</p>
          {tooltip && <InfoTooltip content={tooltip} iconSize={12} />}
        </div>
        <p className="text-sm font-semibold text-ink-800 truncate">{value}</p>
      </div>
    </div>
  );
}
