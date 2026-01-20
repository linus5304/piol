# UI Redesign Tasks

## Phase 0: Setup & Preparation (redesign-0)

### 0.1 Project Setup
- [ ] 0.1.1 Archive `add-production-polish` change using `openspec archive add-production-polish --yes`
- [ ] 0.1.2 Create feature branch: `git checkout -b feat/ui-redesign`
- [ ] 0.1.3 Install map dependencies: `bun add leaflet react-leaflet @types/leaflet`

### 0.2 Add Missing shadcn Components
Create these components based on shadcn blocks patterns:

- [ ] 0.2.1 Create `components/ui/item.tsx` — List item with media, content, actions slots
  ```
  Item, ItemGroup, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemSeparator
  ```
- [ ] 0.2.2 Create `components/ui/field.tsx` — Form field wrapper with label, description
  ```
  Field, FieldGroup, FieldSet, FieldLegend, FieldLabel, FieldDescription, FieldContent
  ```
- [ ] 0.2.3 Create `components/ui/input-group.tsx` — Enhanced input with addons
  ```
  InputGroup, InputGroupInput, InputGroupTextarea, InputGroupAddon, InputGroupButton
  ```
- [ ] 0.2.4 Create `components/ui/empty.tsx` — Empty state component
  ```
  Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent
  ```
- [ ] 0.2.5 Create `components/ui/kbd.tsx` — Keyboard shortcut display
- [ ] 0.2.6 Create `components/ui/spinner.tsx` — Loading spinner
- [ ] 0.2.7 Create `components/ui/native-select.tsx` — Native select element

### 0.3 Verification
- [ ] 0.3.1 Run `bun run build` — Ensure new components compile
- [ ] 0.3.2 Create simple test page to verify all new components render

---

## Phase 1: Theme & Branding Foundation (redesign-1)

### 1.1 Zinc Theme
- [ ] 1.1.1 Update `globals.css` `:root` with zinc color palette:
  ```css
  --background: #fafafa;
  --foreground: #18181b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --border: #e4e4e7;
  --accent: #ff385c; /* coral for CTAs */
  ```
- [ ] 1.1.2 Update `globals.css` dark mode (`.dark` or media query) with zinc dark:
  ```css
  --background: #09090b;
  --foreground: #fafafa;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --border: #27272a;
  ```
- [ ] 1.1.3 Update sidebar variables to match zinc theme
- [ ] 1.1.4 Run `bun run build` to verify theme compiles

### 1.2 Icon Logo
- [ ] 1.2.1 Update `brand.tsx` `Logo` component:
  - Replace "P" text box with Lucide `Home` icon
  - Icon in rounded container with zinc-900 background (light) / zinc-100 (dark)
  - Keep "Piol" text next to icon
- [ ] 1.2.2 Update `brand.tsx` `LogoIcon` component for icon-only usage
- [ ] 1.2.3 Update `app-sidebar.tsx` to use new LogoIcon
- [ ] 1.2.4 Update `header.tsx` to use new Logo

### 1.3 Favicon
- [ ] 1.3.1 Create favicon SVG: Home icon on zinc-900 rounded square background
- [ ] 1.3.2 Export favicon as `favicon.ico` (multi-size: 16x16, 32x32)
- [ ] 1.3.3 Export `apple-touch-icon.png` (180x180)
- [ ] 1.3.4 Place files in `apps/web/src/app/`
- [ ] 1.3.5 Update `app/layout.tsx` metadata with favicon references

### 1.4 Remove Hardcoded Colors
- [ ] 1.4.1 Search and replace `#FF385C` → `bg-accent` or `text-accent`
- [ ] 1.4.2 Search and replace `#E31C5F` → `hover:bg-accent/90`
- [ ] 1.4.3 Search and replace `bg-white` → `bg-background`
- [ ] 1.4.4 Search and replace `text-gray-*` → `text-muted-foreground`
- [ ] 1.4.5 Search and replace `bg-gray-*` → `bg-muted`
- [ ] 1.4.6 Search and replace `border-gray-*` → `border-border`
- [ ] 1.4.7 Verify: `rg "#FF385C|#E31C5F|bg-white|text-gray-" apps/web/src` returns only globals.css

### 1.5 Verification
- [ ] 1.5.1 Visual check: Logo displays correctly in header
- [ ] 1.5.2 Visual check: Favicon appears in browser tab
- [ ] 1.5.3 Visual check: Zinc theme applied to existing pages
- [ ] 1.5.4 Run `bun run build` — No errors

---

## Phase 2: Layout Components (redesign-2)

