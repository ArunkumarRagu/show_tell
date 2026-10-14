import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getActivitiesApi,
  getActivityByIdApi,
  createActivityApi,
  updateActivityApi,
  toggleActivityStatusApi,
  deleteActivityApi,
  submitActivityApi,
  type GetActivitiesParams,
} from '@/api/activities';
import type { Activity } from '@/types';

export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (includeInactive: boolean, params?: GetActivitiesParams) => [...activityKeys.lists(), { includeInactive, ...params }] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id?: string) => [...activityKeys.details(), id] as const,
};

export function useActivitiesQuery(includeInactive = true, params?: GetActivitiesParams) {
  return useQuery({
    queryKey: activityKeys.list(includeInactive, params),
    queryFn: () => getActivitiesApi(includeInactive, params),
  });
}

export function useActivityQuery(id?: string) {
  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () => getActivityByIdApi(id!),
    enabled: !!id,
  });
}

export function useCreateActivityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Activity>) => createActivityApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useUpdateActivityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Activity> }) =>
      updateActivityApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(variables.id) });
    },
  });
}

export function useToggleActivityStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleActivityStatusApi(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(id) });
    },
  });
}

export function useDeleteActivityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteActivityApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useSubmitActivityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      answers,
      timeTaken,
    }: {
      id: string;
      answers: number[];
      timeTaken: number;
    }) => submitActivityApi(id, answers, timeTaken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
