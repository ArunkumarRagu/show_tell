import { apiClient } from './client';

export interface SystemSettingsData {
  competitionName: string;
  allowSelfRegistration: boolean;
  maxTeamSize: number;
  defaultPassingScore: number;
  enableLeaderboard: boolean;
}

export async function getSettingsApi(): Promise<SystemSettingsData> {
  return apiClient.get<SystemSettingsData>('/settings');
}

export async function updateSettingsApi(payload: Partial<SystemSettingsData>): Promise<SystemSettingsData> {
  return apiClient.put<SystemSettingsData>('/settings', payload);
}
