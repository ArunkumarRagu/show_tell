import { apiClient } from './client';
import type { Team, PaginatedResult } from '@/types';

export interface GetTeamsParams {
  page?: number;
  page_size?: number;
}

export async function getTeamsApi(params?: GetTeamsParams): Promise<Team[] | PaginatedResult<Team>> {
  return apiClient.get<Team[] | PaginatedResult<Team>>('/teams', params);
}

export async function getTeamByIdApi(id: string): Promise<Team> {
  return apiClient.get<Team>(`/teams/${id}`);
}

export async function createTeamApi(payload: Partial<Team>): Promise<Team> {
  return apiClient.post<Team>('/teams', payload);
}

export async function updateTeamApi(id: string, payload: Partial<Team>): Promise<Team> {
  return apiClient.put<Team>(`/teams/${id}`, payload);
}

export async function deleteTeamApi(id: string): Promise<void> {
  await apiClient.delete(`/teams/${id}`);
}