### 2.1 Public Layout Updates
- [ ] 2.1.1 Update `layouts/public-layout.tsx`:
  - Ensure consistent header/footer wrapping
  - Add `showFooter` prop (default true)
  - Container max-width: `max-w-7xl`
- [ ] 2.1.2 Update `header.tsx`:
  - Use new Logo component
  - Ensure zinc theme colors
  - Mobile: Use Drawer for menu (not Sheet if inconsistent)
- [ ] 2.1.3 Update `footer.tsx`:
  - Use new Logo component
  - Zinc theme colors
  - Clean link structure

### 2.2 Renter Dashboard Layout
- [ ] 2.2.1 Create `layouts/renter-dashboard-layout.tsx`:
  - Simple header with logo and user menu
  - Horizontal tab navigation (TabsList)
  - Tabs: Home, Saved, Messages, Payments, Settings
  - Content area below tabs
- [ ] 2.2.2 Create `components/dashboard-tabs.tsx`:
  - Reusable tab navigation component
  - Active state styling
  - Mobile: horizontally scrollable
- [ ] 2.2.3 Style renter header (simpler than public header)

### 2.3 Landlord Dashboard Layout
- [ ] 2.3.1 Update `app-sidebar.tsx`:
  - Use new LogoIcon
  - Zinc theme colors
  - Clean up navigation items
- [ ] 2.3.2 Update `site-header.tsx` for landlord:
  - Zinc theme
  - Consistent with renter header style
- [ ] 2.3.3 Update `nav-main.tsx`, `nav-secondary.tsx`, `nav-user.tsx`:
  - Zinc theme colors
  - Consistent icon sizing

### 2.4 Dashboard Layout Switcher
- [ ] 2.4.1 Update `app/dashboard/layout.tsx`:
  - Detect user role (renter vs landlord)
  - Render RenterDashboardLayout for renters
  - Render existing sidebar layout for landlords
- [ ] 2.4.2 Test role switching works correctly

### 2.5 Verification
- [ ] 2.5.1 Visual check: Public pages have consistent header/footer
- [ ] 2.5.2 Visual check: Renter dashboard shows tabs (no sidebar)
- [ ] 2.5.3 Visual check: Landlord dashboard shows sidebar
- [ ] 2.5.4 Test mobile: Both dashboards work on small screens
- [ ] 2.5.5 Run `bun run build` — No errors

---

## Phase 3: Messaging Components (redesign-3)

### 3.1 Conversation List Component
- [ ] 3.1.1 Create `components/messages/conversation-list.tsx`:
  - Uses ItemGroup for list container
  - Each conversation is an Item with:
    - ItemMedia: Avatar of other party
    - ItemContent: Name, last message preview (truncated), timestamp
    - ItemActions: Unread badge (if applicable)
  - Click navigates to thread
- [ ] 3.1.2 Create `components/messages/conversation-item.tsx`:
  - Individual conversation row
  - Highlight for unread
  - Active state for selected

### 3.2 Message Thread Component
- [ ] 3.2.1 Create `components/messages/message-thread.tsx`:
  - Scrollable message container
  - Auto-scroll to bottom on new messages
  - Property context card at top (optional)
- [ ] 3.2.2 Create `components/messages/message-bubble.tsx`:
  - Sent: Right-aligned, accent background
  - Received: Left-aligned, muted background
  - Timestamp below bubble
  - Avatar for received messages
- [ ] 3.2.3 Implement scroll-to-bottom behavior:
  - useRef for scroll container
  - useEffect to scroll on new messages

### 3.3 Message Composer Component
- [ ] 3.3.1 Create `components/messages/message-composer.tsx`:
  - Uses InputGroup with InputGroupTextarea
  - Send button (InputGroupButton) with SendIcon
  - Enter to send (with shift+enter for newline)
  - Disable send when empty
- [ ] 3.3.2 Handle form submission:
  - Call Convex mutation
  - Clear input on success
  - Show loading state

### 3.4 Empty States
- [ ] 3.4.1 Create `components/messages/empty-conversations.tsx`:
  - Uses Empty component
  - Icon: MessageSquare
  - Title: "No messages yet"
  - Description: "Start a conversation by contacting a landlord"
