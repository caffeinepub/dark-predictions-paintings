import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Painting, PaintingId, Price, UserRole, ExternalBlob, SiteContent, UserProfile } from '../backend';
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

export function useTogglePaintingSold() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: PaintingId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.togglePaintingSoldStatus(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['paintings'] });
      queryClient.invalidateQueries({ queryKey: ['painting', id] });
    },
  });
}

// Site Content
export function useSiteContent() {
  const { actor, isFetching } = useActor();

  return useQuery<SiteContent>({
    queryKey: ['siteContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSiteContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newContent: SiteContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSiteContent(newContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteContent'] });
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

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
