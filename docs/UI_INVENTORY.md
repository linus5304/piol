# Piol — Complete UI Inventory

> All pages, components, and UI elements needed for the Piol application.

---

## 📊 Summary

| Category | Count |
|----------|-------|
| Public Pages | 7 |
| Auth Pages | 4 |
| Renter Dashboard | 8 |
| Landlord Dashboard | 10 |
| Admin Dashboard | 9 |
| Verifier Dashboard | 5 |
| Shared Components | 25+ |
| **Total Pages** | **43** |

---

## 🌐 PUBLIC PAGES (No Auth Required)

### 1. Landing Page `/`
**Status:** ✅ Generated (with edits)

**Elements:**
- [ ] Header (sticky)
  - [ ] Logo
  - [ ] Navigation links
  - [ ] Language toggle (FR/EN)
  - [ ] Sign In / Sign Up buttons
  - [ ] Mobile hamburger menu
- [ ] Hero section
  - [ ] Background image with overlay
  - [ ] Headline + subheadline
  - [ ] Search bar (city, type, budget)
  - [ ] Trust stats
- [ ] How it works (3 steps)
- [ ] Featured properties grid (6 cards)
- [ ] Trust/Why Piol section (4 cards)
- [ ] Cities section (4 city cards)
- [ ] Landlord CTA section
- [ ] Footer
  - [ ] Logo + tagline
  - [ ] Navigation links
  - [ ] Legal links
  - [ ] Social icons
  - [ ] Copyright

---

### 2. Property Listing Page `/properties`
**Status:** ⏳ Pending

**Elements:**
- [ ] Search bar (sticky)
- [ ] Filter bar
  - [ ] City filter (multi-select)
  - [ ] Property type filter
  - [ ] Price range slider
  - [ ] More filters button → Sheet
    - [ ] Amenities checkboxes
    - [ ] Availability dropdown
- [ ] Active filter badges (removable)
- [ ] Results count
- [ ] Sort dropdown
- [ ] Property grid (responsive: 1/2/3 columns)
- [ ] Property cards (see component)
- [ ] Empty state (no results)
- [ ] Loading state (skeleton cards)
- [ ] Pagination / Load more
- [ ] Mobile: Filter sheet (full screen)
- [ ] Mobile: Map toggle button

---

### 3. Property Detail Page `/properties/[id]`
**Status:** ⏳ Pending

**Elements:**
- [ ] Breadcrumb navigation
- [ ] Image gallery
  - [ ] Main image (large)
  - [ ] Thumbnail grid
  - [ ] Lightbox modal
  - [ ] Mobile: swipeable carousel
- [ ] Property header
  - [ ] Title
  - [ ] Verified badge
  - [ ] Location
  - [ ] Posted date
- [ ] Price card (sticky desktop / fixed bottom mobile)
  - [ ] Monthly rent
  - [ ] Caution amount
  - [ ] Advance amount
  - [ ] Total upfront calculation
  - [ ] Contact button (primary)
  - [ ] Schedule visit button
  - [ ] Save/favorite button
  - [ ] Share button
- [ ] Details grid (type, bedrooms, bathrooms, size, floor, availability)
- [ ] Description section (expandable)
- [ ] Amenities section (checkmark grid)
- [ ] Location section
  - [ ] Map placeholder
  - [ ] Neighborhood info
  - [ ] Nearby landmarks
- [ ] Landlord card
  - [ ] Avatar
  - [ ] Name
  - [ ] Verified badge
  - [ ] Member since
  - [ ] Rating
  - [ ] Response time
  - [ ] View profile link
- [ ] Reviews section
  - [ ] Average rating
  - [ ] Review list
  - [ ] "See all reviews" link
- [ ] Similar properties (horizontal scroll)
- [ ] Contact modal/sheet
- [ ] Schedule visit modal

---

### 4. About Page `/about`
**Status:** ⏳ Pending

**Elements:**
- [ ] Hero with mission statement
- [ ] Our story section
- [ ] Team section (optional)
- [ ] Values/pillars section
- [ ] Stats section
- [ ] CTA section

---

### 5. Contact Page `/contact`
**Status:** ⏳ Pending

**Elements:**
- [ ] Contact form
  - [ ] Name input
  - [ ] Email input
  - [ ] Subject dropdown
  - [ ] Message textarea
  - [ ] Submit button