- [ ] 3.4.2 Create `components/messages/empty-thread.tsx`:
  - For when thread has no messages (shouldn't happen, but safety)

### 3.5 Verification
- [ ] 3.5.1 Component renders in isolation (storybook or test page)
- [ ] 3.5.2 Test with real Convex data on messages page
- [ ] 3.5.3 Test real-time: Send message from two tabs
- [ ] 3.5.4 Test mobile: Components work on small screens

---

## Phase 4: Public Pages Redesign (redesign-4)

### 4.1 Home Page (`/`)
- [ ] 4.1.1 Redesign hero section:
  - Clean typography (zinc colors)
  - Larger, centered search bar
  - Stats below search (subtle)
- [ ] 4.1.2 Redesign "Popular cities" section:
  - Card grid with city name + property count
  - Hover effect
- [ ] 4.1.3 Redesign "How it works" section:
  - Three steps with icons
  - Simpler, cleaner cards
- [ ] 4.1.4 Redesign "Featured properties" section:
  - Use updated PropertyCard
  - Grid layout
- [ ] 4.1.5 Redesign "Why Piol" features section:
  - Icon + title + description cards
  - Zinc theme
- [ ] 4.1.6 Redesign CTA section:
  - Accent background for coral pop
  - Clear buttons

### 4.2 Properties Page (`/properties`)
- [ ] 4.2.1 Create `components/property-map.tsx`:
  - Leaflet map component
  - Dynamic import with `ssr: false`
  - Cameroon-centered default view
- [ ] 4.2.2 Create price markers for map:
  - Small pill showing price
  - Highlight on hover
- [ ] 4.2.3 Implement split view layout:
  - Desktop: 50% list, 50% map
  - State for grid vs map view
- [ ] 4.2.4 Update filter bar:
  - Zinc theme
  - Use InputGroup for search
  - Category tabs below
- [ ] 4.2.5 Sync list hover with map:
  - Hover on card highlights marker
  - Click marker shows card
- [ ] 4.2.6 Mobile map view:
  - Full-screen map
  - Floating card at bottom (draggable sheet)
- [ ] 4.2.7 Add lazy loading for map component

### 4.3 Property Detail (`/properties/[id]`)
- [ ] 4.3.1 Redesign image gallery:
  - Full-width carousel (shadcn Carousel)
  - Thumbnail navigation
  - Lightbox on click
- [ ] 4.3.2 Redesign property info:
  - Title, price, location prominent
  - Amenities as badges
  - Description with proper typography
- [ ] 4.3.3 Redesign landlord contact section:
  - Card with landlord info
  - Message CTA button (accent color)
  - Verified badge if applicable
- [ ] 4.3.4 Add breadcrumb navigation
- [ ] 4.3.5 Mobile: Sticky bottom CTA bar
- [ ] 4.3.6 Add share button

### 4.4 Property Card Updates
- [ ] 4.4.1 Update `PropertyCard` component:
  - Cleaner design, zinc borders
  - Image carousel (if multiple images)
  - Price prominent
  - Location subtle
  - Save button (heart) with animation
- [ ] 4.4.2 Create horizontal variant for map split view
- [ ] 4.4.3 Update `PropertyCardSkeleton` to match new design

### 4.5 Verification
- [ ] 4.5.1 Visual check: Home page looks polished
- [ ] 4.5.2 Visual check: Properties page with map works
- [ ] 4.5.3 Visual check: Property detail page works
- [ ] 4.5.4 Test mobile: All public pages responsive
- [ ] 4.5.5 Run `bun run build` — No errors

---

## Phase 5: Renter Dashboard Pages (redesign-5)

### 5.1 Renter Home (`/dashboard` for renter)
- [ ] 5.1.1 Redesign greeting + stats:
  - Clean card layout
  - Stats: Saved properties, Unread messages, Recent views
- [ ] 5.1.2 Recent activity section:
  - List of recent property views
  - Use Item component
- [ ] 5.1.3 Quick actions:
  - Browse properties, View saved, Messages

### 5.2 Saved Properties (`/dashboard/saved`)
- [ ] 5.2.1 Property grid:
  - Use PropertyCard
  - Remove button on each card
- [ ] 5.2.2 Empty state:
  - Use Empty component
  - "No saved properties" message
  - CTA to browse

### 5.3 Messages (`/dashboard/messages`)
- [ ] 5.3.1 Integrate ConversationList component
- [ ] 5.3.2 Connect to Convex messages query
- [ ] 5.3.3 Empty state for no conversations
- [ ] 5.3.4 Mobile: Full-width conversation list

### 5.4 Message Thread (`/dashboard/messages/[id]`)
- [ ] 5.4.1 Integrate MessageThread component
- [ ] 5.4.2 Integrate MessageComposer component
- [ ] 5.4.3 Property context at top
- [ ] 5.4.4 Back button to conversation list
- [ ] 5.4.5 Connect to Convex mutations

### 5.5 Payments (`/dashboard/payments`)
- [ ] 5.5.1 Payment history table:
  - Use Table component
  - Columns: Date, Property, Amount, Status
  - Status badges (paid, pending, failed)
- [ ] 5.5.2 Empty state for no payments
- [ ] 5.5.3 Filter by status (optional)

### 5.6 Settings (`/dashboard/settings`)
- [ ] 5.6.1 Profile form:
  - Use Field/FieldGroup components
  - Name, email, phone fields
- [ ] 5.6.2 Preferences section:
  - Language preference
  - Notification settings
- [ ] 5.6.3 Save button with loading state

### 5.7 Verification
- [ ] 5.7.1 Test full renter flow: Browse → Save → Message → Pay
- [ ] 5.7.2 Visual check: All renter pages consistent
- [ ] 5.7.3 Test mobile: All pages work on small screens
- [ ] 5.7.4 Run `bun run build` — No errors

---

## Phase 6: Landlord Dashboard Pages (redesign-6)

### 6.1 Landlord Home (`/dashboard` for landlord)
- [ ] 6.1.1 Revenue stats cards:
  - Total revenue, This month, Properties listed
- [ ] 6.1.2 Recent transactions table:
  - Use Table component
  - Property image, tenant, amount, date
- [ ] 6.1.3 Quick actions:
  - Add property, View messages

### 6.2 Properties List (`/dashboard/properties`)
- [ ] 6.2.1 Property list/table:
  - Property image, title, status, views, messages
  - Status badges (active, pending, draft)
- [ ] 6.2.2 Add property button (prominent)
- [ ] 6.2.3 Empty state for no properties
- [ ] 6.2.4 Filter by status

### 6.3 New Property (`/dashboard/properties/new`)
- [ ] 6.3.1 Multi-step form:
  - Step 1: Basic info (title, type, price)
  - Step 2: Location (city, neighborhood, address)
  - Step 3: Details (bedrooms, bathrooms, amenities)
  - Step 4: Images (upload)
- [ ] 6.3.2 Use FieldSet for step grouping
- [ ] 6.3.3 Progress indicator
- [ ] 6.3.4 Save draft functionality
- [ ] 6.3.5 Submit for verification

### 6.4 Property Edit (`/dashboard/properties/[id]`)
- [ ] 6.4.1 Same form as new, pre-filled
- [ ] 6.4.2 Status indicator
- [ ] 6.4.3 Delete property option

### 6.5 Messages (`/dashboard/messages`)
- [ ] 6.5.1 Integrate ConversationList (same as renter)
- [ ] 6.5.2 Show property context in conversation list
- [ ] 6.5.3 Badge for property name

### 6.6 Message Thread (`/dashboard/messages/[id]`)
- [ ] 6.6.1 Same as renter thread
- [ ] 6.6.2 Property context card prominent

### 6.7 Settings (`/dashboard/settings`)
- [ ] 6.7.1 Profile form (same as renter)
- [ ] 6.7.2 Business settings:
  - Phone number for display
  - Response time preference
- [ ] 6.7.3 Notification preferences

### 6.8 Sidebar Polish
- [ ] 6.8.1 Ensure all nav items have correct icons
- [ ] 6.8.2 Active state styling
- [ ] 6.8.3 Collapse behavior on mobile

### 6.9 Verification
- [ ] 6.9.1 Test full landlord flow: Add property → Receive message → Respond
- [ ] 6.9.2 Visual check: All landlord pages consistent
- [ ] 6.9.3 Test mobile: Sidebar collapses, pages work
- [ ] 6.9.4 Run `bun run build` — No errors

---

## Phase 7: Static & Auth Pages (redesign-7)

### 7.1 About Page (`/about`)
- [ ] 7.1.1 Hero with company mission
- [ ] 7.1.2 Story section
- [ ] 7.1.3 Team section (if applicable, or placeholder)
- [ ] 7.1.4 Values/features section
- [ ] 7.1.5 CTA to browse properties

### 7.2 Contact Page (`/contact`)
- [ ] 7.2.1 Contact form:
  - Use Field/FieldGroup
  - Name, email, subject, message
- [ ] 7.2.2 Contact info sidebar:
  - Email, phone, address
- [ ] 7.2.3 Map (optional, static image or Leaflet)

### 7.3 Terms Page (`/terms`)
- [ ] 7.3.1 Clean typography
- [ ] 7.3.2 Table of contents (anchor links)
- [ ] 7.3.3 Section headings
- [ ] 7.3.4 Last updated date

### 7.4 Privacy Page (`/privacy`)
- [ ] 7.4.1 Same structure as terms
- [ ] 7.4.2 Clean typography
- [ ] 7.4.3 Section headings

### 7.5 Auth Pages
- [ ] 7.5.1 Style `/sign-in` Clerk component:
  - Zinc theme colors
  - Centered card layout
- [ ] 7.5.2 Style `/sign-up` Clerk component:
  - Same styling
- [ ] 7.5.3 Auth layout: Simple header with logo only

### 7.6 Onboarding Page (`/dashboard/onboarding`)
- [ ] 7.6.1 Role selection (if applicable)
- [ ] 7.6.2 Profile completion form
- [ ] 7.6.3 Use FieldGroup/FieldSet

### 7.7 Verification
- [ ] 7.7.1 Visual check: All static pages look consistent
- [ ] 7.7.2 Visual check: Auth pages styled correctly
- [ ] 7.7.3 Test mobile: All pages responsive
- [ ] 7.7.4 Run `bun run build` — No errors

---

## Phase 8: Final Polish & Testing (redesign-8)

### 8.1 Loading States
- [ ] 8.1.1 Verify all pages have proper loading skeletons
- [ ] 8.1.2 Update skeletons to match new designs
- [ ] 8.1.3 Add Spinner component where needed

### 8.2 Empty States
- [ ] 8.2.1 Verify all lists have empty states
- [ ] 8.2.2 Empty states use Empty component consistently
- [ ] 8.2.3 All empty states have actionable CTAs

### 8.3 Error Boundaries
- [ ] 8.3.1 Add error boundary to dashboard layout
- [ ] 8.3.2 Add error boundary to property pages
- [ ] 8.3.3 Create user-friendly error UI

### 8.4 Code Cleanup
- [ ] 8.4.1 Run `bunx biome check --write .`
- [ ] 8.4.2 Remove console.log statements
- [ ] 8.4.3 Remove unused imports
- [ ] 8.4.4 Remove duplicate components (e.g., old PropertyCard if exists)

### 8.5 Build & Lint
- [ ] 8.5.1 Run `bun run lint` — No errors
- [ ] 8.5.2 Run `bun run build` — Successful
- [ ] 8.5.3 Run `bun run test` — All pass (update tests if needed)

### 8.6 Cross-Browser Testing
- [ ] 8.6.1 Test Chrome (desktop + mobile)
- [ ] 8.6.2 Test Safari (desktop + mobile)
- [ ] 8.6.3 Test Firefox (desktop)

### 8.7 Responsive Testing
- [ ] 8.7.1 Test at 375px (mobile)
- [ ] 8.7.2 Test at 768px (tablet)
- [ ] 8.7.3 Test at 1440px (desktop)
- [ ] 8.7.4 Test at 1920px (large desktop)

### 8.8 Lighthouse Audit
- [ ] 8.8.1 Home page: Target 90+ performance, 95+ accessibility
- [ ] 8.8.2 Properties page: Check map doesn't kill performance
- [ ] 8.8.3 Fix any accessibility issues flagged

### 8.9 Documentation
- [ ] 8.9.1 Update component docs if needed
- [ ] 8.9.2 Screenshot key pages for PR

### 8.10 Create PR
- [ ] 8.10.1 Stage all changes: `git add .`
- [ ] 8.10.2 Commit: `git commit -m "feat(web): complete UI redesign with zinc theme"`
- [ ] 8.10.3 Push: `git push -u origin HEAD`
- [ ] 8.10.4 Create PR with:
  - Summary of changes
  - Screenshots of key pages
  - Testing checklist
- [ ] 8.10.5 Update `agent/progress.md` with completion notes

---

## Dependencies & Parallelization

### Sequential Dependencies
```
Phase 0 → Phase 1 → Phase 2 → (Phases 3-7 in parallel) → Phase 8
```

### Parallel Work (after Phase 2 complete)
- **Phase 3** (Messaging) can run independently
- **Phase 4** (Public pages) can run independently
- **Phase 5** (Renter dashboard) requires Phase 3 messaging components
- **Phase 6** (Landlord dashboard) requires Phase 3 messaging components
- **Phase 7** (Static pages) can run independently

### Suggested Execution Order
1. Phase 0: Setup (1 session)
2. Phase 1: Theme & Branding (1 session)
3. Phase 2: Layout Components (1 session)
4. Phase 3: Messaging Components (1 session)
5. Phase 4: Public Pages (1-2 sessions)
6. Phase 5 + 6: Dashboard Pages (2 sessions, can interleave)
7. Phase 7: Static Pages (1 session)
8. Phase 8: Polish & Testing (1 session)

**Estimated total: 8-10 work sessions**
