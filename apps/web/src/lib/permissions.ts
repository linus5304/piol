/**
 * Role-Based Access Control (RBAC) permissions for Piol
 *
 * User Roles:
 * - renter: Browse, save, message, pay
 * - landlord: Create/manage properties, receive payments
 * - admin: Full access, manage users
 * - verifier: Verify properties, update verification status
 */

export type UserRole = 'renter' | 'landlord' | 'admin' | 'verifier';

export type Permission =
  // Property permissions
  | 'property:create'
  | 'property:edit:own'
  | 'property:edit:any'
  | 'property:delete:own'
  | 'property:delete:any'
  | 'property:verify'
  | 'property:view:draft'
  | 'property:view:pending'
  // User permissions
  | 'user:manage'
  | 'user:view:all'
  | 'user:verify'
  | 'user:change-role'
  // Transaction permissions
  | 'transaction:view:own'
  | 'transaction:view:all'
  | 'transaction:manage'
  // Message permissions
  | 'message:send'
  | 'message:view:own'
  | 'message:view:all'
  // Dashboard permissions
  | 'dashboard:admin'
  | 'dashboard:verifier'
  | 'dashboard:landlord'
  | 'dashboard:renter';

/**
 * Permission matrix defining which roles can perform which actions
 */
export const PERMISSIONS: Record<Permission, readonly UserRole[]> = {
  // Property permissions
  'property:create': ['landlord', 'admin'],
  'property:edit:own': ['landlord', 'admin'],
  'property:edit:any': ['admin'],
  'property:delete:own': ['landlord', 'admin'],
  'property:delete:any': ['admin'],
  'property:verify': ['admin', 'verifier'],
  'property:view:draft': ['landlord', 'admin', 'verifier'],
  'property:view:pending': ['landlord', 'admin', 'verifier'],

  // User permissions
  'user:manage': ['admin'],
  'user:view:all': ['admin'],
  'user:verify': ['admin', 'verifier'],
  'user:change-role': ['admin'],

  // Transaction permissions
  'transaction:view:own': ['renter', 'landlord'],
  'transaction:view:all': ['admin'],
  'transaction:manage': ['admin'],

  // Message permissions
  'message:send': ['renter', 'landlord', 'admin'],
  'message:view:own': ['renter', 'landlord', 'admin', 'verifier'],
  'message:view:all': ['admin'],

  // Dashboard permissions
  'dashboard:admin': ['admin'],
  'dashboard:verifier': ['admin', 'verifier'],
  'dashboard:landlord': ['landlord', 'admin'],
  'dashboard:renter': ['renter', 'landlord', 'admin'],
} as const;

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return PERMISSIONS[permission]?.includes(role) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole | undefined, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole | undefined, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return (Object.entries(PERMISSIONS) as [Permission, readonly UserRole[]][])
    .filter(([, roles]) => roles.includes(role))
    .map(([permission]) => permission);
}

/**
 * Role hierarchy - used to determine if a role can manage another role
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  renter: 0,
  landlord: 1,
  verifier: 2,
  admin: 3,
} as const;

/**
 * Check if one role can manage another role
 */
export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
}

/**
 * Get human-readable role labels
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  renter: 'Locataire',
  landlord: 'Propriétaire',
  verifier: 'Vérificateur',
  admin: 'Administrateur',
} as const;

/**
 * Get role badge colors for UI
 */
export const ROLE_COLORS: Record<UserRole, string> = {
  renter: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  landlord: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  verifier: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
} as const;
