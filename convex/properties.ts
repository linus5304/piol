import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Property type definition for reuse
const propertyTypeValidator = v.union(
  v.literal('studio'),
  v.literal('1br'),
  v.literal('2br'),
  v.literal('3br'),
  v.literal('4br'),
  v.literal('house'),
  v.literal('apartment'),
  v.literal('villa')
);

const amenitiesValidator = v.optional(
  v.object({
    wifi: v.optional(v.boolean()),
    parking: v.optional(v.boolean()),
    ac: v.optional(v.boolean()),
    security: v.optional(v.boolean()),
    water247: v.optional(v.boolean()),
    electricity247: v.optional(v.boolean()),
    furnished: v.optional(v.boolean()),
    balcony: v.optional(v.boolean()),
    garden: v.optional(v.boolean()),
  })
);

// List active properties with filters
export const listProperties = query({
  args: {
    city: v.optional(v.string()),
    propertyType: v.optional(propertyTypeValidator),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    let propertiesQuery = ctx.db.query('properties');

    // Filter by city and status
    if (args.city) {
      propertiesQuery = propertiesQuery.withIndex('by_city_status', (q) =>
        q.eq('city', args.city).eq('status', 'active')
      );
    } else {
      propertiesQuery = propertiesQuery.withIndex('by_status', (q) => q.eq('status', 'active'));
    }

    let properties = await propertiesQuery.collect();

    // Apply additional filters
    if (args.propertyType) {
      properties = properties.filter((p) => p.propertyType === args.propertyType);
    }
    if (args.minPrice !== undefined) {
      properties = properties.filter((p) => p.rentAmount >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      properties = properties.filter((p) => p.rentAmount <= args.maxPrice!);
    }

    // Sort by creation time (newest first)
    properties.sort((a, b) => b._creationTime - a._creationTime);

    // Pagination
    const startIndex = args.cursor ? Number.parseInt(args.cursor, 10) : 0;
    const paginatedProperties = properties.slice(startIndex, startIndex + limit);

    // Get landlord info for each property
    const propertiesWithLandlord = await Promise.all(
      paginatedProperties.map(async (property) => {
        const landlord = await ctx.db.get(property.landlordId);
        return {
          ...property,
          landlord: landlord
            ? {
                _id: landlord._id,
                firstName: landlord.firstName,
                lastName: landlord.lastName,
                idVerified: landlord.idVerified,
              }
            : null,
        };
      })
    );

    return {
      properties: propertiesWithLandlord,
      nextCursor: startIndex + limit < properties.length ? String(startIndex + limit) : null,
      total: properties.length,
    };
  },
});

// Search properties with full-text search
export const searchProperties = query({
  args: {
    searchQuery: v.string(),
    city: v.optional(v.string()),
    propertyType: v.optional(propertyTypeValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const searchResults = await ctx.db
      .query('properties')
      .withSearchIndex('search_properties', (q) => {
        let search = q.search('searchText', args.searchQuery);
        if (args.city) {
          search = search.eq('city', args.city);
        }
        search = search.eq('status', 'active');
        if (args.propertyType) {
          search = search.eq('propertyType', args.propertyType);
        }
        return search;
      })
      .take(limit);

    // Get landlord info for each property
    const propertiesWithLandlord = await Promise.all(
      searchResults.map(async (property) => {
        const landlord = await ctx.db.get(property.landlordId);
        return {
          ...property,
          landlord: landlord
            ? {
                _id: landlord._id,
                firstName: landlord.firstName,
                lastName: landlord.lastName,
                idVerified: landlord.idVerified,
              }
            : null,
        };
      })
    );

    return propertiesWithLandlord;
  },
});

// Get single property by ID
export const getProperty = query({
  args: { propertyId: v.id('properties') },
  handler: async (ctx, args) => {
    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      return null;
    }

    const landlord = await ctx.db.get(property.landlordId);

    // Get reviews for this property
    const reviews = await ctx.db
      .query('reviews')
      .withIndex('by_property', (q) => q.eq('propertyId', args.propertyId))
      .collect();

    // Calculate average rating
    const avgRating =
      reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

    return {
      ...property,
      landlord: landlord
        ? {
            _id: landlord._id,
            firstName: landlord.firstName,
            lastName: landlord.lastName,
            idVerified: landlord.idVerified,
            profileImageId: landlord.profileImageId,
          }
        : null,
      reviews: {
        count: reviews.length,
        averageRating: avgRating,
      },
    };
  },
});

// Get properties by landlord
export const getMyProperties = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      return [];
    }

    const properties = await ctx.db
      .query('properties')
      .withIndex('by_landlord', (q) => q.eq('landlordId', user._id))
      .collect();

    return properties.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Create a new property listing
