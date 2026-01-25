'use client';

import {
  type Permission,
  ROLE_HIERARCHY,
  ROLE_LABELS,
  type UserRole,
  canManageRole,
  getPermissionsForRole,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from '@/lib/permissions';
import { useSafeUser } from './use-safe-auth';

interface UsePermissionsReturn {
  /** Current user's role */
  role: UserRole | undefined;
  /** Whether the user is authenticated and role is loaded */
  isLoaded: boolean;
  /** Check if user has a specific permission */
  can: (permission: Permission) => boolean;
  /** Check if user has any of the specified permissions */
  canAny: (permissions: Permission[]) => boolean;
  /** Check if user has all of the specified permissions */
  canAll: (permissions: Permission[]) => boolean;
  /** Check if user can manage another role */
  canManage: (targetRole: UserRole) => boolean;
  /** Get all permissions for the current user */
  permissions: Permission[];
  /** Get human-readable role label */
  roleLabel: string | undefined;
  /** Check if user has specific role */
  hasRole: (role: UserRole) => boolean;
  /** Check if user has any of the specified roles */
  hasAnyRole: (roles: UserRole[]) => boolean;
  /** Check if user is an admin */
  isAdmin: boolean;
  /** Check if user is a verifier */
  isVerifier: boolean;
  /** Check if user is a landlord */
  isLandlord: boolean;
  /** Check if user is a renter */
  isRenter: boolean;
}

/**
 * Hook for role-based access control
 *
 * @example
 * ```tsx
 * const { can, isAdmin, role } = usePermissions();
 *
 * if (can('property:verify')) {
 *   // Show verification controls
 * }
 *
 * if (isAdmin) {
 *   // Show admin panel
 * }
 * ```
 */
export function usePermissions(): UsePermissionsReturn {
  const { user, isLoaded } = useSafeUser();

  const role = (user?.unsafeMetadata?.role as UserRole) || undefined;

  return {
    role,
    isLoaded,

    can: (permission: Permission) => hasPermission(role, permission),

    canAny: (permissions: Permission[]) => hasAnyPermission(role, permissions),

    canAll: (permissions: Permission[]) => hasAllPermissions(role, permissions),

    canManage: (targetRole: UserRole) => (role ? canManageRole(role, targetRole) : false),

    permissions: role ? getPermissionsForRole(role) : [],

    roleLabel: role ? ROLE_LABELS[role] : undefined,

    hasRole: (checkRole: UserRole) => role === checkRole,

    hasAnyRole: (roles: UserRole[]) => (role ? roles.includes(role) : false),

    isAdmin: role === 'admin',
    isVerifier: role === 'verifier' || role === 'admin',
    isLandlord: role === 'landlord' || role === 'admin',
    isRenter: role === 'renter' || role === 'landlord' || role === 'admin',
  };
}

/**
 * Component wrapper for permission-based rendering
 *
 * @example
 * ```tsx
 * <RequirePermission permission="property:verify">
 *   <VerificationPanel />
 * </RequirePermission>
 * ```
 */
export function RequirePermission({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { can, canAny, canAll, isLoaded } = usePermissions();

  // Don't render until auth is loaded
  if (!isLoaded) {
    return null;
  }

  // Single permission check
  if (permission && !can(permission)) {
    return fallback;
  }

  // Multiple permissions check
  if (permissions) {
    const hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
    if (!hasAccess) {
      return fallback;
    }
  }

  return children;
}

/**
 * Component wrapper for role-based rendering
 *
 * @example
 * ```tsx
 * <RequireRole roles={['admin', 'verifier']}>
 *   <AdminPanel />
 * </RequireRole>
 * ```
 */
export function RequireRole({
  requiredRole,
  roles,
  fallback = null,
  children,
}: {
  requiredRole?: UserRole;
  roles?: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { hasRole, hasAnyRole, isLoaded } = usePermissions();

  if (!isLoaded) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback;
  }

  if (roles && !hasAnyRole(roles)) {
    return fallback;
  }

  return children;
}