- [ ] Contact info cards
  - [ ] Email
  - [ ] Phone
  - [ ] WhatsApp
  - [ ] Address
- [ ] FAQ accordion (common questions)

---

### 6. Terms of Service `/terms`
**Status:** ⏳ Pending

**Elements:**
- [ ] Legal content layout
- [ ] Table of contents (sidebar)
- [ ] Section headings
- [ ] Last updated date

---

### 7. Privacy Policy `/privacy`
**Status:** ⏳ Pending

**Elements:**
- [ ] Legal content layout
- [ ] Table of contents
- [ ] Section headings
- [ ] Last updated date

---

## 🔐 AUTH PAGES

### 8. Sign In Page `/sign-in`
**Status:** ⏳ Pending (Clerk-styled)

**Elements:**
- [ ] Centered card
- [ ] Logo
- [ ] Heading + subheading
- [ ] Social login buttons (Google, Facebook)
- [ ] Divider "ou"
- [ ] Email input
- [ ] Password input (show/hide toggle)
- [ ] Forgot password link
- [ ] Sign in button
- [ ] Sign up link

---

### 9. Sign Up Page `/sign-up`
**Status:** ⏳ Pending (Clerk-styled)

**Elements:**
- [ ] Centered card
- [ ] Logo
- [ ] Heading + subheading
- [ ] Social signup buttons
- [ ] Divider
- [ ] First name input
- [ ] Last name input
- [ ] Email input
- [ ] Password input (with requirements)
- [ ] Role selection (Renter / Landlord)
- [ ] Terms checkbox
- [ ] Sign up button
- [ ] Sign in link

---

### 10. Onboarding Page `/onboarding`
**Status:** ⏳ Pending

**Elements:**
- [ ] Progress stepper (3 steps)
- [ ] Step 1: Role confirmation
- [ ] Step 2: Phone number
  - [ ] Country code dropdown (+237)
  - [ ] Phone input
- [ ] Step 3: Preferences
  - [ ] Language preference
  - [ ] City preference (renters)
- [ ] Completion screen
  - [ ] Success animation
  - [ ] "Commencer" button

---

### 11. Forgot Password `/forgot-password`
**Status:** ⏳ Pending (Clerk handles)

**Elements:**
- [ ] Email input
- [ ] Submit button
- [ ] Back to sign in link
- [ ] Success message

---

## 👤 RENTER DASHBOARD

### 12. Renter Dashboard Home `/dashboard`
**Status:** ⏳ Pending

**Elements:**
- [ ] Welcome message with name
- [ ] Quick stats cards (3)
  - [ ] Saved properties count
  - [ ] Unread messages count
  - [ ] Active payments
- [ ] Recent activity timeline
- [ ] Saved properties preview (horizontal scroll)
- [ ] Recommended properties
- [ ] Quick actions card

---

### 13. Saved Properties `/dashboard/saved`
**Status:** ⏳ Pending

**Elements:**
- [ ] Page header
- [ ] Property grid
- [ ] Property cards with remove button
- [ ] Empty state
- [ ] Sort dropdown

---

### 14. Renter Messages `/dashboard/messages`
**Status:** ⏳ Pending

**Elements:**
- [ ] Split view (desktop)
- [ ] Conversation list (left)
  - [ ] Search input
  - [ ] Filter tabs (All / Unread)
  - [ ] Conversation items
    - [ ] Avatar
    - [ ] Name
    - [ ] Property context
    - [ ] Last message preview
    - [ ] Time
    - [ ] Unread indicator
- [ ] Message thread (right)
  - [ ] Header with contact info
  - [ ] Messages area
    - [ ] Date separators
    - [ ] Sent/received messages
    - [ ] Timestamps
    - [ ] Read receipts
  - [ ] Message input
- [ ] Mobile: list view → thread view navigation

---

### 15. Message Thread `/dashboard/messages/[id]`
**Status:** ⏳ Pending (mobile version)

**Elements:**
- [ ] Header with back button
- [ ] Contact info
- [ ] Property link
- [ ] Messages list
- [ ] Input area

---

### 16. Renter Payments `/dashboard/payments`
**Status:** ⏳ Pending

**Elements:**
- [ ] Summary cards
  - [ ] Amount due
  - [ ] Pending
  - [ ] Paid this month
