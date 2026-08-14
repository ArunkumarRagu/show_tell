import { useState } from 'react';
import { Trophy, Medal, Crown, Users, User as UserIcon } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { RankBadge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { teams, users } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

type Tab = 'teams' | 'individuals';

export function LeaderboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('teams');

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const sortedUsers = [...users].filter((u) => u.role === 'user').sort((a, b) => b.score - a.score);
  const maxTeamScore = sortedTeams[0]?.score ?? 1;
  const maxUserScore = sortedUsers[0]?.score ?? 1;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Leaderboard</h1>
        <p className="mt-1 text-sm text-ink-500">See how teams and individuals rank in the competition.</p>
      </div>

      {/* Podium for teams */}
      {tab === 'teams' && (
        <div className="grid grid-cols-3 gap-3 lg:gap-4">
          {[1, 0, 2].map((idx) => {
            const team = sortedTeams[idx];
            if (!team) return null;
            const heights = ['h-28', 'h-36', 'h-24'];
            const icons = [<Crown key="0" className="h-5 w-5 text-amber-500" />, <Medal key="1" className="h-5 w-5 text-ink-400" />, <Medal key="2" className="h-5 w-5 text-orange-400" />];
            return (
              <div key={team.id} className="flex flex-col items-center">
                {idx === 0 && <div className="mb-1 text-2xl">👑</div>}
                <div className={`flex w-full max-w-[10rem] flex-col items-center justify-end rounded-t-2xl bg-gradient-to-b ${idx === 0 ? 'from-amber-100 to-amber-50' : idx === 1 ? 'from-ink-100 to-ink-50' : 'from-orange-100 to-orange-50'} ${heights[idx]} p-4`}>
                  {icons[idx]}
                  <p className="mt-2 text-sm font-bold text-ink-900">{team.name}</p>
                  <p className="text-lg font-bold" style={{ color: team.color }}>{team.score.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-ink-100 p-1">
        <button
          onClick={() => setTab('teams')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${tab === 'teams' ? 'bg-white text-brand-700 shadow-soft' : 'text-ink-500'}`}
        >
          <Users className="h-4 w-4" />
          Teams
        </button>
        <button
          onClick={() => setTab('individuals')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${tab === 'individuals' ? 'bg-white text-brand-700 shadow-soft' : 'text-ink-500'}`}
        >
          <UserIcon className="h-4 w-4" />
          Individuals
        </button>
      </div>

      {/* Teams leaderboard */}
      {tab === 'teams' && (
        <Card>
          <CardHeader title="Team Rankings" subtitle="All 6 teams ranked by total score" icon={<Trophy className="h-5 w-5" />} />
          <div className="space-y-2 p-5 pt-4">
            {sortedTeams.map((team, i) => (
              <div
                key={team.id}
                className={`flex items-center gap-4 rounded-xl p-3 transition-colors ${team.id === user?.teamId ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-ink-50'}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-sm font-bold text-ink-600">
                  {i + 1}
                </span>
                <div className="flex h-10 w-1 rounded-full" style={{ backgroundColor: team.color }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-ink-900">{team.name}</p>
                    <p className="text-sm font-bold text-ink-900">{team.score.toLocaleString()} pts</p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <ProgressBar value={team.score} max={maxTeamScore} color="" className="flex-1" size="sm" />
                    <span className="text-xs text-ink-400">{team.activitiesCompleted} activities</span>
                    <RankBadge rank={team.rank} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Individuals leaderboard */}
      {tab === 'individuals' && (
        <Card>
          <CardHeader title="Individual Rankings" subtitle="All members ranked by score" icon={<Trophy className="h-5 w-5" />} />
          <div className="space-y-2 p-5 pt-4">
            {sortedUsers.map((u, i) => (
              <div
                key={u.id}
                className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${u.id === user?.id ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-ink-50'}`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-ink-500">
                  {i + 1}
                </span>
                <Avatar name={u.name} color={u.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-800">{u.name}</p>
                  <p className="text-xs text-ink-400">{u.teamName} · {u.activitiesCompleted} activities</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink-900">{u.score.toLocaleString()}</p>
                </div>
                <RankBadge rank={u.rank} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
