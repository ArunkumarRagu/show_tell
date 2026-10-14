import { apiClient } from './client';
import type { User, PaginatedResult } from '@/types';

export interface GetUsersParams {
  page?: number;
  page_size?: number;
  role?: string;
}

export async function getUsersApi(params?: GetUsersParams): Promise<User[] | PaginatedResult<User>> {
  return apiClient.get<User[] | PaginatedResult<User>>('/users', params);
}

export async function getUserByIdApi(id: string): Promise<User> {
  return apiClient.get<User>(`/users/${id}`);
}

export async function createUserApi(payload: Partial<User> & { password?: string }): Promise<User> {
  return apiClient.post<User>('/users', payload);
}

export async function updateUserApi(id: string, payload: Partial<User> & { password?: string }): Promise<User> {
  return apiClient.put<User>(`/users/${id}`, payload);
}

export async function deleteUserApi(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
