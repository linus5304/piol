import type { MutationCtx } from '../_generated/server';
import propertiesData from './data/properties.json';

type PropertyData = (typeof propertiesData)[number];

export async function seedProperties(
  ctx: MutationCtx,
  seededUsers: Array<{ id: any; role: string }>
) {
  const landlords = seededUsers.filter((u) => u.role === 'landlord');
  const seededProperties = [];

  for (let i = 0; i < propertiesData.length; i++) {
    const propertyData: PropertyData = propertiesData[i];
    const landlord = landlords[i % landlords.length];

    const existingProperty = await ctx.db
      .query('properties')
      .filter((q) =>
        q.and(q.eq(q.field('title'), propertyData.title), q.eq(q.field('city'), propertyData.city))
      )
      .unique();

    if (!existingProperty) {
      const propertyId = await ctx.db.insert('properties', {
        landlordId: landlord.id,
        title: propertyData.title,
        description: propertyData.description,
        propertyType: propertyData.propertyType as any,
        rentAmount: propertyData.rentAmount,
        currency: propertyData.currency,
        city: propertyData.city,
        neighborhood: propertyData.neighborhood,
        status: propertyData.status as any,
        verificationStatus: propertyData.verificationStatus as any,
        amenities: propertyData.amenities,
        placeholderImages: propertyData.placeholderImages,
        cautionMonths: 2,
        upfrontMonths: 6,
        searchText:
          `${propertyData.title} ${propertyData.description || ''} ${propertyData.city} ${propertyData.neighborhood || ''}`.toLowerCase(),
      });
      seededProperties.push({ id: propertyId, index: i, ...propertyData });
      console.log(`  ✓ Created property: ${propertyData.title}`);
    } else {
      seededProperties.push({ id: existingProperty._id, index: i, ...propertyData });
      console.log(`  ○ Property exists: ${propertyData.title}`);
    }
  }

  return seededProperties;
}

export async function clearProperties(ctx: MutationCtx) {
  const seedProperties = await ctx.db
    .query('properties')
    .filter((q) =>
      q.or(
        ...propertiesData.map((p) =>
          q.and(q.eq(q.field('title'), p.title), q.eq(q.field('city'), p.city))
        )
      )
    )
    .collect();

  for (const property of seedProperties) {
    await ctx.db.delete(property._id);
  }

  console.log(`  ✓ Cleared ${seedProperties.length} seed properties`);
}
