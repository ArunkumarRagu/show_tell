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

  const podiumGlows = [
    'from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/50 shadow-[0_0_25px_rgba(251,191,36,0.25)]',
    'from-slate-300/20 via-slate-300/10 to-transparent border-slate-300/40 shadow-[0_0_20px_rgba(203,213,225,0.2)]',
    'from-amber-700/20 via-amber-700/10 to-transparent border-amber-600/40 shadow-[0_0_20px_rgba(205,127,50,0.2)]',
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Leaderboard</h1>
        <p className="mt-1 text-sm text-slate-400">See how teams and individuals rank in the competition.</p>
      </div>

      {/* Podium for teams */}
      {tab === 'teams' && (
        <div className="grid grid-cols-3 gap-3 lg:gap-4 items-end pt-4">
          {[1, 0, 2].map((idx) => {
            const team = sortedTeams[idx];
            if (!team) return null;
            const heights = ['h-32', 'h-44', 'h-28'];
            const icons = [
              <Crown key="0" className="h-6 w-6 text-amber-400 animate-bounce" />,
              <Medal key="1" className="h-5 w-5 text-slate-300" />,
              <Medal key="2" className="h-5 w-5 text-amber-600" />,
            ];
            const rankTitles = ['1st Place', '2nd Place', '3rd Place'];

            return (
              <div key={team.id} className="flex flex-col items-center">
                {idx === 0 && <div className="mb-2 text-3xl">👑</div>}
                <div
                  className={`flex w-full max-w-[11rem] flex-col items-center justify-end rounded-t-2xl border-t border-x bg-gradient-to-b ${podiumGlows[idx]} ${heights[idx]} p-4 text-center backdrop-blur-md`}
                >
                  {icons[idx]}
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{rankTitles[idx]}</p>
                  <p className="text-base font-bold text-white tracking-tight truncate max-w-full">{team.name}</p>
                  <p className="text-xl font-display font-extrabold" style={{ color: team.color }}>
                    {team.score.toLocaleString()} <span className="text-xs font-sans text-slate-400">pts</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-[#11182B] p-1.5 border border-[#26324A]">
        <button
          onClick={() => setTab('teams')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            tab === 'teams' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          Teams
        </button>
        <button
          onClick={() => setTab('individuals')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            tab === 'individuals' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white'
          }`}
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
                className={`flex items-center gap-4 rounded-xl p-3.5 transition-all ${
                  team.id === user?.teamId
                    ? 'bg-purple-500/10 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                    : 'bg-[#0B1020]/40 border border-[#26324A]/60 hover:bg-[#1C2742]'
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1020] font-display text-base font-bold text-slate-300 border border-[#26324A]">
                  #{i + 1}
                </span>
                <div className="flex h-10 w-1.5 rounded-full" style={{ backgroundColor: team.color }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-white">{team.name}</p>
                    <p className="font-display text-base font-extrabold text-white">{team.score.toLocaleString()} <span className="text-xs font-sans text-slate-400">pts</span></p>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <ProgressBar value={team.score} max={maxTeamScore} color="bg-purple-600" className="flex-1" size="sm" />
                    <span className="text-xs text-slate-400 font-medium">{team.activitiesCompleted} activities</span>
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
                className={`flex items-center gap-3 rounded-xl p-3.5 transition-all ${
                  u.id === user?.id
                    ? 'bg-purple-500/10 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                    : 'bg-[#0B1020]/40 border border-[#26324A]/60 hover:bg-[#1C2742]'
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg font-display text-xs font-bold text-slate-400">
                  #{i + 1}
                </span>
                <Avatar name={u.name} color={u.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.teamName} · {u.activitiesCompleted} activities</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-base font-extrabold text-white">{u.score.toLocaleString()}</p>
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
