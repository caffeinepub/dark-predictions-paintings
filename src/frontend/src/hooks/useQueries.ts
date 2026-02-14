import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Painting, PaintingId, Price, UserRole, ExternalBlob } from '../backend';
import { UserRole as UserRoleEnum } from '../backend';

// Paintings
export function useGetAllPaintings() {
  const { actor, isFetching } = useActor();

  return useQuery<Painting[]>({
    queryKey: ['paintings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPaintings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPainting(id: PaintingId) {
  const { actor, isFetching } = useActor();

  return useQuery<Painting | null>({
    queryKey: ['painting', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPainting(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddPainting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      price,
      images,
    }: {
      id: PaintingId;
      title: string;
      description: string;
      price: Price;
      images: ExternalBlob[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPainting(id, title, description, price, images);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paintings'] });
    },
  });
}

export function useUpdatePainting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      price,
      images,
    }: {
      id: PaintingId;
      title: string;
      description: string;
      price: Price;
      images: ExternalBlob[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePainting(id, title, description, price, images);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['paintings'] });
      queryClient.invalidateQueries({ queryKey: ['painting', variables.id] });
    },
  });
}

export function useDeletePainting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: PaintingId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePainting(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paintings'] });
    },
  });
}

// User Role
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) return UserRoleEnum.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}
