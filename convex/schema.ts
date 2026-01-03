import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    phone: v.string(),
    passwordHash: v.optional(v.string()), // Optional if using OAuth
    role: v.union(
      v.literal('renter'),
      v.literal('landlord'),
      v.literal('admin'),
      v.literal('verifier')
    ),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    languagePreference: v.union(v.literal('fr'), v.literal('en')),
    emailVerified: v.boolean(),
    phoneVerified: v.boolean(),
    idVerified: v.boolean(),
    profileImageId: v.optional(v.id('_storage')),
    lastLogin: v.optional(v.number()),
    isActive: v.boolean(),
    // Convex Auth fields
    tokenIdentifier: v.optional(v.string()),
  })
    .index('by_email', ['email'])
    .index('by_phone', ['phone'])
    .index('by_role', ['role'])
    .index('by_token', ['tokenIdentifier']),

  // Properties table
  properties: defineTable({
    landlordId: v.id('users'),
    title: v.string(),
    description: v.optional(v.string()),
    propertyType: v.union(
      v.literal('studio'),
      v.literal('1br'),
      v.literal('2br'),
      v.literal('3br'),
      v.literal('4br'),
      v.literal('house'),
      v.literal('apartment'),
      v.literal('villa')
    ),
    rentAmount: v.number(),
    currency: v.string(), // Default: 'XAF'
    cautionMonths: v.number(), // Default: 2
    upfrontMonths: v.number(), // Default: 6
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
    amenities: v.optional(
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
    ),
    images: v.optional(
      v.array(
        v.object({
          storageId: v.id('_storage'),
          order: v.number(),
          caption: v.optional(v.string()),
        })
      )
    ),
    status: v.union(
      v.literal('draft'),
      v.literal('pending_verification'),
      v.literal('verified'),
      v.literal('active'),
      v.literal('rented'),
      v.literal('archived')
    ),
    verificationStatus: v.union(
      v.literal('pending'),
      v.literal('in_progress'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    verifiedAt: v.optional(v.number()),
    verifierId: v.optional(v.id('users')),
    publishedAt: v.optional(v.number()),
    // Search optimization
    searchText: v.optional(v.string()), // Concatenated searchable text
  })
    .index('by_landlord', ['landlordId'])
    .index('by_status', ['status'])
    .index('by_city', ['city'])
    .index('by_city_status', ['city', 'status'])
    .index('by_verification_status', ['verificationStatus'])
    .searchIndex('search_properties', {
      searchField: 'searchText',
      filterFields: ['city', 'status', 'propertyType'],
    }),

  // Verifications table
  verifications: defineTable({
    propertyId: v.id('properties'),
    verifierId: v.id('users'),
    verificationType: v.union(
      v.literal('property_visit'),
      v.literal('ownership_document'),
      v.literal('id_verification')
    ),
    status: v.union(
      v.literal('pending'),
      v.literal('in_progress'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    notes: v.optional(v.string()),
    documents: v.optional(
      v.array(
        v.object({
          type: v.string(),
          storageId: v.id('_storage'),
          verified: v.boolean(),
        })
      )
    ),
    visitDate: v.optional(v.number()),
    visitPhotos: v.optional(
      v.array(
        v.object({
          storageId: v.id('_storage'),
          timestamp: v.number(),
        })
      )
    ),
    completedAt: v.optional(v.number()),
  })
    .index('by_property', ['propertyId'])
    .index('by_verifier', ['verifierId'])
    .index('by_status', ['status']),

  // Transactions table
  transactions: defineTable({
    propertyId: v.id('properties'),
    renterId: v.id('users'),
    landlordId: v.id('users'),
    transactionType: v.union(
      v.literal('rent_payment'),
      v.literal('deposit'),
      v.literal('commission'),
      v.literal('refund')
    ),
    amount: v.number(),
    currency: v.string(), // Default: 'XAF'
    paymentMethod: v.union(
      v.literal('mtn_momo'),
      v.literal('orange_money'),
      v.literal('bank_transfer'),
      v.literal('cash')
    ),
    paymentStatus: v.union(
      v.literal('pending'),
      v.literal('processing'),
      v.literal('completed'),
      v.literal('failed'),
      v.literal('refunded')
    ),
    escrowStatus: v.optional(
      v.union(v.literal('held'), v.literal('released'), v.literal('refunded'))
    ),
    mobileMoneyReference: v.optional(v.string()),
    transactionReference: v.string(),
    completedAt: v.optional(v.number()),
    // Mobile Money specific fields
    payerPhone: v.optional(v.string()),
    externalId: v.optional(v.string()),
    callbackReceived: v.optional(v.boolean()),
  })
    .index('by_property', ['propertyId'])
    .index('by_renter', ['renterId'])
    .index('by_landlord', ['landlordId'])
    .index('by_status', ['paymentStatus'])
    .index('by_reference', ['transactionReference']),

  // Messages table
  messages: defineTable({
    conversationId: v.string(),
    senderId: v.id('users'),
    recipientId: v.id('users'),
    propertyId: v.optional(v.id('properties')),
    messageText: v.string(),
    isRead: v.boolean(),
  })
    .index('by_conversation', ['conversationId'])
    .index('by_sender', ['senderId'])
    .index('by_recipient', ['recipientId'])
    .index('by_property', ['propertyId'])
    .index('by_conversation_time', ['conversationId']),

  // Conversations table (for listing conversations)
  conversations: defineTable({
    participantIds: v.array(v.id('users')),
    propertyId: v.optional(v.id('properties')),
    lastMessageAt: v.number(),
    lastMessagePreview: v.optional(v.string()),
  })
    .index('by_participants', ['participantIds'])
    .index('by_last_message', ['lastMessageAt']),

  // Reviews table
  reviews: defineTable({
    propertyId: v.id('properties'),
    reviewerId: v.id('users'),
    revieweeId: v.id('users'),
    reviewType: v.union(
      v.literal('landlord_review'),
      v.literal('tenant_review'),
      v.literal('property_review')
    ),
    rating: v.number(), // 1-5
    comment: v.optional(v.string()),
  })
    .index('by_property', ['propertyId'])
    .index('by_reviewee', ['revieweeId'])
    .index('by_reviewer', ['reviewerId']),

  // Tenant Screenings table
  tenantScreenings: defineTable({
    renterId: v.id('users'),
    propertyId: v.optional(v.id('properties')),
    employmentStatus: v.optional(v.string()),
    employerName: v.optional(v.string()),
    monthlyIncome: v.optional(v.number()),
    previousRentalHistory: v.optional(
      v.array(
        v.object({
          landlordName: v.optional(v.string()),
          landlordPhone: v.optional(v.string()),
          duration: v.optional(v.string()),
          reason: v.optional(v.string()),
        })
      )
    ),
    references: v.optional(
      v.array(
        v.object({
          name: v.string(),
          phone: v.string(),
          relationship: v.string(),
        })
      )
    ),
    screeningStatus: v.union(
      v.literal('pending'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('failed')
    ),
    screeningScore: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  })
    .index('by_renter', ['renterId'])
    .index('by_property', ['propertyId'])
    .index('by_status', ['screeningStatus']),

  // Notifications table
  notifications: defineTable({
    userId: v.id('users'),
    notificationType: v.string(),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
    isRead: v.boolean(),
    actionUrl: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_user_unread', ['userId', 'isRead']),

  // Saved Properties (favorites)
  savedProperties: defineTable({
    userId: v.id('users'),
    propertyId: v.id('properties'),
  })
    .index('by_user', ['userId'])
    .index('by_property', ['propertyId'])
    .index('by_user_property', ['userId', 'propertyId']),
});
