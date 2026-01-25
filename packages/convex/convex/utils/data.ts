import type { Doc } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';

/**
 * Public landlord info to include with properties.
 */
export interface LandlordInfo {
  _id: Doc<'users'>['_id'];
  firstName: string | undefined;
  lastName: string | undefined;
  idVerified: boolean;
}

/**
 * Extended landlord info with contact details (for authorized users).
 */
export interface LandlordInfoWithContact extends LandlordInfo {
  phone: string | undefined;
  email?: string;
}

/**
 * Enrich a list of properties with landlord information.
 * Used in list queries that need to show landlord details.
 *
 * @example
 * const propertiesWithLandlord = await enrichPropertiesWithLandlord(properties, ctx);
 */
export async function enrichPropertiesWithLandlord<T extends Doc<'properties'>>(
  properties: T[],
  ctx: QueryCtx
): Promise<(T & { landlord: LandlordInfo | null })[]> {
  return Promise.all(
    properties.map(async (property) => {
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
}

/**
 * Get landlord info for a single property.
 *
 * @example
 * const landlordInfo = await getLandlordInfo(property.landlordId, ctx);
 */
export async function getLandlordInfo(
  landlordId: Doc<'properties'>['landlordId'],
  ctx: QueryCtx
): Promise<LandlordInfo | null> {
  const landlord = await ctx.db.get(landlordId);
  if (!landlord) return null;

  return {
    _id: landlord._id,
    firstName: landlord.firstName,
    lastName: landlord.lastName,
    idVerified: landlord.idVerified,
  };
}

/**
 * Get landlord info with contact details (for authorized users).
 *
 * @example
 * const landlordInfo = await getLandlordInfoWithContact(property.landlordId, ctx);
 */
export async function getLandlordInfoWithContact(
  landlordId: Doc<'properties'>['landlordId'],
  ctx: QueryCtx
): Promise<LandlordInfoWithContact | null> {
  const landlord = await ctx.db.get(landlordId);
  if (!landlord) return null;

  return {
    _id: landlord._id,
    firstName: landlord.firstName,
    lastName: landlord.lastName,
    idVerified: landlord.idVerified,
    phone: landlord.phone,
    email: landlord.email,
  };
}

/**
 * Basic user info to include in transaction/message data.
 */
export interface BasicUserInfo {
  _id: Doc<'users'>['_id'];
  firstName: string | undefined;
  lastName: string | undefined;
}

/**
 * Get basic user info for display purposes.
 *
 * @example
 * const userInfo = await getBasicUserInfo(userId, ctx);
 */
export async function getBasicUserInfo(
  userId: Doc<'users'>['_id'],
  ctx: QueryCtx
): Promise<BasicUserInfo | null> {
  const user = await ctx.db.get(userId);
  if (!user) return null;

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

/**
 * Basic property info to include in transaction data.
 */
export interface BasicPropertyInfo {
  _id: Doc<'properties'>['_id'];
  title: string;
  city: string;
  neighborhood?: string;
}

/**
 * Get basic property info for display purposes.
 *
 * @example
 * const propertyInfo = await getBasicPropertyInfo(propertyId, ctx);
 */
export async function getBasicPropertyInfo(
  propertyId: Doc<'properties'>['_id'],
  ctx: QueryCtx
): Promise<BasicPropertyInfo | null> {
  const property = await ctx.db.get(propertyId);
  if (!property) return null;

  return {
    _id: property._id,
    title: property.title,
    city: property.city,
    neighborhood: property.neighborhood,
  };
}