export const createProperty = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    propertyType: propertyTypeValidator,
    rentAmount: v.number(),
    currency: v.optional(v.string()),
    cautionMonths: v.optional(v.number()),
    upfrontMonths: v.optional(v.number()),
    location: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      })
    ),
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.string(),
    neighborhood: v.optional(v.string()),
    amenities: amenitiesValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'landlord' && user.role !== 'admin') {
      throw new Error('Only landlords can create property listings');
    }

    // Create searchable text
    const searchText = [
      args.title,
      args.description,
      args.city,
      args.neighborhood,
      args.addressLine1,
      args.propertyType,
    ]
      .filter(Boolean)
      .join(' ');

    const propertyId = await ctx.db.insert('properties', {
      landlordId: user._id,
      title: args.title,
      description: args.description,
      propertyType: args.propertyType,
      rentAmount: args.rentAmount,
      currency: args.currency ?? 'XAF',
      cautionMonths: args.cautionMonths ?? 2,
      upfrontMonths: args.upfrontMonths ?? 6,
      location: args.location,
      addressLine1: args.addressLine1,
      addressLine2: args.addressLine2,
      city: args.city,
      neighborhood: args.neighborhood,
      amenities: args.amenities,
      status: 'draft',
      verificationStatus: 'pending',
      searchText,
    });

    return propertyId;
  },
});

// Update property listing
export const updateProperty = mutation({
  args: {
    propertyId: v.id('properties'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    propertyType: v.optional(propertyTypeValidator),
    rentAmount: v.optional(v.number()),
    location: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      })
    ),
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    amenities: amenitiesValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // Check ownership
    if (property.landlordId !== user._id && user.role !== 'admin') {
      throw new Error('Unauthorized: You can only update your own properties');
    }

    // Build update object
    const updates: Record<string, unknown> = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.propertyType !== undefined) updates.propertyType = args.propertyType;
    if (args.rentAmount !== undefined) updates.rentAmount = args.rentAmount;
    if (args.location !== undefined) updates.location = args.location;
    if (args.addressLine1 !== undefined) updates.addressLine1 = args.addressLine1;
    if (args.addressLine2 !== undefined) updates.addressLine2 = args.addressLine2;
    if (args.neighborhood !== undefined) updates.neighborhood = args.neighborhood;
    if (args.amenities !== undefined) updates.amenities = args.amenities;

    // Update search text
    const newTitle = args.title ?? property.title;
    const newDescription = args.description ?? property.description;
    const newNeighborhood = args.neighborhood ?? property.neighborhood;
    const newPropertyType = args.propertyType ?? property.propertyType;

    updates.searchText = [
      newTitle,
      newDescription,
      property.city,
      newNeighborhood,
      args.addressLine1 ?? property.addressLine1,
      newPropertyType,
    ]
      .filter(Boolean)
      .join(' ');

    await ctx.db.patch(args.propertyId, updates);
    return args.propertyId;
  },
});

// Add images to property
export const addPropertyImages = mutation({
  args: {
    propertyId: v.id('properties'),
    images: v.array(
      v.object({
        storageId: v.id('_storage'),
        order: v.number(),
        caption: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    if (property.landlordId !== user._id && user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const existingImages = property.images ?? [];
    const newImages = [...existingImages, ...args.images];

    await ctx.db.patch(args.propertyId, { images: newImages });
    return args.propertyId;
  },
});

// Submit property for verification
export const submitForVerification = mutation({
  args: { propertyId: v.id('properties') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    if (property.landlordId !== user._id) {
      throw new Error('Unauthorized');
    }

    if (property.status !== 'draft') {
      throw new Error('Property can only be submitted from draft status');
    }

    await ctx.db.patch(args.propertyId, {
      status: 'pending_verification',
      verificationStatus: 'pending',
    });

    return args.propertyId;
  },
});

// Update property status (admin/verifier only)
export const updatePropertyStatus = mutation({
  args: {
    propertyId: v.id('properties'),
    status: v.union(
      v.literal('draft'),
      v.literal('pending_verification'),
      v.literal('verified'),
      v.literal('active'),
      v.literal('rented'),
      v.literal('archived')
    ),
    verificationStatus: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('in_progress'),
        v.literal('approved'),
        v.literal('rejected')
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user || (user.role !== 'admin' && user.role !== 'verifier')) {
      throw new Error('Unauthorized');
    }

    const updates: Record<string, unknown> = { status: args.status };

    if (args.verificationStatus) {
      updates.verificationStatus = args.verificationStatus;
    }

    if (args.verificationStatus === 'approved') {
      updates.verifiedAt = Date.now();
      updates.verifierId = user._id;
    }

    if (args.status === 'active') {
      updates.publishedAt = Date.now();
    }

    await ctx.db.patch(args.propertyId, updates);
    return args.propertyId;
  },
});

// Delete property (soft delete - archive)
export const archiveProperty = mutation({
  args: { propertyId: v.id('properties') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    if (property.landlordId !== user._id && user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.propertyId, { status: 'archived' });
    return args.propertyId;
  },
});
