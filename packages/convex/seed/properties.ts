import type { MutationCtx } from '../_generated/server';
import propertiesData from './data/properties.json';

export async function seedProperties(
  ctx: MutationCtx,
  seededUsers: Array<{ id: any; role: string }>
) {
  const landlords = seededUsers.filter((u) => u.role === 'landlord');
  const seededProperties = [];

  for (let i = 0; i < propertiesData.length; i++) {
    const propertyData = propertiesData[i];
    const landlord = landlords[i % landlords.length];

    const existingProperty = await ctx.db
      .query('properties')
      .filter((q) =>
        q.and(
          q.eq(q.field('title'), propertyData.title),
          q.eq(q.field('city'), propertyData.city)
        )
      )
      .unique();

    if (!existingProperty) {
      const propertyId = await ctx.db.insert('properties', {
        ...propertyData,
        landlordId: landlord.id,
        cautionMonths: 2,
        upfrontMonths: 6,
        searchText: `${propertyData.title} ${propertyData.city} ${propertyData.neighborhood}`.toLowerCase(),
      } as any);
      seededProperties.push({ id: propertyId, ...propertyData });
      console.log(`  ✓ Created property: ${propertyData.title}`);
    } else {
      seededProperties.push({ id: existingProperty._id, ...propertyData });
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
          q.and(
            q.eq(q.field('title'), p.title),
            q.eq(q.field('city'), p.city)
          )
        )
      )
    )
    .collect();

  for (const property of seedProperties) {
    await ctx.db.delete(property._id);
  }

  console.log(`  ✓ Cleared ${seedProperties.length} seed properties`);
}

