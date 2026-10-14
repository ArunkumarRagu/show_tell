import { useState } from 'react';
import { Trophy, Users, Search, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { RankBadge } from '@/components/ui/Badge';
import { useTeamLeaderboardQuery, useUserLeaderboardQuery } from '@/hooks/queries/useLeaderboard';
import { Tooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';

import { extractList } from '@/api/client';

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'teams' | 'users'>('teams');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: rawTeams, isLoading: isLoadingTeams } = useTeamLeaderboardQuery();
  const { data: rawUsers, isLoading: isLoadingUsers } = useUserLeaderboardQuery();

  const teamsList = extractList(rawTeams);
  const usersList = extractList(rawUsers);

  const loading = isLoadingTeams || isLoadingUsers;

  const filteredTeams = teamsList.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Leaderboards</h1>
          <p className="mt-1 text-sm text-ink-500">Real-time team and individual standings.</p>
        </div>

        {/* Tab selector */}
        <div className="inline-flex rounded-xl bg-ink-100 p-1">
          <Tooltip content={tooltips.leaderboard.individualVsTeam} position="bottom">
            <button
              onClick={() => setActiveTab('teams')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === 'teams' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              <Users className="h-4 w-4" />
              Teams Standings
            </button>
          </Tooltip>
          <Tooltip content={tooltips.leaderboard.rankPosition} position="bottom">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === 'users' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              <Trophy className="h-4 w-4" />
              Individual Rankings
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="input pl-10"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      ) : activeTab === 'teams' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team, idx) => (
            <Card key={team.id} className="p-6 transition-all hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl font-bold text-white shadow-sm"
                    style={{ backgroundColor: team.color }}
                  >
                    #{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900">{team.name}</h3>
                    <p className="text-xs text-ink-400">{team.activitiesCompleted} activities completed</p>
                  </div>
                </div>
                <Tooltip content={tooltips.leaderboard.topPerformer} position="top">
                  <RankBadge rank={idx + 1} />
                </Tooltip>
              </div>
              <p className="mt-4 text-xs text-ink-500 line-clamp-2">{team.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-4">
                <span className="text-xs font-medium text-ink-500">Total Score</span>
                <Tooltip content={tooltips.teams.teamScore} position="top">
                  <span className="text-lg font-extrabold text-brand-600 cursor-pointer">{team.score.toLocaleString()} pts</span>
                </Tooltip>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden border border-[#26324A] bg-[#151E33] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#26324A] bg-[#11182B] text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Completed</th>
                  <th className="px-6 py-4 text-right">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26324A]">
                {filteredUsers.map((u, i) => (
                  <tr key={u.id} className="hover:bg-[#1C2742]/50 transition-colors">
                    <td className="px-6 py-4">
                      <RankBadge rank={i + 1} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} color={u.avatarColor} size="sm" />
                        <div>
                          <p className="font-semibold text-white">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{u.teamName}</td>
                    <td className="px-6 py-4 text-slate-300">{u.activitiesCompleted}</td>
                    <td className="px-6 py-4 text-right font-extrabold text-purple-400">{u.score.toLocaleString()} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
