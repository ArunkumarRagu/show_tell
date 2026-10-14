import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersApi, getUserByIdApi, createUserApi, updateUserApi, deleteUserApi, type GetUsersParams } from '@/api/users';
import type { User } from '@/types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: GetUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id?: string) => [...userKeys.details(), id] as const,
};

export function useUsersQuery(params?: GetUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsersApi(params),
  });
}

export function useUserQuery(id?: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserByIdApi(id!),
    enabled: !!id,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<User> & { password?: string }) => createUserApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<User> & { password?: string } }) =>
      updateUserApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