- [ ] Make payment card
  - [ ] Property info
  - [ ] Amount due
  - [ ] Due date
  - [ ] Payment method selection (MTN MoMo / Orange Money)
  - [ ] Phone number input
  - [ ] Pay button
- [ ] Transaction history
  - [ ] Filter tabs
  - [ ] Date range picker
  - [ ] Transaction list/table
- [ ] Transaction detail modal

---

### 17. Notifications `/dashboard/notifications`
**Status:** ⏳ Pending

**Elements:**
- [ ] Notification list
  - [ ] Icon by type
  - [ ] Title
  - [ ] Message
  - [ ] Time
  - [ ] Unread indicator
  - [ ] Action button
- [ ] Mark all as read button
- [ ] Empty state

---

### 18. Renter Profile/Settings `/dashboard/settings`
**Status:** ⏳ Pending

**Elements:**
- [ ] Settings navigation tabs
- [ ] Profile section
  - [ ] Avatar upload
  - [ ] Name inputs
  - [ ] Email (read-only)
  - [ ] Phone input
  - [ ] Bio textarea
  - [ ] ID verification status + button
- [ ] Security section
  - [ ] Change password link
  - [ ] Two-factor toggle
  - [ ] Active sessions
- [ ] Notifications section
  - [ ] Toggle switches for each type
  - [ ] Email/SMS/Push toggles
- [ ] Language section
- [ ] Help section
- [ ] Danger zone (delete account)

---

### 19. ID Verification `/dashboard/verify-id`
**Status:** ⏳ Pending

**Elements:**
- [ ] Instructions
- [ ] ID type selection
- [ ] Document upload
  - [ ] Front of ID
  - [ ] Back of ID
  - [ ] Selfie with ID
- [ ] Submit button
- [ ] Processing status
- [ ] Success/failure result

---

## 🏠 LANDLORD DASHBOARD

### 20. Landlord Dashboard Home `/dashboard` (landlord role)
**Status:** ⏳ Pending

**Elements:**
- [ ] Welcome message
- [ ] Key metrics cards (4)
  - [ ] Active properties
  - [ ] Total views
  - [ ] Messages received
  - [ ] Monthly revenue
- [ ] Properties overview
  - [ ] Tabs (Active / Pending / Drafts)
  - [ ] Property table/cards
- [ ] Recent messages
- [ ] Recent payments
- [ ] Performance chart (30-day views)
- [ ] Alerts banner (pending verifications)

---

### 21. Property Management `/dashboard/properties`
**Status:** ⏳ Pending

**Elements:**
- [ ] Page header with "New Property" button
- [ ] Search input
- [ ] Status filter tabs
- [ ] Properties list
  - [ ] Property cards (horizontal)
    - [ ] Thumbnail
    - [ ] Title
    - [ ] Location
    - [ ] Price
    - [ ] Status badge
    - [ ] Views count
    - [ ] Inquiries count
    - [ ] Actions menu
- [ ] Empty state
- [ ] Pagination

---

### 22. Property Detail (Landlord View) `/dashboard/properties/[id]`
**Status:** ⏳ Pending

**Elements:**
- [ ] Property overview card
- [ ] Stats (views, saves, inquiries)
- [ ] Status management
  - [ ] Current status badge
  - [ ] Status change buttons
- [ ] Verification status
- [ ] Edit button
- [ ] Inquiries list
- [ ] Recent activity

---

### 23. Create Property `/dashboard/properties/new`
**Status:** ⏳ Pending

**Elements:**
- [ ] Multi-step form
- [ ] Progress stepper (5 steps)
- [ ] Step 1: Basic Info
  - [ ] Title input
  - [ ] Property type select
  - [ ] Description textarea
  - [ ] City select
  - [ ] Neighborhood input
  - [ ] Address input
- [ ] Step 2: Details & Amenities
  - [ ] Bedrooms number
  - [ ] Bathrooms number
  - [ ] Size (m²)
  - [ ] Floor number
  - [ ] Amenities toggles
- [ ] Step 3: Photos
  - [ ] Drag & drop zone
  - [ ] Upload progress
  - [ ] Image grid (reorderable)
  - [ ] Delete buttons
  - [ ] Cover image selection
