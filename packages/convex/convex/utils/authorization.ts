import type { Id } from '../_generated/dataModel';

type UserRole = 'renter' | 'landlord' | 'admin' | 'verifier';

/**
 * Assert that the current user owns a resource or is an admin.
 * Throws if unauthorized.
 *
 * @example
 * assertOwner(property.landlordId, user._id, user.role);
 */
export function assertOwner(
  resourceOwnerId: Id<'users'>,
  userId: Id<'users'>,
  userRole?: UserRole,
  options: { allowAdmin?: boolean } = {}
): void {
  const { allowAdmin = true } = options;
  const isOwner = resourceOwnerId === userId;
  const isAdmin = allowAdmin && userRole === 'admin';

  if (!isOwner && !isAdmin) {
    throw new Error('Unauthorized: You do not own this resource');
  }
}

/**
 * Assert that the current user has one of the allowed roles.
 * Throws if unauthorized.
 *
 * @example
 * assertRole(user.role, ['admin', 'verifier']);
 */
export function assertRole(userRole: UserRole | undefined, allowedRoles: UserRole[]): void {
  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new Error(`Unauthorized: Requires ${allowedRoles.join(' or ')} role`);
  }
}

/**
 * Assert that the current user is an admin.
 * Throws if unauthorized.
 *
 * @example
 * assertAdmin(user.role);
 */
export function assertAdmin(userRole: UserRole | undefined): void {
  assertRole(userRole, ['admin']);
}

/**
 * Assert that the current user is an admin or verifier.
 * Throws if unauthorized.
 *
 * @example
 * assertAdminOrVerifier(user.role);
 */
export function assertAdminOrVerifier(userRole: UserRole | undefined): void {
  assertRole(userRole, ['admin', 'verifier']);
}

/**
 * Assert that the current user is a landlord or admin.
 * Throws if unauthorized.
 *
 * @example
 * assertLandlordOrAdmin(user.role);
 */
export function assertLandlordOrAdmin(userRole: UserRole | undefined): void {
  assertRole(userRole, ['landlord', 'admin']);
}

/**
 * Check if user has one of the allowed roles (non-throwing version).
 *
 * @example
 * if (!hasRole(user.role, ['admin'])) return null;
 */
export function hasRole(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  return !!userRole && allowedRoles.includes(userRole);
}

/**
 * Check if user owns a resource or is an admin (non-throwing version).
 *
 * @example
 * if (!isOwnerOrAdmin(property.landlordId, user._id, user.role)) return null;
 */
export function isOwnerOrAdmin(
  resourceOwnerId: Id<'users'>,
  userId: Id<'users'>,
  userRole?: UserRole
): boolean {
  return resourceOwnerId === userId || userRole === 'admin';
}
