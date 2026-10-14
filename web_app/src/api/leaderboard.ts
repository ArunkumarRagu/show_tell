import { apiClient } from './client';
import type { Team, User, PaginatedResult } from '@/types';

export interface GetLeaderboardParams {
  page?: number;
  page_size?: number;
}

export async function getTeamLeaderboardApi(params?: GetLeaderboardParams): Promise<Team[] | PaginatedResult<Team>> {
  return apiClient.get<Team[] | PaginatedResult<Team>>('/leaderboard/teams', params);
}

export async function getUserLeaderboardApi(params?: GetLeaderboardParams): Promise<User[] | PaginatedResult<User>> {
  return apiClient.get<User[] | PaginatedResult<User>>('/leaderboard/users', params);
}