- [ ] Step 4: Pricing & Availability
  - [ ] Rent amount input
  - [ ] Caution months select
  - [ ] Advance months select
  - [ ] Total calculation display
  - [ ] Availability select/date picker
- [ ] Step 5: Preview & Publish
  - [ ] Full preview card
  - [ ] Checklist
  - [ ] Terms checkbox
  - [ ] Save as draft button
  - [ ] Submit button
- [ ] Autosave indicator

---

### 24. Edit Property `/dashboard/properties/[id]/edit`
**Status:** ⏳ Pending

**Elements:**
- [ ] Same as create form
- [ ] Pre-filled values
- [ ] Status indicator
- [ ] "Changes require re-verification" warning

---

### 25. Landlord Messages `/dashboard/messages`
**Status:** ⏳ Pending (same as renter)

**Elements:**
- [ ] (Same structure as renter messages)
- [ ] Inquiry context visible
- [ ] Quick response templates

---

### 26. Landlord Payments `/dashboard/payments`
**Status:** ⏳ Pending

**Elements:**
- [ ] Revenue summary cards
  - [ ] Monthly revenue
  - [ ] In escrow
  - [ ] Released this month
- [ ] Payout settings card
  - [ ] Current payout method
  - [ ] Phone number
  - [ ] Edit button
- [ ] Transaction history
- [ ] Payout history

---

### 27. Landlord Reviews `/dashboard/reviews`
**Status:** ⏳ Pending

**Elements:**
- [ ] Overall rating card
- [ ] Rating breakdown by property
- [ ] Reviews list
  - [ ] Reviewer info
  - [ ] Property
  - [ ] Rating
  - [ ] Comment
  - [ ] Date
- [ ] Response to review modal

---

### 28. Landlord Settings `/dashboard/settings`
**Status:** ⏳ Pending (extends renter)

**Elements:**
- [ ] (Same as renter settings)
- [ ] Payout section
  - [ ] Payment method selection
  - [ ] Phone number input
  - [ ] Save button

---

### 29. Tenant Applications `/dashboard/applications`
**Status:** ⏳ Pending

**Elements:**
- [ ] Applications list
  - [ ] Applicant info
  - [ ] Property
  - [ ] Application date
  - [ ] Status
- [ ] Application detail modal
  - [ ] Renter profile
  - [ ] Employment info
  - [ ] References
  - [ ] Accept/Reject buttons

---

## 👑 ADMIN DASHBOARD

### 30. Admin Dashboard Home `/admin`
**Status:** ⏳ Pending

**Elements:**
- [ ] Key metrics row (5 cards)
  - [ ] Total users
  - [ ] Total properties
  - [ ] Total transactions
  - [ ] Transaction volume
  - [ ] Platform commission
- [ ] Charts row
  - [ ] Registrations chart
  - [ ] Properties by status donut
  - [ ] Revenue bar chart
  - [ ] Properties by city chart
- [ ] Activity tabs
  - [ ] Recent users
  - [ ] Recent properties
  - [ ] Recent transactions
- [ ] Pending actions card
- [ ] System status indicators

---

### 31. User Management `/admin/users`
**Status:** ⏳ Pending

**Elements:**
- [ ] Search input
- [ ] Role filter
- [ ] Status filter
- [ ] Users table
  - [ ] Avatar
  - [ ] Name
  - [ ] Email
  - [ ] Role badge
  - [ ] Status
  - [ ] Joined date
  - [ ] Actions menu
- [ ] User detail modal
- [ ] Edit user modal
- [ ] Pagination

---

### 32. Properties Management `/admin/properties`
**Status:** ⏳ Pending

**Elements:**
- [ ] Search input
- [ ] Status filter
- [ ] Verification filter
- [ ] City filter
- [ ] Properties table
  - [ ] Image + title
  - [ ] Owner
  - [ ] City
  - [ ] Price
  - [ ] Status badge
  - [ ] Verification badge
  - [ ] Actions
- [ ] Property detail modal
- [ ] Bulk actions
- [ ] Pagination

---

### 33. Transactions Management `/admin/transactions`
**Status:** ⏳ Pending

**Elements:**
- [ ] Date range picker
- [ ] Status filter
- [ ] Payment method filter
- [ ] Transactions table
  - [ ] Reference
  - [ ] Renter → Landlord
  - [ ] Property
  - [ ] Amount
  - [ ] Payment status badge
  - [ ] Escrow status badge
  - [ ] Date
  - [ ] Actions
