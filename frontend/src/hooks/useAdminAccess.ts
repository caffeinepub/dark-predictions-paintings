import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserRole } from './useQueries';
import { UserRole } from '../backend';

export function useAdminAccess() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userRole, isLoading: isRoleLoading } = useGetCallerUserRole();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === UserRole.admin;
  const isLoading = isInitializing || isRoleLoading;

  return {
    isAuthenticated,
    isAdmin,
    isLoading,
  };
}
