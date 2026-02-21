# Piol Backend API Reference

Convex queries, mutations, and actions. All functions are in `packages/convex/convex/`.

---

## Properties (`properties.ts`)

### Queries (public, no auth)

**`listProperties`** -- Browse properties with filters
```
args: { city?, neighborhood?, propertyType?, minPrice?, maxPrice?,
        amenities?: string[], verifiedOnly?, sortBy?, limit?, cursor? }
returns: { properties, nextCursor, total }
```

**`searchProperties`** -- Full-text search
```
args: { searchQuery, city?, propertyType?, limit? }
returns: Property[]
```

**`getProperty`** -- Single property detail (public for active/verified; auth required for draft/pending)
```
args: { propertyId }
returns: Property with imageUrls, landlord, reviews { count, averageRating }
```

**`getSearchSuggestions`** -- Autocomplete cities/neighborhoods
```
args: { query (min 2 chars), limit? }
returns: { cities: [{name, count}], neighborhoods: [{name, city, count}] }
```

**`getFilterOptions`** -- Available filter values
```
args: { city? }
returns: { cities, neighborhoods, propertyTypes, priceRange, amenities, totalCount }
```

**`getFeaturedProperties`** -- Homepage showcase
```
args: { limit? (default 6) }
returns: Property[] (active + verified, newest first)
```

**`getCityStats`** -- Property count per city
```
args: {}
returns: [{ city, count }]
```

### Queries (auth required)

**`getMyProperties`** -- Landlord's own properties
```
auth: any authenticated user
returns: Property[] (sorted newest first)
```

**`getPendingVerification`** -- Properties awaiting verification
```
auth: admin or verifier
returns: Property[] with landlord info
```

### Mutations (auth required)

**`createProperty`** -- Create property draft
```
auth: landlord or admin
args: { title (max 200), description? (max 5000), propertyType, rentAmount (> 0),
        cautionMonths? (>= 0), upfrontMonths? (>= 0), city, neighborhood?,
        location?, addressLine1?, addressLine2?, amenities?, currency? }
returns: propertyId
```

**`updateProperty`** -- Edit property
```
auth: property owner or admin
args: { propertyId, title?, description?, propertyType?, rentAmount?, location?,
        addressLine1?, addressLine2?, neighborhood?, amenities? }
returns: propertyId
```

**`addPropertyImages`** / **`removePropertyImage`** -- Manage images
```
auth: property owner or admin
```

**`submitForVerification`** -- Submit draft for review
```
auth: property owner (not admin)
requires: property status = 'draft'
```

**`updatePropertyStatus`** -- Change property status
```
auth: admin or verifier
args: { propertyId, status, verificationStatus? }
```

**`archiveProperty`** -- Soft-delete property
```
auth: property owner or admin
```

**`togglePropertyStatus`** -- Activate/deactivate verified property
```
auth: property owner or admin
requires: verificationStatus = 'approved'
```

---

## Transactions (`transactions.ts`)

### Queries (auth required)

**`getMyTransactions`** -- User's transactions
```
auth: any authenticated user
args: { role? ('renter'|'landlord'), status?, limit? }
returns: Transaction[] with property and otherParty info
```

**`getTransaction`** -- Single transaction detail
```
auth: renter, landlord, or admin on the transaction
args: { transactionId }
```

**`getTransactionByReference`** -- Lookup by reference code
```
auth: renter, landlord, or admin
args: { reference }
```

**`getTransactionStats`** -- Aggregate statistics
```
auth: admin only
args: { startDate?, endDate? }
returns: { totalTransactions, completedTransactions, totalVolume, byPaymentMethod, ... }
```

### Mutations (auth required)

**`createTransaction`** -- Initiate payment
```
auth: any authenticated user (becomes renter)
args: { propertyId, landlordId, transactionType, amount (> 0),
        paymentMethod, payerPhone? (Cameroon format) }
validation: landlordId must match property.landlordId, phone format checked
returns: { transactionId, transactionReference }
```

**`releaseEscrow`** -- Release held funds
```
auth: landlord on transaction or admin
requires: escrowStatus = 'held'
```

**`requestRefund`** -- Request refund for held escrow
```
auth: renter on transaction
requires: escrowStatus = 'held'
```

### Internal Functions (not callable from client)

- `updateTransactionStatus` -- internalMutation, updates status + creates notifications
- `internalUpdateStatus` -- internalMutation, updates status/escrow + notifications
- `updateMoMoReference` -- internalMutation, sets mobileMoneyReference
- `internalGetTransaction` -- internalQuery, fetches transaction with renter/landlord/property
- `internalGetUserByClerkId` -- internalQuery, resolves user from Clerk subject

---

## Payment Actions (`actions/payments.ts`)

All actions require `'use node'` runtime.

**`processPayment`** -- Route payment to MTN MoMo or Orange Money
```
auth: must be the renter on the transaction
args: { transactionId, amount, currency?, phoneNumber, paymentMethod,
        returnUrl?, cancelUrl? }
returns: { success, method, referenceId?, paymentUrl?, payToken?, orderId?, requiresRedirect }
```

**`checkPaymentStatus`** -- Poll provider for payment status
```
auth: renter or landlord on the transaction
args: { transactionId, paymentMethod, referenceId, orderId? }
returns: { status ('PENDING'|'SUCCESSFUL'|'FAILED'), paymentStatus, financialTransactionId }
```