- [ ] Transaction detail modal
- [ ] Release escrow action
- [ ] Refund action
- [ ] Export button

---

### 34. Verifications Management `/admin/verifications`
**Status:** ⏳ Pending

**Elements:**
- [ ] Status filter tabs
- [ ] Verifications table
  - [ ] Property
  - [ ] Owner
  - [ ] Verifier
  - [ ] Type
  - [ ] Status
  - [ ] Date
- [ ] Assign verifier modal
- [ ] Verification detail modal

---

### 35. Reports & Analytics `/admin/reports`
**Status:** ⏳ Pending

**Elements:**
- [ ] Date range selector
- [ ] Revenue report
- [ ] User growth report
- [ ] Property performance report
- [ ] City breakdown
- [ ] Export options

---

### 36. Platform Settings `/admin/settings`
**Status:** ⏳ Pending

**Elements:**
- [ ] Commission rate setting
- [ ] Default caution months
- [ ] Default advance months
- [ ] Supported cities management
- [ ] Feature flags

---

### 37. Support Tickets `/admin/support`
**Status:** ⏳ Pending

**Elements:**
- [ ] Tickets list
- [ ] Status filter
- [ ] Priority filter
- [ ] Ticket detail view
- [ ] Response form
- [ ] Assign to team member

---

### 38. Audit Log `/admin/audit`
**Status:** ⏳ Pending

**Elements:**
- [ ] Activity log table
- [ ] User filter
- [ ] Action type filter
- [ ] Date range
- [ ] Detail modal

---

## ✅ VERIFIER DASHBOARD

### 39. Verifier Dashboard Home `/verifier`
**Status:** ⏳ Pending

**Elements:**
- [ ] Stats cards (4)
  - [ ] Pending
  - [ ] In progress
  - [ ] Completed today
  - [ ] Monthly total
- [ ] Pending verifications list
- [ ] My active verifications
- [ ] Quick actions

---

### 40. Pending Verifications `/verifier/pending`
**Status:** ⏳ Pending

**Elements:**
- [ ] Verifications queue
  - [ ] Property info
  - [ ] Owner
  - [ ] Location
  - [ ] Submitted date
  - [ ] Priority indicator
  - [ ] "Start Verification" button
- [ ] Sort by oldest first

---

### 41. Verification Detail `/verifier/verify/[id]`
**Status:** ⏳ Pending

**Elements:**
- [ ] Property details card
- [ ] Owner contact info
- [ ] Verification checklist
  - [ ] Property visited checkbox
  - [ ] Photos taken checkbox
  - [ ] Documents verified checkbox
  - [ ] Owner met checkbox
- [ ] Visit photos upload
- [ ] Notes textarea
- [ ] Decision buttons
  - [ ] Approve (green)
  - [ ] Reject (red) → Reason modal
  - [ ] Request more info (yellow)

---

### 42. My Verifications `/verifier/history`
**Status:** ⏳ Pending

**Elements:**
- [ ] Completed verifications list
- [ ] Date filter
- [ ] Stats summary

---

### 43. Verifier Schedule `/verifier/schedule`
**Status:** ⏳ Pending

**Elements:**
- [ ] Calendar view
- [ ] Upcoming visits list
- [ ] Add visit modal

---

## 🧩 SHARED COMPONENTS

### Layout Components
- [ ] **PublicLayout** - Header + Footer wrapper
- [ ] **DashboardLayout** - Sidebar + Header + Main area
- [ ] **AuthLayout** - Centered card layout

### Navigation
- [ ] **Header** - Public site header
- [ ] **Footer** - Public site footer
- [ ] **Sidebar** - Dashboard sidebar (collapsible)
- [ ] **MobileNav** - Bottom navigation bar
- [ ] **Breadcrumbs** - Page hierarchy

### Property Components
- [ ] **PropertyCard** - Standard property card
- [ ] **PropertyCardCompact** - Smaller horizontal version
- [ ] **PropertyCardSkeleton** - Loading state
- [ ] **PropertyGrid** - Responsive grid layout
- [ ] **PropertyFilters** - Filter controls
- [ ] **PropertyGallery** - Image gallery with lightbox
- [ ] **PropertyMap** - Map with markers
- [ ] **AmenityBadge** - Single amenity with icon
- [ ] **AmenitiesList** - Grid of amenities

