import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeamsApi, getTeamByIdApi, createTeamApi, updateTeamApi, deleteTeamApi, type GetTeamsParams } from '@/api/teams';
import type { Team } from '@/types';

export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (params?: GetTeamsParams) => [...teamKeys.lists(), params] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id?: string) => [...teamKeys.details(), id] as const,
};

export function useTeamsQuery(params?: GetTeamsParams) {
  return useQuery({
    queryKey: teamKeys.list(params),
    queryFn: () => getTeamsApi(params),
  });
}

export function useTeamQuery(id?: string) {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => getTeamByIdApi(id!),
    enabled: !!id,
  });
}

export function useCreateTeamMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Team>) => createTeamApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
    },
  });
}

export function useUpdateTeamMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Team> }) =>
      updateTeamApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(variables.id) });
    },
  });
}

export function useDeleteTeamMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTeamApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all });
    },
  });
}
