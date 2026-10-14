import { useQuery } from '@tanstack/react-query';
import { getUserLogsApi, getAdminLogsApi, type GetLogsParams } from '@/api/logs';

export const logKeys = {
  all: ['logs'] as const,
  user: (params?: GetLogsParams) => [...logKeys.all, 'user', params] as const,
  admin: (params?: GetLogsParams) => [...logKeys.all, 'admin', params] as const,
};

export function useUserLogsQuery(params?: GetLogsParams) {
  return useQuery({
    queryKey: logKeys.user(params),
    queryFn: () => getUserLogsApi(params),
  });
}

export function useAdminLogsQuery(params?: GetLogsParams) {
  return useQuery({
    queryKey: logKeys.admin(params),
    queryFn: () => getAdminLogsApi(params),
  });
}
