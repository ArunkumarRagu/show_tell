import { apiClient } from './client';

export interface AnalyticsOverviewData {
  totalUsers: number;
  activeUsers: number;
  totalTeams: number;
  totalActivities: number;
  activeActivities: number;
  totalCompletions: number;
  avgCompletionRate: number;
  teamPerformance: { name: string; score: number; color: string }[];
  individualPerformance: { week: string; score: number }[];
  difficultyBreakdown: { difficulty: string; completed: number; avgScore: number; total: number }[];
  completionRateData: { label: string; value: number; color: string }[];
}

export async function getAnalyticsOverviewApi(): Promise<AnalyticsOverviewData> {
  return apiClient.get<AnalyticsOverviewData>('/analytics/overview');
}
