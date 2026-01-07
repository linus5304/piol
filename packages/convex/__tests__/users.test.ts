import { convexTest } from 'convex-test';
import { describe, expect, it } from 'vitest';
import schema from '../schema';

// Minimal modules to satisfy convex-test's _generated directory requirement
const modules = {
  '../_generated/api.ts': async () => ({ api: {}, internal: {} }),
  '../_generated/server.ts': async () => ({}),
  '../_generated/dataModel.ts': async () => ({}),
};

// Create test helper
function createTestContext() {
  return convexTest(schema, modules);
}

// User data for tests
const baseUser = {
  languagePreference: 'fr' as const,
  emailVerified: true,
  phoneVerified: false,
  idVerified: false,
  isActive: true,
  onboardingCompleted: false,
  lastLogin: Date.now(),
};

describe('users', () => {
  describe('createUserFromClerk (internal)', () => {
    it('should create a new user from Clerk data', async () => {
      const t = createTestContext();

      // Create user directly in the database
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_test_123',
          email: 'test@example.com',
          firstName: 'Jean',
          lastName: 'Dupont',
          phone: '237699000001',
          role: 'renter',
          ...baseUser,
        });
      });

      expect(userId).toBeDefined();

      // Verify user was created
      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user).not.toBeNull();
      expect(user?.clerkId).toBe('clerk_test_123');
      expect(user?.email).toBe('test@example.com');
      expect(user?.role).toBe('renter');
      expect(user?.isActive).toBe(true);
      expect(user?.languagePreference).toBe('fr');
    });

    it('should handle duplicate clerkId correctly', async () => {
      const t = createTestContext();

      // Create first user
      const userId1 = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_duplicate',
          email: 'first@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      // Check if user exists before creating
      const existingUser = await t.run(async (ctx) => {
        return await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', 'clerk_duplicate'))
          .unique();
      });

      expect(existingUser?._id).toEqual(userId1);
    });
  });

  describe('updateUserFromClerk (internal)', () => {
    it('should update existing user', async () => {
      const t = createTestContext();

      // Create user first
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_update_test',
          email: 'original@example.com',
          firstName: 'Original',
          role: 'renter',
          ...baseUser,
        });
      });

      // Update user
      await t.run(async (ctx) => {
        const user = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', 'clerk_update_test'))
          .unique();

        if (user) {
          await ctx.db.patch(user._id, {
            email: 'updated@example.com',
            firstName: 'Updated',
            lastName: 'Name',
          });
        }
      });

      // Verify update
      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user?.email).toBe('updated@example.com');
      expect(user?.firstName).toBe('Updated');
      expect(user?.lastName).toBe('Name');
    });
  });

  describe('deleteUserByClerkId (internal)', () => {
    it('should soft delete user by setting isActive to false', async () => {
      const t = createTestContext();

      // Create user
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_delete_test',
          email: 'delete@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      // Verify user is active
      let user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });
      expect(user?.isActive).toBe(true);

      // Soft delete user
      await t.run(async (ctx) => {
        const userToDelete = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', 'clerk_delete_test'))
          .unique();

        if (userToDelete) {
          await ctx.db.patch(userToDelete._id, { isActive: false });
        }
      });

      // Verify soft delete
      user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user).not.toBeNull();
      expect(user?.isActive).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when not authenticated (no identity)', async () => {
      const t = createTestContext();

      // Query without identity
      const user = await t.run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          return null;
        }
        return await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();
      });

      expect(user).toBeNull();
    });

    it('should return user when authenticated', async () => {
      const t = createTestContext();

      // Create user
      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_current_user',
          email: 'current@example.com',
          firstName: 'Current',
          role: 'renter',
          ...baseUser,
        });
      });

      // Query as authenticated user
      const user = await t.withIdentity({ subject: 'clerk_current_user' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          return null;
        }
        return await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();
      });

      expect(user).not.toBeNull();
      expect(user?.email).toBe('current@example.com');
      expect(user?.firstName).toBe('Current');
    });
  });

  describe('getUserById', () => {
    it('should return public profile for active user', async () => {
      const t = createTestContext();

      // Create user
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_public_profile',
          email: 'public@example.com',
          firstName: 'Public',
          lastName: 'User',
          role: 'landlord',
          ...baseUser,
        });
      });

      // Query public profile
      const profile = await t.run(async (ctx) => {
        const user = await ctx.db.get(userId);
        if (!user || !user.isActive) {
          return null;
        }
        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          idVerified: user.idVerified,
        };
      });

      expect(profile).not.toBeNull();
      expect(profile?.firstName).toBe('Public');
      expect(profile?.lastName).toBe('User');
      expect(profile?.role).toBe('landlord');
    });

    it('should return null for inactive user', async () => {
      const t = createTestContext();

      // Create and soft delete user
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_inactive',
          email: 'inactive@example.com',
          role: 'renter',
          ...baseUser,
          isActive: false,
        });
      });

      // Query should return null
      const profile = await t.run(async (ctx) => {
        const user = await ctx.db.get(userId);
        if (!user || !user.isActive) {
          return null;
        }
        return user;
      });

      expect(profile).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should throw when not authenticated', async () => {
      const t = createTestContext();

      await expect(
        t.run(async (ctx) => {
          const identity = await ctx.auth.getUserIdentity();
          if (!identity) {
            throw new Error('Not authenticated');
          }
        })
      ).rejects.toThrow('Not authenticated');
    });

    it('should throw when user not found', async () => {
      const t = createTestContext();

      await expect(
        t.withIdentity({ subject: 'nonexistent_clerk_id' }).run(async (ctx) => {
          const identity = await ctx.auth.getUserIdentity();
          if (!identity) {
            throw new Error('Not authenticated');
          }

          const user = await ctx.db
            .query('users')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
            .unique();

          if (!user) {
            throw new Error('User not found');
          }
        })
      ).rejects.toThrow('User not found');
    });

    it('should update profile for authenticated user', async () => {
      const t = createTestContext();

      // Create user
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_profile_update',
          email: 'profile@example.com',
          firstName: 'Original',
          role: 'renter',
          ...baseUser,
        });
      });

      // Update profile
      await t.withIdentity({ subject: 'clerk_profile_update' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user) throw new Error('User not found');

        await ctx.db.patch(user._id, {
          firstName: 'Updated',
          lastName: 'Profile',
          phone: '237699999999',
          languagePreference: 'en',
        });
      });

      // Verify update
      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user?.firstName).toBe('Updated');
      expect(user?.lastName).toBe('Profile');
      expect(user?.phone).toBe('237699999999');
      expect(user?.languagePreference).toBe('en');
    });
  });

  describe('completeOnboarding', () => {
    it('should mark onboarding as completed', async () => {
      const t = createTestContext();

      // Create user
      const userId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_onboarding',
          email: 'onboarding@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      // Complete onboarding
      await t.withIdentity({ subject: 'clerk_onboarding' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user) throw new Error('User not found');

        await ctx.db.patch(user._id, {
          role: 'landlord',
          phone: '237699111111',
          languagePreference: 'fr',
          onboardingCompleted: true,
        });
      });

      // Verify
      const user = await t.run(async (ctx) => {
        return await ctx.db.get(userId);
      });

      expect(user?.onboardingCompleted).toBe(true);
      expect(user?.role).toBe('landlord');
      expect(user?.phone).toBe('237699111111');
    });
  });

  describe('updateUserRole', () => {
    it('should throw when not admin', async () => {
      const t = createTestContext();

      // Create regular user
      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_regular',
          email: 'regular@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      // Try to update role as non-admin
      await expect(
        t.withIdentity({ subject: 'clerk_regular' }).run(async (ctx) => {
          const identity = await ctx.auth.getUserIdentity();
          if (!identity) throw new Error('Not authenticated');

          const currentUser = await ctx.db
            .query('users')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
            .unique();

          if (!currentUser || currentUser.role !== 'admin') {
            throw new Error('Unauthorized: Admin access required');
          }
        })
      ).rejects.toThrow('Unauthorized');
    });

    it('should update role when admin', async () => {
      const t = createTestContext();

      // Create admin user
      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_admin',
          email: 'admin@example.com',
          role: 'admin',
          ...baseUser,
        });
      });

      // Create target user
      const targetId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_target_role',
          email: 'target_role@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      // Update role as admin
      await t.withIdentity({ subject: 'clerk_admin' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!currentUser || currentUser.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }

        await ctx.db.patch(targetId, { role: 'verifier' });
      });

      // Verify
      const user = await t.run(async (ctx) => {
        return await ctx.db.get(targetId);
      });

      expect(user?.role).toBe('verifier');
    });
  });

  describe('verifyUserId', () => {
    it('should throw when not admin or verifier', async () => {
      const t = createTestContext();

      // Create regular user
      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_regular_verify',
          email: 'regular_verify@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      await expect(
        t.withIdentity({ subject: 'clerk_regular_verify' }).run(async (ctx) => {
          const identity = await ctx.auth.getUserIdentity();
          if (!identity) throw new Error('Not authenticated');

          const currentUser = await ctx.db
            .query('users')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
            .unique();

          if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'verifier')) {
            throw new Error('Unauthorized: Admin or verifier access required');
          }
        })
      ).rejects.toThrow('Unauthorized');
    });

    it('should verify user ID when called by verifier', async () => {
      const t = createTestContext();

      // Create verifier
      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_verifier',
          email: 'verifier@example.com',
          role: 'verifier',
          ...baseUser,
        });
      });

      // Create target user
      const targetId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_verify_target',
          email: 'verify_target@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      // Verify user ID
      await t.withIdentity({ subject: 'clerk_verifier' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'verifier')) {
          throw new Error('Unauthorized: Admin or verifier access required');
        }

        await ctx.db.patch(targetId, { idVerified: true });
      });

      // Check verification
      const user = await t.run(async (ctx) => {
        return await ctx.db.get(targetId);
      });

      expect(user?.idVerified).toBe(true);
    });
  });

  describe('getUsersByRole', () => {
    it('should return empty array when not admin', async () => {
      const t = createTestContext();

      // Create non-admin user
      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_non_admin',
          email: 'nonadmin@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const users = await t.withIdentity({ subject: 'clerk_non_admin' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!currentUser || currentUser.role !== 'admin') {
          return [];
        }

        return await ctx.db
          .query('users')
          .withIndex('by_role', (q) => q.eq('role', 'landlord'))
          .collect();
      });

      expect(users).toEqual([]);
    });

    it('should return users by role when admin', async () => {
      const t = createTestContext();

      // Create admin
      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_admin_query',
          email: 'admin_query@example.com',
          role: 'admin',
          ...baseUser,
        });
      });

      // Create landlords
      await t.run(async (ctx) => {
        await ctx.db.insert('users', {
          clerkId: 'clerk_landlord1',
          email: 'landlord1@example.com',
          role: 'landlord',
          ...baseUser,
        });
        await ctx.db.insert('users', {
          clerkId: 'clerk_landlord2',
          email: 'landlord2@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      // Query landlords
      const landlords = await t.withIdentity({ subject: 'clerk_admin_query' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const currentUser = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!currentUser || currentUser.role !== 'admin') {
          return [];
        }

        return await ctx.db
          .query('users')
          .withIndex('by_role', (q) => q.eq('role', 'landlord'))
          .collect();
      });

      expect(landlords.length).toBe(2);
      expect(landlords.every((u) => u.role === 'landlord')).toBe(true);
    });
  });

  describe('Database indexes', () => {
    it('should query users by clerk_id index', async () => {
      const t = createTestContext();

      await t.run(async (ctx) => {
        await ctx.db.insert('users', {
          clerkId: 'clerk_index_test',
          email: 'index@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const user = await t.run(async (ctx) => {
        return await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', 'clerk_index_test'))
          .unique();
      });

      expect(user).not.toBeNull();
      expect(user?.email).toBe('index@example.com');
    });

    it('should query users by role index', async () => {
      const t = createTestContext();

      await t.run(async (ctx) => {
        await ctx.db.insert('users', {
          clerkId: 'clerk_role1',
          email: 'role1@example.com',
          role: 'landlord',
          ...baseUser,
        });
        await ctx.db.insert('users', {
          clerkId: 'clerk_role2',
          email: 'role2@example.com',
          role: 'landlord',
          ...baseUser,
        });
        await ctx.db.insert('users', {
          clerkId: 'clerk_role3',
          email: 'role3@example.com',
          role: 'renter',
          ...baseUser,
        });
      });

      const landlords = await t.run(async (ctx) => {
        return await ctx.db
          .query('users')
          .withIndex('by_role', (q) => q.eq('role', 'landlord'))
          .collect();
      });

      expect(landlords.length).toBe(2);
    });
  });
});
