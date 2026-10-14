import { useQuery } from '@tanstack/react-query';
import { getTeamLeaderboardApi, getUserLeaderboardApi, type GetLeaderboardParams } from '@/api/leaderboard';

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  teams: (params?: GetLeaderboardParams) => [...leaderboardKeys.all, 'teams', params] as const,
  users: (params?: GetLeaderboardParams) => [...leaderboardKeys.all, 'users', params] as const,
};

export function useTeamLeaderboardQuery(params?: GetLeaderboardParams) {
  return useQuery({
    queryKey: leaderboardKeys.teams(params),
    queryFn: () => getTeamLeaderboardApi(params),
  });
}

export function useUserLeaderboardQuery(params?: GetLeaderboardParams) {
  return useQuery({
    queryKey: leaderboardKeys.users(params),
    queryFn: () => getUserLeaderboardApi(params),
  });
}
