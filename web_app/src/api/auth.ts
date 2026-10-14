import { apiClient, setToken, removeToken } from './client';
import type { User } from '@/types';

export interface LoginResponseData {
  access_token: string;
  token_type: string;
  user: User;
}

export async function loginApi(employeeId: string, password?: string): Promise<User> {
  const data = await apiClient.post<LoginResponseData>('/auth/login', {
    employee_id: employeeId,
    password: password || undefined,
  });
  if (data.access_token) {
    setToken(data.access_token);
  }
  return data.user;
}

export async function getMeApi(): Promise<User> {
  return apiClient.get<User>('/auth/me');
}

export async function logoutApi(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    removeToken();
  }
}
