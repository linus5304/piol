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

// List active properties with advanced filters
export const listProperties = query({
  args: {
    city: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    propertyType: v.optional(propertyTypeValidator),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    amenities: v.optional(v.array(v.string())),
    verifiedOnly: v.optional(v.boolean()),
    sortBy: v.optional(
      v.union(
        v.literal('price_asc'),
        v.literal('price_desc'),
        v.literal('newest'),
        v.literal('oldest')
      )
    ),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    // Filter by city and status
    const propertiesQuery = args.city
      ? ctx.db
          .query('properties')
          .withIndex('by_city_status', (q) => q.eq('city', args.city).eq('status', 'active'))
      : ctx.db.query('properties').withIndex('by_status', (q) => q.eq('status', 'active'));

    let properties = await propertiesQuery.collect();

    // Apply additional filters
    if (args.propertyType) {
      properties = properties.filter((p) => p.propertyType === args.propertyType);
    }
    if (args.neighborhood) {
      properties = properties.filter((p) =>
        p.neighborhood?.toLowerCase().includes(args.neighborhood!.toLowerCase())
      );
    }
    if (args.minPrice !== undefined) {
      properties = properties.filter((p) => p.rentAmount >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      properties = properties.filter((p) => p.rentAmount <= args.maxPrice!);
    }
    if (args.verifiedOnly) {
      properties = properties.filter((p) => p.verificationStatus === 'approved');
    }

    // Filter by amenities
    if (args.amenities && args.amenities.length > 0) {
      properties = properties.filter((p) => {
        if (!p.amenities) return false;
        const propAmenities = p.amenities as Record<string, boolean>;
        return args.amenities!.every((amenity) => propAmenities[amenity] === true);
      });
    }

    // Apply sorting
    const sortBy = args.sortBy ?? 'newest';
    switch (sortBy) {
      case 'price_asc':
        properties.sort((a, b) => a.rentAmount - b.rentAmount);
        break;
      case 'price_desc':
        properties.sort((a, b) => b.rentAmount - a.rentAmount);
        break;
      case 'oldest':
        properties.sort((a, b) => a._creationTime - b._creationTime);
        break;
      default:
        properties.sort((a, b) => b._creationTime - a._creationTime);
        break;
    }

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

// Get search suggestions (cities and neighborhoods)
export const getSearchSuggestions = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.query.length < 2) {
      return { cities: [], neighborhoods: [] };
    }

    const limit = args.limit ?? 5;
    const queryLower = args.query.toLowerCase();

    // Get all active properties
    const properties = await ctx.db
      .query('properties')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();

    // Extract unique cities and neighborhoods
    const cityCounts = new Map<string, number>();
    const neighborhoodCounts = new Map<string, { city: string; count: number }>();

    for (const property of properties) {
      // Count cities
      const city = property.city;
      if (city.toLowerCase().includes(queryLower)) {
        cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
      }

      // Count neighborhoods
      if (property.neighborhood) {
        const neighborhood = property.neighborhood;
        if (neighborhood.toLowerCase().includes(queryLower)) {
          const existing = neighborhoodCounts.get(neighborhood);
          neighborhoodCounts.set(neighborhood, {
            city: property.city,
            count: (existing?.count ?? 0) + 1,
          });
        }
      }
    }

    // Convert to arrays and sort by count
    const cities = Array.from(cityCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    const neighborhoods = Array.from(neighborhoodCounts.entries())
      .map(([name, data]) => ({ name, city: data.city, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return { cities, neighborhoods };
  },
});

// Get available filter options based on current properties
export const getFilterOptions = query({
  args: {
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const propertiesQuery = args.city
      ? ctx.db
          .query('properties')
          .withIndex('by_city_status', (q) => q.eq('city', args.city).eq('status', 'active'))
      : ctx.db.query('properties').withIndex('by_status', (q) => q.eq('status', 'active'));

    const properties = await propertiesQuery.collect();

    // Extract unique values
    const cities = [...new Set(properties.map((p) => p.city))].sort();
    const neighborhoods = [
      ...new Set(properties.filter((p) => p.neighborhood).map((p) => p.neighborhood!)),
    ].sort();
    const propertyTypes = [...new Set(properties.map((p) => p.propertyType))];

    // Get price range
    const prices = properties.map((p) => p.rentAmount);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    // Count amenities
    const amenityCounts = new Map<string, number>();
    for (const property of properties) {
      if (property.amenities) {
        const propAmenities = property.amenities as Record<string, boolean>;
        for (const [key, value] of Object.entries(propAmenities)) {
          if (value) {
            amenityCounts.set(key, (amenityCounts.get(key) ?? 0) + 1);
          }
        }
      }
    }

    const amenities = Array.from(amenityCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      cities,
      neighborhoods,
      propertyTypes,
      priceRange: { min: minPrice, max: maxPrice },
      amenities,
      totalCount: properties.length,
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

    // Check if user has permission to view non-active properties
    const identity = await ctx.auth.getUserIdentity();
    const publicStatuses = ['active', 'verified'];

    if (!publicStatuses.includes(property.status)) {
      // Property is not public - check authorization
      if (!identity) {
        return null; // Not authenticated, can't view draft/archived properties
      }

      const user = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .unique();

      if (!user) {
        return null;
      }

      // Allow access if: owner, admin, or verifier
      const isOwner = property.landlordId === user._id;
      const isAdminOrVerifier = user.role === 'admin' || user.role === 'verifier';

      if (!isOwner && !isAdminOrVerifier) {
        return null; // Not authorized to view this property
      }
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

    // Resolve image URLs from storage
    const imageUrls = property.images
      ? await Promise.all(
          property.images.map(async (image) => {
            const url = await ctx.storage.getUrl(image.storageId);
            return {
              url,
              order: image.order,
              caption: image.caption,
              storageId: image.storageId,
            };
          })
        )
      : [];

    // Sort images by order
    const sortedImages = imageUrls.sort((a, b) => a.order - b.order);

    // Resolve landlord profile image URL
    const landlordProfileImageUrl = landlord?.profileImageId
      ? await ctx.storage.getUrl(landlord.profileImageId)
      : null;

    return {
      ...property,
      imageUrls: sortedImages,
      landlord: landlord
        ? {
            _id: landlord._id,
            firstName: landlord.firstName,
            lastName: landlord.lastName,
            idVerified: landlord.idVerified,
            profileImageUrl: landlordProfileImageUrl,
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
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
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
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
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
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
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
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
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
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
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
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
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
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
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

// Get featured properties for home page (public)
export const getFeaturedProperties = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;

    // Get active, verified properties
    const properties = await ctx.db
      .query('properties')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();

    // Filter for verified properties and sort by newest
    const verifiedProperties = properties
      .filter((p) => p.verificationStatus === 'approved')
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, limit);

    // Get landlord info and resolve image URLs
    const propertiesWithDetails = await Promise.all(
      verifiedProperties.map(async (property) => {
        const landlord = await ctx.db.get(property.landlordId);

        // Resolve image URLs
        const imageUrls = property.images
          ? await Promise.all(
              property.images.map(async (image) => {
                const url = await ctx.storage.getUrl(image.storageId);
                return { url, order: image.order };
              })
            )
          : [];

        const sortedImages = imageUrls.filter((img) => img.url).sort((a, b) => a.order - b.order);

        return {
          _id: property._id,
          title: property.title,
          propertyType: property.propertyType,
          rentAmount: property.rentAmount,
          currency: property.currency,
          city: property.city,
          neighborhood: property.neighborhood,
          imageUrl: sortedImages[0]?.url ?? property.placeholderImages?.[0] ?? null,
          placeholderImages: property.placeholderImages,
          verificationStatus: property.verificationStatus,
          _creationTime: property._creationTime,
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

    return propertiesWithDetails;
  },
});

// Get city statistics (public)
export const getCityStats = query({
  args: {},
  handler: async (ctx) => {
    // Get all active properties
    const properties = await ctx.db
      .query('properties')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();

    // Count properties per city
    const cityCountMap = new Map<string, number>();
    for (const property of properties) {
      const count = cityCountMap.get(property.city) ?? 0;
      cityCountMap.set(property.city, count + 1);
    }

    // Convert to array and sort by count
    const cityStats = Array.from(cityCountMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);

    return cityStats;
  },
});

// Get properties pending verification (admin/verifier only)
export const getPendingVerification = query({
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

    if (!user || (user.role !== 'admin' && user.role !== 'verifier')) {
      return [];
    }

    // Get properties pending verification
    const properties = await ctx.db
      .query('properties')
      .withIndex('by_status', (q) => q.eq('status', 'pending_verification'))
      .collect();

    // Get landlord info for each property
    const propertiesWithLandlord = await Promise.all(
      properties.map(async (property) => {
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
      })
    );

    return propertiesWithLandlord.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// Toggle property status (landlord can activate/deactivate)
export const togglePropertyStatus = mutation({
  args: {
    propertyId: v.id('properties'),
    active: v.boolean(),
  },
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

    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    if (property.landlordId !== user._id && user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    // Only allow toggling for verified properties
    if (property.verificationStatus !== 'approved') {
      throw new Error('Property must be verified before it can be activated');
    }

    const newStatus = args.active ? 'active' : 'draft';
    const updates: Record<string, unknown> = { status: newStatus };

    if (args.active && !property.publishedAt) {
      updates.publishedAt = Date.now();
    }

    await ctx.db.patch(args.propertyId, updates);
    return args.propertyId;
  },
});

// Remove image from property
export const removePropertyImage = mutation({
  args: {
    propertyId: v.id('properties'),
    storageId: v.id('_storage'),
  },
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

    const property = await ctx.db.get(args.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    if (property.landlordId !== user._id && user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    if (!property.images) {
      return args.propertyId;
    }

    // Filter out the image to remove
    const updatedImages = property.images.filter((img) => img.storageId !== args.storageId);

    // Reorder remaining images
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      order: index,
    }));

    await ctx.db.patch(args.propertyId, { images: reorderedImages });

    // Delete the file from storage
    await ctx.storage.delete(args.storageId);

    return args.propertyId;
  },
});
