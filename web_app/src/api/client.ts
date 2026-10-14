import { toast } from 'react-toastify';
import type { PaginatedResult, PaginationMeta } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export function getToken(): string | null {
  return localStorage.getItem('hat_auth_token');
}

export function setToken(token: string): void {
  localStorage.setItem('hat_auth_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('hat_auth_token');
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

export function extractList<T>(data: T[] | PaginatedResult<T> | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if ('items' in data && Array.isArray(data.items)) return data.items;
  return [];
}

export function extractMeta(data: any): PaginationMeta | undefined {
  if (data && 'meta' in data) return data.meta;
  return undefined;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = responseData?.message || responseData?.detail || `HTTP Error ${response.status}`;
    if (response.status === 401) {
      toast.error(errorMsg, { toastId: 'http-401-unauthorized' });
      removeToken();
    }
    throw new Error(errorMsg);
  }

  return responseData?.data !== undefined ? responseData.data : responseData;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, any>) =>
    request<T>(`${endpoint}${buildQueryString(params)}`, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
