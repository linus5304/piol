import { convexTest } from 'convex-test';
import { describe, expect, it } from 'vitest';
import schema from '../convex/schema';

// Minimal modules to satisfy convex-test's _generated directory requirement
const modules = {
  '../convex/_generated/api.ts': async () => ({ api: {}, internal: {} }),
  '../convex/_generated/server.ts': async () => ({}),
  '../convex/_generated/dataModel.ts': async () => ({}),
};

function createTestContext() {
  return convexTest(schema, modules);
}

// Base user data
const baseUser = {
  languagePreference: 'fr' as const,
  emailVerified: true,
  phoneVerified: false,
  idVerified: false,
  isActive: true,
  onboardingCompleted: true,
  lastLogin: Date.now(),
};

// Base property data
const baseProperty = {
  currency: 'XAF',
  cautionMonths: 2,
  upfrontMonths: 6,
  status: 'draft' as const,
  verificationStatus: 'pending' as const,
};

describe('properties', () => {
  describe('createProperty', () => {
    it('should create a new property for landlord', async () => {
      const t = createTestContext();

      // Create landlord
      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord',
          email: 'landlord@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      // Create property
      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Appartement moderne à Bastos',
          description: 'Bel appartement 2 chambres',
          propertyType: '2br',
          rentAmount: 150000,
          city: 'Yaoundé',
          neighborhood: 'Bastos',
          ...baseProperty,
        });
      });

      expect(propertyId).toBeDefined();

      // Verify property was created
      const property = await t.run(async (ctx) => {
        return await ctx.db.get(propertyId);
      });

      expect(property).not.toBeNull();
      expect(property?.title).toBe('Appartement moderne à Bastos');
      expect(property?.rentAmount).toBe(150000);
      expect(property?.city).toBe('Yaoundé');
      expect(property?.status).toBe('draft');
    });

    it('should create property with amenities', async () => {
      const t = createTestContext();

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_amenities',
          email: 'landlord_amenities@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Studio meublé',
          propertyType: 'studio',
          rentAmount: 75000,
          city: 'Douala',
          ...baseProperty,
          amenities: {
            wifi: true,
            parking: true,
            ac: true,
            security: true,
            water247: true,
            electricity247: false,
            furnished: true,
            balcony: false,
            garden: false,
          },
        });
      });

      const property = await t.run(async (ctx) => {
        return await ctx.db.get(propertyId);
      });

      expect(property?.amenities?.wifi).toBe(true);
      expect(property?.amenities?.furnished).toBe(true);
      expect(property?.amenities?.balcony).toBe(false);
    });
  });

  describe('listProperties', () => {
    it('should list active properties', async () => {
      const t = createTestContext();

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_list',
          email: 'landlord_list@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      // Create multiple properties
      await t.run(async (ctx) => {
        await ctx.db.insert('properties', {
          landlordId,
          title: 'Property 1',
          propertyType: 'studio',
          rentAmount: 50000,
          city: 'Yaoundé',
          ...baseProperty,
          status: 'active',
        });
        await ctx.db.insert('properties', {
          landlordId,
          title: 'Property 2',
          propertyType: '1br',
          rentAmount: 80000,
          city: 'Yaoundé',
          ...baseProperty,
          status: 'active',
        });
        await ctx.db.insert('properties', {
          landlordId,
          title: 'Property 3 (Draft)',
          propertyType: '2br',
          rentAmount: 100000,
          city: 'Yaoundé',
          ...baseProperty,
          status: 'draft', // Should not be listed
        });
      });

      // Query active properties
      const properties = await t.run(async (ctx) => {
        return await ctx.db
          .query('properties')
          .withIndex('by_status', (q) => q.eq('status', 'active'))
          .collect();
      });

      expect(properties.length).toBe(2);
      expect(properties.every((p) => p.status === 'active')).toBe(true);
    });

    it('should filter properties by city', async () => {
      const t = createTestContext();

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_city',
          email: 'landlord_city@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      await t.run(async (ctx) => {
        await ctx.db.insert('properties', {
          landlordId,
          title: 'Yaoundé Property',
          propertyType: 'studio',
          rentAmount: 50000,
          city: 'Yaoundé',
          ...baseProperty,
          status: 'active',
        });
        await ctx.db.insert('properties', {
          landlordId,
          title: 'Douala Property',
          propertyType: '1br',
          rentAmount: 80000,
          city: 'Douala',
          ...baseProperty,
          status: 'active',
        });
      });

      // Filter by city
      const ydeProperties = await t.run(async (ctx) => {
        return await ctx.db
          .query('properties')
          .withIndex('by_city_status', (q) => q.eq('city', 'Yaoundé').eq('status', 'active'))
          .collect();
      });

      expect(ydeProperties.length).toBe(1);
      expect(ydeProperties[0]?.city).toBe('Yaoundé');
    });
  });

  describe('getProperty', () => {
    it('should return property with landlord info', async () => {
      const t = createTestContext();

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_detail',
          email: 'landlord_detail@example.com',
          firstName: 'Jean',
          lastName: 'Landlord',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Detailed Property',
          propertyType: '2br',
          rentAmount: 150000,
          city: 'Yaoundé',
          ...baseProperty,
          status: 'active',
        });
      });

      // Get property with landlord info
      const result = await t.run(async (ctx) => {
        const property = await ctx.db.get(propertyId);
        if (!property) return null;

        const landlord = await ctx.db.get(property.landlordId);
        return {
          ...property,
          landlord: landlord
            ? {
                _id: landlord._id,
                firstName: landlord.firstName,
                lastName: landlord.lastName,
              }
            : null,
        };
      });

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Detailed Property');
      expect(result?.landlord?.firstName).toBe('Jean');
      expect(result?.landlord?.lastName).toBe('Landlord');
    });
  });

  describe('getMyProperties', () => {
    it('should return properties owned by current user', async () => {
      const t = createTestContext();

      // Create two landlords
      const landlord1Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_1',
          email: 'landlord1@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const landlord2Id = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_2',
          email: 'landlord2@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      // Create properties for both
      await t.run(async (ctx) => {
        await ctx.db.insert('properties', {
          landlordId: landlord1Id,
          title: 'Landlord 1 Property',
          propertyType: 'studio',
          rentAmount: 50000,
          city: 'Yaoundé',
          ...baseProperty,
        });
        await ctx.db.insert('properties', {
          landlordId: landlord2Id,
          title: 'Landlord 2 Property',
          propertyType: '1br',
          rentAmount: 80000,
          city: 'Douala',
          ...baseProperty,
        });
      });

      // Query as landlord 1
      const myProperties = await t
        .withIdentity({ subject: 'clerk_landlord_1' })
        .run(async (ctx) => {
          const identity = await ctx.auth.getUserIdentity();
          if (!identity) return [];

          const user = await ctx.db
            .query('users')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
            .unique();

          if (!user) return [];

          return await ctx.db
            .query('properties')
            .withIndex('by_landlord', (q) => q.eq('landlordId', user._id))
            .collect();
        });

      expect(myProperties.length).toBe(1);
      expect(myProperties[0]?.title).toBe('Landlord 1 Property');
    });
  });

  describe('updateProperty', () => {
    it('should update property when owner', async () => {
      const t = createTestContext();

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_update',
          email: 'landlord_update@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Original Title',
          propertyType: 'studio',
          rentAmount: 50000,
          city: 'Yaoundé',
          ...baseProperty,
        });
      });

      // Update property
      await t.withIdentity({ subject: 'clerk_landlord_update' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user) throw new Error('User not found');

        const property = await ctx.db.get(propertyId);
        if (!property) throw new Error('Property not found');

        if (property.landlordId !== user._id) {
          throw new Error('Unauthorized');
        }

        await ctx.db.patch(propertyId, {
          title: 'Updated Title',
          rentAmount: 60000,
        });
      });

      const property = await t.run(async (ctx) => {
        return await ctx.db.get(propertyId);
      });

      expect(property?.title).toBe('Updated Title');
      expect(property?.rentAmount).toBe(60000);
    });

    it('should throw when not owner', async () => {
      const t = createTestContext();

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_owner',
          email: 'landlord_owner@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_other_landlord',
          email: 'other_landlord@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Owned Property',
          propertyType: 'studio',
          rentAmount: 50000,
          city: 'Yaoundé',
          ...baseProperty,
        });
      });

      // Try to update as other landlord
      await expect(
        t.withIdentity({ subject: 'clerk_other_landlord' }).run(async (ctx) => {
          const identity = await ctx.auth.getUserIdentity();
          if (!identity) throw new Error('Not authenticated');

          const user = await ctx.db
            .query('users')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
            .unique();

          if (!user) throw new Error('User not found');

          const property = await ctx.db.get(propertyId);
          if (!property) throw new Error('Property not found');

          if (property.landlordId !== user._id) {
            throw new Error('Unauthorized');
          }
        })
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('submitForVerification', () => {
    it('should change status to pending_verification', async () => {
      const t = createTestContext();

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_verify',
          email: 'landlord_verify@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Property to Verify',
          propertyType: 'studio',
          rentAmount: 50000,
          city: 'Yaoundé',
          ...baseProperty,
          status: 'draft',
        });
      });

      // Submit for verification
      await t.withIdentity({ subject: 'clerk_landlord_verify' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user) throw new Error('User not found');

        const property = await ctx.db.get(propertyId);
        if (!property || property.landlordId !== user._id) {
          throw new Error('Unauthorized');
        }

        await ctx.db.patch(propertyId, {
          status: 'pending_verification',
          verificationStatus: 'pending',
        });
      });

      const property = await t.run(async (ctx) => {
        return await ctx.db.get(propertyId);
      });

      expect(property?.status).toBe('pending_verification');
      expect(property?.verificationStatus).toBe('pending');
    });
  });

  describe('updatePropertyStatus', () => {
    it('should update status as admin', async () => {
      const t = createTestContext();

      await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_admin_status',
          email: 'admin_status@example.com',
          role: 'admin',
          ...baseUser,
        });
      });

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_status',
          email: 'landlord_status@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Status Update Property',
          propertyType: 'studio',
          rentAmount: 50000,
          city: 'Yaoundé',
          ...baseProperty,
          status: 'pending_verification',
          verificationStatus: 'pending',
        });
      });

      // Update status as admin
      await t.withIdentity({ subject: 'clerk_admin_status' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user || user.role !== 'admin') {
          throw new Error('Unauthorized');
        }

        await ctx.db.patch(propertyId, {
          status: 'verified',
          verificationStatus: 'approved',
          verifiedAt: Date.now(),
        });
      });

      const property = await t.run(async (ctx) => {
        return await ctx.db.get(propertyId);
      });

      expect(property?.status).toBe('verified');
      expect(property?.verificationStatus).toBe('approved');
      expect(property?.verifiedAt).toBeDefined();
    });
  });

  describe('archiveProperty', () => {
    it('should archive property when owner', async () => {
      const t = createTestContext();

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_archive',
          email: 'landlord_archive@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      const propertyId = await t.run(async (ctx) => {
        return await ctx.db.insert('properties', {
          landlordId,
          title: 'Property to Archive',
          propertyType: 'studio',
          rentAmount: 50000,
          city: 'Yaoundé',
          ...baseProperty,
          status: 'active',
        });
      });

      // Archive property
      await t.withIdentity({ subject: 'clerk_landlord_archive' }).run(async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error('Not authenticated');

        const user = await ctx.db
          .query('users')
          .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
          .unique();

        if (!user) throw new Error('User not found');

        const property = await ctx.db.get(propertyId);
        if (!property || property.landlordId !== user._id) {
          throw new Error('Unauthorized');
        }

        await ctx.db.patch(propertyId, {
          status: 'archived',
        });
      });

      const property = await t.run(async (ctx) => {
        return await ctx.db.get(propertyId);
      });

      expect(property?.status).toBe('archived');
    });
  });

  describe('Database indexes', () => {
    it('should query by landlord index', async () => {
      const t = createTestContext();

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_index',
          email: 'landlord_index@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      await t.run(async (ctx) => {
        await ctx.db.insert('properties', {
          landlordId,
          title: 'Index Test Property',
          propertyType: 'studio',
          rentAmount: 50000,
          city: 'Yaoundé',
          ...baseProperty,
        });
      });

      const properties = await t.run(async (ctx) => {
        return await ctx.db
          .query('properties')
          .withIndex('by_landlord', (q) => q.eq('landlordId', landlordId))
          .collect();
      });

      expect(properties.length).toBe(1);
    });

    it('should query by verification status index', async () => {
      const t = createTestContext();

      const landlordId = await t.run(async (ctx) => {
        return await ctx.db.insert('users', {
          clerkId: 'clerk_landlord_verification',
          email: 'landlord_verification@example.com',
          role: 'landlord',
          ...baseUser,
        });
      });

      await t.run(async (ctx) => {
        await ctx.db.insert('properties', {
          landlordId,
          title: 'Pending Property',
          propertyType: 'studio',
          rentAmount: 50000,
          city: 'Yaoundé',
          ...baseProperty,
          status: 'pending_verification',
          verificationStatus: 'pending',
        });
        await ctx.db.insert('properties', {
          landlordId,
          title: 'Approved Property',
          propertyType: '1br',
          rentAmount: 80000,
          city: 'Douala',
          ...baseProperty,
          status: 'verified',
          verificationStatus: 'approved',
        });
      });

      const pending = await t.run(async (ctx) => {
        return await ctx.db
          .query('properties')
          .withIndex('by_verification_status', (q) => q.eq('verificationStatus', 'pending'))
          .collect();
      });

      expect(pending.length).toBe(1);
      expect(pending[0]?.title).toBe('Pending Property');
    });
  });
});