**`releaseEscrowFunds`** -- Disburse escrow to landlord (5% commission)
```
auth: admin only
args: { transactionId }
returns: { success, disbursedAmount, commission, referenceId }
```

### Payment Flow

```
1. Client calls createTransaction (mutation) -> gets transactionId + reference
2. Client calls processPayment (action) -> MTN: USSD prompt sent, Orange: redirect URL returned
3. Provider processes payment, sends webhook callback
4. Webhook updates transaction via internalUpdateStatus
5. Client polls checkPaymentStatus for confirmation
6. Admin calls releaseEscrowFunds after move-in confirmation
```

---

## Messages (`messages.ts`)

**`getConversations`** -- List all conversations
```
auth: any authenticated user
returns: [{ conversationId, otherUser, property, lastMessage, unreadCount }]
```

**`getMessages`** -- Messages in a conversation
```
auth: conversation participant
args: { conversationId, limit?, cursor? }
returns: { messages, nextCursor, hasMore }
```

**`sendMessage`** -- Send a message
```
auth: any authenticated user
args: { recipientId, propertyId?, messageText (1-2000 chars) }
returns: messageId
side effects: creates/updates conversation, creates notification
```

**`markMessagesAsRead`** -- Mark conversation messages as read
```
auth: any authenticated user
args: { conversationId }
returns: number of messages marked
```

**`getUnreadCount`** -- Total unread messages
```
auth: any authenticated user
returns: number
```

---

## Reviews (`reviews.ts`)

**`getPropertyReviews`** -- Reviews for a property (public)
```
args: { propertyId }
returns: Review[] with reviewer info
```

**`getUserReviews`** -- Reviews about a user (public)
```
args: { userId, reviewType? }
returns: Review[] with reviewer and property info
```

**`getUserRating`** -- Average rating for a user (public)
```
args: { userId }
returns: { averageRating, totalReviews }
```

**`createReview`** -- Submit a review
```
auth: user with completed transaction for the property
args: { propertyId, revieweeId, reviewType, rating (1-5 integer), comment? (max 1000) }
validation: one review per user per type, rating must be whole number
```

**`updateReview`** / **`deleteReview`** -- Edit or remove review
```
auth: reviewer or admin
```

---

## Users (`users.ts`)

**`getCurrentUser`** -- Get authenticated user profile
```
auth: any authenticated user
```

**`getUserById`** -- Public user profile
```
args: { userId }
returns: user (excludes sensitive data)
```

**`updateProfile`** -- Update own profile
```
auth: any authenticated user
args: { firstName?, lastName?, phone?, languagePreference?, profileImageId? }
```

**`completeOnboarding`** -- Set role and preferences
```
auth: any authenticated user
args: { role, phone?, languagePreference? }
```

**`getDashboardStats`** -- Role-specific dashboard stats
```
auth: any authenticated user
returns: landlord stats (properties, revenue) or renter stats (saved, messages, spent)
```

**`updateUserRole`** -- Change user role (admin only)
```
auth: admin
args: { userId, role }
restriction: cannot promote to admin or demote admin
```

**`getUsersByRole`** / **`listUsers`** -- User lists (admin only)

**`getAdminStats`** -- Platform-wide statistics (admin only)

---

## Notifications (`notifications.ts`)

**`getNotifications`** -- User's notifications
```
auth: any authenticated user
args: { limit?, unreadOnly? }
```

**`getUnreadNotificationCount`** -- Unread count
```
auth: any authenticated user
returns: number
```

**`markAsRead`** / **`markAllAsRead`** / **`deleteNotification`** -- Manage notifications

---

## Verifications (`verifications.ts`)

**`getPendingVerifications`** -- Queue of properties to verify
```
auth: admin or verifier
args: { city? }
```

**`claimVerification`** -- Assign property to self
```
auth: admin or verifier
args: { propertyId }
```

**`updateVerification`** -- Add notes, photos, documents
```
auth: assigned verifier or admin
```

**`completeVerification`** -- Approve or reject
```
auth: assigned verifier or admin
args: { verificationId, status ('approved'|'rejected'), notes? }
side effects: updates property status, creates notification
```

---

## Files (`files.ts`)

**`generateUploadUrl`** -- Get upload URL (auth required)

**`getFileUrl`** / **`getFileUrls`** -- Resolve storage URLs (public, signed URLs)

**`deleteFile`** -- Delete file (auth + ownership check)

---

## Saved Properties (`savedProperties.ts`)

**`toggleSaveProperty`** -- Save or unsave
```
auth: any authenticated user
args: { propertyId }
returns: { saved: boolean }
```

**`getSavedProperties`** -- All saved properties with details

**`getSavedPropertyIds`** -- IDs only (for quick UI checks)

**`isPropertySaved`** -- Check single property

---

## HTTP Routes (`http.ts`)

| Path | Method | Auth | Purpose |
|------|--------|------|---------|
| `/clerk-webhook` | POST | Svix signature | Clerk user lifecycle events |
| `/mtn-momo-webhook` | POST | Bearer token | MTN MoMo payment callbacks |
| `/orange-money-webhook` | POST | Bearer token | Orange Money payment callbacks |
| `/health` | GET | None | Health check |
