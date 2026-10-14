import { apiClient } from './client';
import type { Activity, PaginatedResult } from '@/types';

export interface ActivitySubmissionResult {
  logId: string;
  score: number;
  maxScore: number;
  passingScore: number;
  status: 'completed' | 'failed';
  timeTaken: number;
  totalQuestions: number;
  correctQuestions: number;
}

export interface GetActivitiesParams {
  page?: number;
  page_size?: number;
  include_inactive?: boolean;
  category?: string;
}

export async function getActivitiesApi(
  includeInactive = true,
  params?: GetActivitiesParams
): Promise<Activity[] | PaginatedResult<Activity>> {
  return apiClient.get<Activity[] | PaginatedResult<Activity>>('/activities', {
    include_inactive: includeInactive,
    ...params,
  });
}

export async function getActivityByIdApi(id: string): Promise<Activity> {
  return apiClient.get<Activity>(`/activities/${id}`);
}

export async function createActivityApi(payload: Partial<Activity>): Promise<Activity> {
  return apiClient.post<Activity>('/activities', payload);
}

export async function updateActivityApi(id: string, payload: Partial<Activity>): Promise<Activity> {
  return apiClient.put<Activity>(`/activities/${id}`, payload);
}

export async function toggleActivityStatusApi(id: string): Promise<Activity> {
  return apiClient.patch<Activity>(`/activities/${id}/toggle-status`);
}

export async function deleteActivityApi(id: string): Promise<void> {
  await apiClient.delete(`/activities/${id}`);
}

export async function submitActivityApi(
  id: string,
  answers: number[],
  timeTaken: number
): Promise<ActivitySubmissionResult> {
  return apiClient.post<ActivitySubmissionResult>(`/activities/${id}/submit`, {
    answers,
    timeTaken,
  });
}