### User Components
- [ ] **UserAvatar** - Avatar with fallback initials
- [ ] **UserCard** - Landlord/user info card
- [ ] **VerifiedBadge** - Verification indicator
- [ ] **RoleBadge** - Role indicator

### Form Components
- [ ] **SearchBar** - Property search with autocomplete
- [ ] **FilterSheet** - Mobile filter sheet
- [ ] **PriceRangeSlider** - Min/max price selector
- [ ] **ImageUploader** - Drag & drop image upload
- [ ] **PhoneInput** - Phone with country code
- [ ] **CurrencyInput** - FCFA formatted input

### Feedback Components
- [ ] **EmptyState** - No data illustration + message
- [ ] **LoadingState** - Full page loader
- [ ] **ErrorState** - Error message + retry
- [ ] **Toast** - Notification toasts
- [ ] **ConfirmDialog** - Confirmation modal

### Data Display
- [ ] **StatCard** - Metric with icon + trend
- [ ] **StatusBadge** - Color-coded status
- [ ] **DataTable** - Sortable/filterable table
- [ ] **Timeline** - Activity timeline
- [ ] **PriceDisplay** - Formatted FCFA price

### Payment Components
- [ ] **PaymentMethodSelector** - MTN/Orange radio cards
- [ ] **TransactionCard** - Transaction summary
- [ ] **EscrowIndicator** - Escrow status display

### Messaging Components
- [ ] **ConversationItem** - Chat list item
- [ ] **MessageBubble** - Single message
- [ ] **MessageInput** - Composer with send button
- [ ] **TypingIndicator** - "User is typing..."

---

## 📱 MOBILE-SPECIFIC COMPONENTS

- [ ] **BottomSheet** - Slide-up panel
- [ ] **BottomNav** - Tab bar navigation
- [ ] **SwipeableCard** - Swipe actions
- [ ] **PullToRefresh** - Refresh indicator
- [ ] **StickyHeader** - Collapsing header

---

## 🎨 v0 GENERATION ORDER (Recommended)

### Phase 1: Foundation
1. ✅ Landing Page
2. Property Card Component
3. Header Component
4. Footer Component
5. Dashboard Layout (Shell)

### Phase 2: Core Flow
6. Property Listing Page
7. Property Detail Page
8. Sign In / Sign Up Pages
9. Onboarding Flow

### Phase 3: Renter Experience
10. Renter Dashboard Home
11. Saved Properties
12. Messages Inbox
13. Payments Page
14. Settings Page

### Phase 4: Landlord Experience
15. Landlord Dashboard Home
16. Property Management
17. Create Property Form
18. Landlord Payments

### Phase 5: Admin & Verifier
19. Admin Dashboard
20. User Management
21. Verifier Dashboard
22. Verification Flow

### Phase 6: Polish
23. About Page
24. Contact Page
25. Error Pages (404, 500)
26. Empty States
27. Loading States

---

## 📋 Checklist Export

Copy this to track progress:

```
## Public Pages
- [ ] Landing Page
- [ ] Property Listing
- [ ] Property Detail
- [ ] About
- [ ] Contact
- [ ] Terms
- [ ] Privacy

## Auth
- [ ] Sign In
- [ ] Sign Up
- [ ] Onboarding
- [ ] Forgot Password

## Renter Dashboard
- [ ] Dashboard Home
- [ ] Saved Properties
- [ ] Messages
- [ ] Payments
- [ ] Notifications
- [ ] Settings
- [ ] ID Verification

## Landlord Dashboard
- [ ] Dashboard Home
- [ ] Property Management
- [ ] Property Detail
- [ ] Create Property
- [ ] Edit Property
- [ ] Messages
- [ ] Payments
- [ ] Reviews
- [ ] Settings
- [ ] Applications

## Admin Dashboard
- [ ] Dashboard Home
- [ ] User Management
- [ ] Properties Management
- [ ] Transactions
- [ ] Verifications
- [ ] Reports
- [ ] Settings
- [ ] Support
- [ ] Audit Log

## Verifier Dashboard
- [ ] Dashboard Home
- [ ] Pending Verifications
- [ ] Verification Detail
- [ ] My Verifications
- [ ] Schedule
```
