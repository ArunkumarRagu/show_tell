import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettingsApi, updateSettingsApi, type SystemSettingsData } from '@/api/settings';

export const settingKeys = {
  all: ['settings'] as const,
  system: () => [...settingKeys.all, 'system'] as const,
};

export function useSettingsQuery() {
  return useQuery({
    queryKey: settingKeys.system(),
    queryFn: getSettingsApi,
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SystemSettingsData>) => updateSettingsApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
    },
  });
}
