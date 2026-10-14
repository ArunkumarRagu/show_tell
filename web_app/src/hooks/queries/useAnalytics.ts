import { useQuery } from '@tanstack/react-query';
import { getAnalyticsOverviewApi } from '@/api/analytics';

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: () => [...analyticsKeys.all, 'overview'] as const,
};

export function useAnalyticsOverviewQuery() {
  return useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: getAnalyticsOverviewApi,
  });
}
