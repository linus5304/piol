import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Get user's saved properties (favorites)
export const getSavedProperties = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    const savedItems = await ctx.db
      .query('savedProperties')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    // Get property details for each saved item
    const savedPropertiesWithDetails = await Promise.all(
      savedItems.map(async (saved) => {
        const property = await ctx.db.get(saved.propertyId);
        if (!property) {
          return null;
        }

        const landlord = await ctx.db.get(property.landlordId);

        return {
          ...saved,
          property: {
            ...property,
            landlord: landlord
              ? {
                  _id: landlord._id,
                  firstName: landlord.firstName,
                  lastName: landlord.lastName,
                  idVerified: landlord.idVerified,
                }
              : null,
          },
        };
      })
    );

    // Filter out nulls (deleted properties) and sort by save time
    return savedPropertiesWithDetails
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Check if property is saved
export const isPropertySaved = query({
  args: { propertyId: v.id('properties') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return false;
    }

    const saved = await ctx.db
      .query('savedProperties')
      .withIndex('by_user_property', (q) =>
        q.eq('userId', user._id).eq('propertyId', args.propertyId)
      )
      .unique();

    return saved !== null;
  },
});

// Save a property (add to favorites)
export const saveProperty = mutation({
  args: { propertyId: v.id('properties') },
  handler: async (ctx, args) => {
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

    // Check if already saved
    const existing = await ctx.db
      .query('savedProperties')
      .withIndex('by_user_property', (q) =>
        q.eq('userId', user._id).eq('propertyId', args.propertyId)
      )
      .unique();

    if (existing) {
      return existing._id;
    }

    // Verify property exists
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    const savedId = await ctx.db.insert('savedProperties', {
      userId: user._id,
      propertyId: args.propertyId,
    });

    return savedId;
  },
});

// Unsave a property (remove from favorites)
export const unsaveProperty = mutation({
  args: { propertyId: v.id('properties') },
  handler: async (ctx, args) => {
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

    const saved = await ctx.db
      .query('savedProperties')
      .withIndex('by_user_property', (q) =>
        q.eq('userId', user._id).eq('propertyId', args.propertyId)
      )
      .unique();

    if (saved) {
      await ctx.db.delete(saved._id);
    }

    return args.propertyId;
  },
});

// Toggle save status
export const toggleSaveProperty = mutation({
  args: { propertyId: v.id('properties') },
  handler: async (ctx, args) => {
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

    const saved = await ctx.db
      .query('savedProperties')
      .withIndex('by_user_property', (q) =>
        q.eq('userId', user._id).eq('propertyId', args.propertyId)
      )
      .unique();

    if (saved) {
      await ctx.db.delete(saved._id);
      return { saved: false };
    }

    await ctx.db.insert('savedProperties', {
      userId: user._id,
      propertyId: args.propertyId,
    });
    return { saved: true };
  },
});
