import { apiClient } from './client';
import type { ActivityLog, AdminLog, PaginatedResult } from '@/types';

export interface GetLogsParams {
  page?: number;
  page_size?: number;
}

export async function getUserLogsApi(params?: GetLogsParams): Promise<ActivityLog[] | PaginatedResult<ActivityLog>> {
  return apiClient.get<ActivityLog[] | PaginatedResult<ActivityLog>>('/logs/user', params);
}

export async function getAdminLogsApi(params?: GetLogsParams): Promise<AdminLog[] | PaginatedResult<AdminLog>> {
  return apiClient.get<AdminLog[] | PaginatedResult<AdminLog>>('/logs/admin', params);
}
