import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Generate upload URL for file storage
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Get file URL from storage ID
export const getFileUrl = query({
  args: { storageId: v.id('_storage') },
  returns: v.union(v.null(), v.string()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Get multiple file URLs
export const getFileUrls = query({
  args: { storageIds: v.array(v.id('_storage')) },
  returns: v.array(v.object({ storageId: v.id('_storage'), url: v.union(v.null(), v.string()) })),
  handler: async (ctx, args) => {
    const urls = await Promise.all(
      args.storageIds.map(async (storageId) => {
        const url = await ctx.storage.getUrl(storageId);
        return { storageId, url };
      })
    );
    return urls;
  },
});

// Delete a file from storage
export const deleteFile = mutation({
  args: { storageId: v.id('_storage') },
  returns: v.id('_storage'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Look up the user
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    // Check if any of the user's properties references this file
    const properties =
      user.role === 'admin'
        ? await ctx.db.query('properties').collect()
        : await ctx.db
            .query('properties')
            .withIndex('by_landlord', (q) => q.eq('landlordId', user._id))
            .collect();
    const ownerProperty = properties.find((p) =>
      p.images?.some((img) => img.storageId === args.storageId)
    );

    if (ownerProperty) {
      // Verify the user owns the property or is admin
      if (ownerProperty.landlordId !== user._id && user.role !== 'admin') {
        throw new Error('Unauthorized: you do not own this file');
      }
    }

    await ctx.storage.delete(args.storageId);
    return args.storageId;
  },
});
