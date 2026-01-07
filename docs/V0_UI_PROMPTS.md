# Piol — v0.app UI Prompts

> Comprehensive prompts for generating the Piol (Cameroon Housing Marketplace) UI using v0.dev
> 
> **Tech Stack:** Next.js 16, shadcn/ui, Tailwind CSS, TypeScript
> **Languages:** French (primary), English
> **Currency:** XAF (FCFA)
> **Target:** Cameroon market (Yaoundé, Douala, etc.)

---

## 🎨 Design System Context

Include this context at the start of your v0 session to maintain consistency:

```
I'm building Piol, a housing marketplace for Cameroon. 

Design system:
- Primary color: Emerald green (#10b981)
- Secondary color: Slate gray
- Font: Geist Sans (system fallback)
- Border radius: rounded-lg (8px) for cards, rounded-md for buttons
- Shadows: subtle, using shadow-sm and shadow-md
- Dark mode: supported

Tech stack:
- Next.js 16 App Router
- shadcn/ui components
- Tailwind CSS
- TypeScript
- Lucide React icons

Content:
- Bilingual: French (primary) and English
- Currency: FCFA (XAF) - format as "150 000 FCFA"
- Cities: Yaoundé, Douala, Bafoussam, Bamenda, Garoua
- Property types: Studio, 1 chambre, 2 chambres, 3 chambres, 4+ chambres, Maison, Appartement, Villa
```

---

## 📄 Page Prompts

### 1. Landing Page (Homepage)

```
Create a landing page for Piol, a Cameroon housing rental marketplace.

**Hero Section:**
- Full-width hero with gradient overlay on background image (modern African apartment)
- Large headline: "Trouvez votre logement idéal au Cameroun"
- Subheadline: "Des milliers d'appartements et maisons vérifiés à Yaoundé, Douala et partout au Cameroun"
- Search bar with:
  - City dropdown (Yaoundé, Douala, Bafoussam, Bamenda, Garoua, Toutes les villes)
  - Property type dropdown (Studio, 1 chambre, 2 chambres, etc.)
  - Price range (Budget) dropdown
  - Search button (primary emerald green)
- Stats below search: "2,500+ propriétés" | "1,200+ propriétaires vérifiés" | "10,000+ locataires satisfaits"

**How It Works Section:**
- 3-step process with icons:
  1. Recherchez (Search icon) - "Parcourez des milliers de propriétés vérifiées"
  2. Visitez (Eye icon) - "Planifiez des visites avec les propriétaires"
  3. Emménagez (Home icon) - "Payez en toute sécurité et emménagez"

**Featured Properties Section:**
- Section title: "Propriétés populaires"
- Grid of 6 property cards (3 columns desktop, 1 mobile)
- Each card shows: image, title, price (FCFA/mois), location, bedrooms badge, verified badge
- "Voir toutes les propriétés" link button

**Why Piol Section:**
- 4 feature cards in grid:
  1. "Propriétés vérifiées" - Shield icon - "Chaque propriété est visitée et vérifiée par notre équipe"
  2. "Paiements sécurisés" - Lock icon - "Payez via MTN MoMo ou Orange Money en toute confiance"
  3. "Zéro arnaque" - CheckCircle icon - "Fini les faux bailleurs et les arnaques"
  4. "Support local" - HeadphonesIcon - "Une équipe basée au Cameroun à votre service"

**Cities Section:**
- "Explorez par ville"
- 4 city cards with background images: Yaoundé, Douala, Bafoussam, Bamenda
- Each shows city name and property count

**CTA Section:**
- Split layout:
  - Left: "Vous êtes propriétaire?" 
  - "Publiez votre propriété gratuitement et trouvez des locataires fiables"
  - Button: "Publier une annonce"
  - Right: Illustration of a landlord

**Footer:**
- Logo and tagline
- Links: Propriétés, À propos, Contact, Aide
- Legal: Conditions d'utilisation, Politique de confidentialité
- Social: Facebook, Instagram, Twitter, WhatsApp
- Copyright: © 2026 Piol. Tous droits réservés.

**Style:**
- Clean, modern, trustworthy aesthetic
- Emerald green primary buttons
- White/light gray backgrounds with subtle shadows on cards
- Mobile responsive with hamburger menu
- Sticky header with logo, navigation, language toggle (FR/EN), and Sign in/Sign up buttons
```

---

### 2. Property Listing Page

```
Create a property listing page for Piol housing marketplace.

**Header:**
- Sticky header with: Logo, Navigation (Propriétés, À propos, Contact), Language toggle (FR/EN), Sign in button, "Publier" button (primary)

**Search & Filters Bar:**
- Sticky below header on scroll
- Search input with location icon: "Rechercher par ville, quartier..."
- Filter buttons that open sheets/dropdowns:
  - Ville (City) - multi-select dropdown
  - Type de bien - checkboxes (Studio, 1 chambre, 2 chambres, etc.)
  - Prix - range slider (0 - 500,000 FCFA)
  - Plus de filtres - opens sheet with:
    - Équipements: WiFi, Parking, Climatisation, Gardien, Meublé, Balcon
    - Disponibilité: Immédiate, Dans 1 mois, Dans 3 mois
- Active filters shown as removable badges
- Results count: "124 propriétés trouvées"
- Sort dropdown: "Trier par: Plus récents" (options: Plus récents, Prix croissant, Prix décroissant)

**Property Grid:**
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Property cards with:
  - Image carousel (dots indicator) - 16:9 aspect ratio
  - Heart/save icon (top right of image)
  - "Vérifié" badge (green, top left) if verified
  - Title (truncate 2 lines): "Appartement moderne 2 chambres à Bastos"
  - Price: "150 000 FCFA/mois" (prominent, emerald color)
  - Location with pin icon: "Bastos, Yaoundé"
  - Features row: "2 chambres • 1 SDB • Meublé"
  - Amenity badges (max 3): WiFi, Parking, Clim
  - Posted date: "Publié il y a 2 jours"
  - Card is fully clickable, navigates to /properties/[id]

**Empty State:**
- Illustration of empty search
- "Aucune propriété trouvée"
- "Essayez de modifier vos filtres ou d'élargir votre recherche"
- Button: "Réinitialiser les filtres"

**Loading State:**
- Skeleton cards matching the card layout
- Shimmer animation

**Pagination:**
- Bottom of page
- "Page 1 sur 12" with Previous/Next buttons
- Or infinite scroll with "Charger plus" button

**Mobile Specific:**
- Filters button opens full-screen sheet
- Map toggle button (shows map view with markers)
- Bottom padding for safe area
```

---

### 3. Property Detail Page

```
Create a property detail page for Piol housing marketplace.

**Breadcrumb:**
- "Accueil > Propriétés > Yaoundé > Bastos > Appartement moderne 2 chambres"

**Image Gallery:**
- Main large image (16:9)
- Thumbnail grid below (4 images visible + "+5 photos" overlay on last)
- Clicking opens fullscreen lightbox gallery
- Mobile: horizontal swipeable carousel with dots

**Property Header:**
- Title: "Appartement moderne 2 chambres à Bastos"
- "Vérifié" badge with checkmark (green)
- Location with icon: "Bastos, Yaoundé, Cameroun"
- Listed date: "Publié le 15 janvier 2026"

**Price Card (sticky on desktop, fixed bottom on mobile):**
- Card with shadow
- Price: "150 000 FCFA/mois" (large, emerald)
- Caution: "Caution: 2 mois (300 000 FCFA)"
- Avance: "Avance: 6 mois (900 000 FCFA)"
- Primary button: "Contacter le propriétaire"
- Secondary button: "Planifier une visite"
- Save/favorite button with heart icon
- Share button

**Property Details Section:**
- Grid of key details with icons:
  - Type: Appartement
  - Chambres: 2
  - Salles de bain: 1
  - Surface: 75 m²
  - Étage: 2ème étage
  - Disponibilité: Immédiate

**Description Section:**
- Heading: "Description"
- Full text description (expandable if long)
- Sample: "Magnifique appartement de 2 chambres situé dans le quartier prisé de Bastos. Entièrement meublé et équipé, il dispose d'une cuisine moderne, d'un salon spacieux et d'une terrasse avec vue. Idéal pour un couple ou un jeune professionnel."

**Amenities Section:**
- Heading: "Équipements"
- Grid of amenities with icons and labels:
  - ✓ WiFi inclus
  - ✓ Parking privé
  - ✓ Climatisation
  - ✓ Gardien 24h/24
  - ✓ Eau courante
  - ✓ Électricité stable
  - ✓ Meublé
  - ✓ Balcon/Terrasse
- Show in 2 columns, green checkmarks

**Location Section:**
- Heading: "Localisation"
- Static map placeholder (or integrate real map later)
- Neighborhood: "Bastos"
- City: "Yaoundé"
- Nearby: "À 5 min de l'ambassade de France, 10 min du centre-ville"

**Landlord Section:**
- Heading: "Propriétaire"
- Card with:
  - Avatar (or initials)
  - Name: "Marie K."
  - "Identité vérifiée" badge
  - "Membre depuis 2024"
  - Rating: 4.8/5 (12 avis)
  - Response time: "Répond généralement en 2h"
  - Button: "Voir le profil"

**Reviews Section:**
- Heading: "Avis des locataires" with count
- Average rating: 4.8/5 stars
- List of reviews:
  - Reviewer avatar + name
  - Star rating
  - Date
  - Comment text
  - "Locataire vérifié" badge
- "Voir tous les avis" link if more than 3

**Similar Properties Section:**
- Heading: "Propriétés similaires"
- Horizontal scrollable row of 4 property cards
- Same card design as listing page

**Mobile Adaptations:**
- Image gallery as full-width carousel
- Sticky bottom bar with price and "Contacter" button
- Collapsible sections with accordions
- Back button in header
```

---

### 4. Dashboard Layout (Shell)

```
Create a dashboard layout shell for Piol that works for all user roles (renter, landlord, admin, verifier).

**Sidebar (Desktop):**
- Fixed left sidebar, 256px wide
- Logo at top with link to home
- User section:
  - Avatar
  - Name: "Marie Kamga"
  - Role badge: "Propriétaire" (or Locataire, Admin, Vérificateur)
  - Email truncated
- Navigation sections with icons:
  
  For Renter:
  - Tableau de bord (Home icon)
  - Mes favoris (Heart icon)
  - Messages (MessageSquare icon) with unread badge
  - Paiements (CreditCard icon)
  - Notifications (Bell icon) with unread badge
  - Paramètres (Settings icon)
  
  For Landlord:
  - Tableau de bord (Home icon)
  - Mes propriétés (Building icon)
  - Messages (MessageSquare icon) with unread badge
  - Paiements (CreditCard icon)
  - Avis (Star icon)
  - Notifications (Bell icon)
  - Paramètres (Settings icon)
  
  For Admin:
  - Tableau de bord (Home icon)
  - Utilisateurs (Users icon)
  - Propriétés (Building icon)
  - Transactions (Receipt icon)
  - Vérifications (ShieldCheck icon)
  - Rapports (BarChart icon)
  - Paramètres (Settings icon)
  
  For Verifier:
  - Tableau de bord (Home icon)
  - Vérifications en attente (Clock icon) with count badge
  - Mes vérifications (CheckCircle icon)
  - Paramètres (Settings icon)

- Bottom: Logout button with LogOut icon
- Collapsible on medium screens (icons only)

**Header (Top bar):**
- Breadcrumb: "Tableau de bord > Mes propriétés"
- Right side:
  - Search input (optional)
  - Notification bell with badge
  - User dropdown menu (Profile, Settings, Logout)
- Mobile: Hamburger menu button (opens sidebar as sheet)

**Main Content Area:**
- Padding: p-6
- Max width container
- Scrollable
- Background: slightly off-white (bg-gray-50 or bg-slate-50)

**Mobile:**
- No sidebar visible by default
- Hamburger menu in header opens sidebar as slide-over sheet
- Bottom navigation bar with main 4 items:
  - Accueil, Propriétés/Favoris, Messages, Profil

**Style:**
- Clean, minimal dashboard aesthetic
- Sidebar: white background, subtle border-right
- Active nav item: emerald background, white text
- Hover states on all nav items
- Smooth transitions
```

---

### 5. Renter Dashboard Home

```
Create a renter dashboard home page for Piol.

**Page Header:**
- "Bonjour, Jean 👋"
- "Voici un résumé de votre activité"

**Quick Stats Cards (Grid of 3):**
- Card 1: "Propriétés sauvegardées" - Icon: Heart - Count: "12" - Link: "Voir tout →"
- Card 2: "Messages non lus" - Icon: MessageSquare - Count: "3" - Link: "Voir tout →"
- Card 3: "Paiements en cours" - Icon: Clock - Count: "1" - Link: "Voir tout →"

**Recent Activity Section:**
- Heading: "Activité récente"
- Timeline list:
  - "Vous avez sauvegardé 'Appartement 2 chambres à Bastos'" - il y a 2h
  - "Nouveau message de Marie K." - il y a 5h
  - "Paiement confirmé pour 'Studio meublé Akwa'" - hier
- "Voir toute l'activité" link

**Saved Properties Preview:**
- Heading: "Vos propriétés favorites" with heart icon
- Horizontal scrollable row of 4 property cards (compact version)
- Each card: image, title, price, location
- "Voir tous les favoris →" link

**Recommended Properties:**
- Heading: "Recommandé pour vous"
- Subtext: "Basé sur vos recherches récentes"
- Grid of 3 property cards
- "Explorer plus →" link

**Quick Actions:**
- Card with title "Actions rapides"
- Button grid:
  - "Rechercher un logement" (Search icon)
  - "Voir mes messages" (Message icon)
  - "Gérer mes paiements" (CreditCard icon)
  - "Modifier mon profil" (User icon)

**Style:**
- Welcome section with slight gradient background
- Cards with consistent shadows
- Emerald accents on important numbers and links
```

---

### 6. Landlord Dashboard Home

```
Create a landlord dashboard home page for Piol.

**Page Header:**
- "Bonjour, Marie 👋"
- "Voici un aperçu de vos propriétés"

**Key Metrics Cards (Grid of 4):**
- Card 1: "Propriétés actives" - Icon: Building - Count: "5" - Trend: "+1 ce mois"
- Card 2: "Vues totales" - Icon: Eye - Count: "1,234" - Trend: "+12% vs mois dernier"
- Card 3: "Messages reçus" - Icon: MessageSquare - Count: "8" - Badge: "3 non lus"
- Card 4: "Revenus du mois" - Icon: Wallet - Amount: "450 000 FCFA" - Trend: "+25%"

**Properties Overview:**
- Heading: "Mes propriétés"
- Tabs: "Actives (5)" | "En attente (2)" | "Brouillons (1)"
- Table or card list:
  - Property image thumbnail
  - Title
  - Location
  - Price
  - Status badge (Active/Pending/Draft)
  - Views count
  - Inquiries count
  - Actions dropdown (Edit, Pause, Delete)
- "Ajouter une propriété" button (primary)
- "Voir toutes mes propriétés →" link

**Recent Messages:**
- Heading: "Messages récents"
- List of 3 conversations:
  - Avatar + Name
  - Property name (context)
  - Last message preview (truncated)
  - Time ago
  - Unread indicator dot
- "Voir tous les messages →" link

**Recent Payments:**
- Heading: "Derniers paiements reçus"
- Table with:
  - Date
  - Locataire (Tenant name)
  - Propriété
  - Montant
  - Statut (badge: Completed, Pending, In Escrow)
- "Voir tous les paiements →" link

**Performance Chart:**
- Heading: "Vues sur 30 jours"
- Simple area chart showing property views over time
- Using Recharts or similar

**Quick Actions:**
- Floating action button or card:
  - "Publier une nouvelle propriété"
  - "Répondre aux messages"
  - "Voir les statistiques"

**Alerts/Notifications Banner:**
- If there are pending verifications or issues:
- Yellow warning card: "2 propriétés en attente de vérification"
- Link: "Voir le statut →"
```

---

### 7. Property Management Page (Landlord)

```
Create a property management page for landlords on Piol.

**Page Header:**
- Title: "Mes propriétés"
- Subtitle: "Gérez vos annonces et suivez leurs performances"
- Primary button: "+ Nouvelle propriété"

**Filters & Search:**
- Search input: "Rechercher une propriété..."
- Status filter tabs: "Toutes (8)" | "Actives (5)" | "En attente (2)" | "Brouillons (1)" | "Archivées (0)"
- Sort dropdown: "Trier par: Date de création"

**Properties List:**
- Card-based list (not table) for better mobile UX
- Each property card shows:
  - Left: Image thumbnail (square, 80x80)
  - Middle:
    - Title: "Appartement 2 chambres à Bastos"
    - Location: "Bastos, Yaoundé"
    - Price: "150 000 FCFA/mois"
    - Created: "Créé le 15 jan 2026"
  - Right:
    - Status badge with appropriate color:
      - "Active" (green)
      - "En attente de vérification" (yellow)
      - "Brouillon" (gray)
      - "Archivée" (red)
    - Stats: "👁 234 vues • 💬 12 demandes"
  - Actions (three-dot menu or buttons):
    - "Modifier" (Edit icon)
    - "Voir l'annonce" (Eye icon)
    - "Dupliquer" (Copy icon)
    - "Archiver" / "Désarchiver"
    - "Supprimer" (red, with confirmation)

**Empty State (if no properties):**
- Illustration
- "Vous n'avez pas encore de propriétés"
- "Commencez par publier votre première annonce"
- Primary button: "Publier une propriété"

**Pagination:**
- Bottom of list
- "Affichage de 1-10 sur 8 propriétés"
- Page numbers or load more

**Mobile:**
- Stack cards vertically
- Swipe actions for quick edit/delete
- Floating "+" button for new property
```

---

### 8. Create/Edit Property Form

```
Create a multi-step property creation form for Piol landlords.

**Progress Indicator:**
- Horizontal stepper showing: 
  1. Informations de base (checkmark when complete)
  2. Détails & équipements
  3. Photos
  4. Prix & disponibilité
  5. Aperçu & publication

**Step 1: Informations de base**
- Title input: "Titre de l'annonce *" - placeholder: "Ex: Appartement moderne 2 chambres à Bastos"
- Property type select *: Studio, 1 chambre, 2 chambres, 3 chambres, 4+ chambres, Maison, Villa, Appartement
- Description textarea *: "Description détaillée" - placeholder: "Décrivez votre propriété..." - character count
- City select *: Yaoundé, Douala, Bafoussam, etc.
- Neighborhood input *: "Quartier" - with autocomplete suggestions
- Address input: "Adresse complète (optionnel)"
- Buttons: "Annuler" (ghost), "Suivant" (primary)

**Step 2: Détails & équipements**
- Number inputs:
  - Chambres * (number spinner)
  - Salles de bain *
  - Surface en m² (optional)
  - Étage (optional)
- Amenities checkboxes (grid of toggles):
  - WiFi inclus
  - Parking
  - Climatisation (AC)
  - Gardien / Sécurité
  - Eau 24h/24
  - Électricité stable
  - Meublé
  - Balcon / Terrasse
  - Jardin
- Buttons: "Précédent" (outline), "Suivant" (primary)

**Step 3: Photos**
- Drag & drop zone: "Glissez vos photos ici ou cliquez pour sélectionner"
- Supported formats note: "JPG, PNG, max 5MB par image"
- Min 3 photos, max 15
- Uploaded images grid:
  - Thumbnail preview
  - Drag to reorder (first = cover)
  - Delete button (X)
  - Star to set as cover
- Progress bar for uploads
- Buttons: "Précédent", "Suivant"

**Step 4: Prix & disponibilité**
- Price input *: "Loyer mensuel (FCFA)" - number with thousand separators
- Caution months select: 1 mois, 2 mois, 3 mois - default 2
- Advance months select: 1 mois, 3 mois, 6 mois, 12 mois - default 6
- Total upfront calculation display: "Total à l'entrée: 1 200 000 FCFA"
- Availability select *: Immédiate, Dans 1 mois, Dans 3 mois, Date spécifique
- Date picker (if specific date selected)
- Buttons: "Précédent", "Suivant"

**Step 5: Aperçu & publication**
- Full preview card showing how listing will appear
- Checklist:
  - ✓ Informations complètes
  - ✓ Au moins 3 photos
  - ✓ Prix défini
- Terms checkbox: "J'accepte les conditions de publication"
- Info note: "Votre annonce sera vérifiée par notre équipe avant publication (24-48h)"
- Buttons: "Précédent", "Enregistrer comme brouillon" (outline), "Soumettre pour vérification" (primary)

**Validation:**
- Inline error messages below fields
- Red border on invalid fields
- Toast notifications for success/error

**Autosave:**
- "Brouillon enregistré" indicator
- Auto-save every 30 seconds
```

---

### 9. Messages/Inbox Page

```
Create a messaging inbox page for Piol.

**Layout:**
- Split view on desktop: conversation list (left, 320px) + message thread (right, flexible)
- Mobile: list view, clicking opens thread full-screen

**Conversation List (Left Panel):**
- Header: "Messages" with count badge
- Search input: "Rechercher une conversation..."
- Filter tabs: "Tous" | "Non lus (3)"
- Conversation items:
  - Avatar of other participant
  - Name: "Marie Kamga"
  - Property context (small text): "Appartement 2 chambres à Bastos"
  - Last message preview (truncated, 1 line)
  - Time: "il y a 2h" or "15 jan"
  - Unread indicator (blue dot)
  - Selected state (highlighted background)
- Sort by most recent

**Message Thread (Right Panel):**
- Header:
  - Back button (mobile only)
  - Avatar + Name of contact
  - Property link: "Concernant: Appartement 2 chambres à Bastos →"
  - Options menu (three dots): "Voir le profil", "Signaler"
  
- Messages area:
  - Scrollable
  - Messages grouped by date: "Aujourd'hui", "Hier", "15 janvier 2026"
  - Sent messages: right-aligned, emerald background, white text
  - Received messages: left-aligned, gray background
  - Each message shows:
    - Text content
    - Timestamp: "14:32"
    - Read receipt (double check) for sent messages
  - Typing indicator: "Marie écrit..."

- Input area (bottom):
  - Text input with placeholder: "Écrivez votre message..."
  - Attachment button (paperclip icon) - optional
  - Send button (primary, arrow icon)
  - Press Enter to send

**Empty State (no messages):**
- Illustration
- "Aucun message pour le moment"
- "Commencez à discuter avec des propriétaires en visitant leurs annonces"
- Button: "Explorer les propriétés"

**Empty Thread State:**
- "Sélectionnez une conversation"
- Or: "Commencez une nouvelle conversation"

**Mobile Adaptations:**
- Full screen list view
- Tapping conversation navigates to full-screen thread
- Back button returns to list
- Input sticks to bottom with keyboard handling
```

---

### 10. Payments Page

```
Create a payments page for Piol (works for both renter and landlord views).

**Page Header:**
- Title: "Paiements"
- Subtitle (Renter): "Gérez vos paiements de loyer"
- Subtitle (Landlord): "Suivez vos revenus locatifs"

**Summary Cards (Renter view - Grid of 3):**
- Card 1: "À payer" - Amount: "150 000 FCFA" - Status indicator
- Card 2: "En attente" - Amount: "0 FCFA" - In processing
- Card 3: "Payé ce mois" - Amount: "150 000 FCFA"

**Summary Cards (Landlord view - Grid of 3):**
- Card 1: "Revenus du mois" - Amount: "450 000 FCFA" - Trend: "+12%"
- Card 2: "En séquestre" - Amount: "150 000 FCFA" - Info tooltip
- Card 3: "Libéré ce mois" - Amount: "300 000 FCFA"

**Make Payment Section (Renter only):**
- Card with:
  - Property: "Appartement 2 chambres à Bastos"
  - Amount due: "150 000 FCFA"
  - Due date: "Échéance: 1er février 2026"
  - Payment method selection:
    - Radio: MTN Mobile Money (with logo)
    - Radio: Orange Money (with logo)
  - Phone number input (pre-filled from profile)
  - Primary button: "Payer maintenant"
  - Note: "Vous recevrez une notification sur votre téléphone pour confirmer"

**Transaction History:**
- Heading: "Historique des transactions"
- Filter tabs: "Tous" | "Complétés" | "En attente" | "Échoués"
- Date range picker (optional)

- Transaction list/table:
  - Date: "15 jan 2026"
  - Description: "Loyer - Appartement Bastos"
  - Amount: "150 000 FCFA"
  - Payment method icon: MTN or Orange
  - Status badge:
    - "Complété" (green)
    - "En attente" (yellow)
    - "Échoué" (red)
    - "En séquestre" (blue)
    - "Libéré" (emerald)
  - Reference: "TXN-ABC123"
  - Actions: "Voir détails" link

**Transaction Detail Modal:**
- On clicking a transaction, show modal with:
  - Full details
  - Property info
  - Payment method
  - Timeline of status changes
  - Download receipt button (if completed)
  - Retry button (if failed)

**Empty State:**
- "Aucune transaction pour le moment"
- For renter: "Vos paiements de loyer apparaîtront ici"
- For landlord: "Vos revenus locatifs apparaîtront ici"

**Mobile:**
- Cards stack vertically
- Transaction list as cards instead of table
- Sticky "Payer" button at bottom for renter
```

---

### 11. Settings Page

```
Create a settings/profile page for Piol.

**Page Header:**
- Title: "Paramètres"
- Subtitle: "Gérez votre compte et vos préférences"

**Navigation Tabs (vertical on desktop, horizontal on mobile):**
- Profil
- Sécurité
- Notifications
- Paiement (for landlord: payout info)
- Langue
- Aide

**Profile Section:**
- Profile photo:
  - Current avatar (large, 100px)
  - "Changer la photo" button
  - "Supprimer" link
- Form fields:
  - Prénom *
  - Nom *
  - Email (read-only, from Clerk)
  - Téléphone * (with country code +237)
  - Bio (textarea, optional): "Présentez-vous brièvement"
- ID Verification status:
  - Not verified: "Non vérifié" badge + "Vérifier mon identité" button
  - Pending: "En cours de vérification" badge
  - Verified: "Identité vérifiée ✓" green badge
- Save button: "Enregistrer les modifications"

**Security Section:**
- Change password link (redirects to Clerk)
- Two-factor authentication toggle
- Active sessions list:
  - Device + browser
  - Location
  - Last active
  - "Déconnecter" button
- "Déconnecter de tous les appareils" button

**Notifications Section:**
- Toggle switches with descriptions:
  - "Nouveaux messages" - "Recevoir une notification pour chaque nouveau message"
  - "Demandes de visite" - "Quand quelqu'un demande à visiter une propriété"
  - "Paiements" - "Confirmations et rappels de paiement"
  - "Nouvelles propriétés" - "Alertes pour les propriétés correspondant à vos critères"
  - "Newsletter" - "Actualités et conseils de Piol"
- Notification method:
  - Email toggle
  - SMS toggle
  - Push notifications toggle

**Payment/Payout Section (Landlord):**
- Title: "Informations de paiement"
- Current payout method:
  - Display: "MTN MoMo - 6XX XXX XXX"
  - "Modifier" button
- Add/edit payout method:
  - Select: MTN Mobile Money / Orange Money
  - Phone number input
  - Name on account
- "Sauvegarder" button

**Language Section:**
- Radio buttons:
  - Français (selected by default)
  - English
- Auto-saves on selection

**Help Section:**
- FAQ links
- Contact support button
- Report a problem link

**Danger Zone:**
- Red bordered section
- "Supprimer mon compte" - with confirmation dialog
- Warning text about data deletion
```

---

### 12. Admin Dashboard

```
Create an admin dashboard home page for Piol.

**Page Header:**
- Title: "Tableau de bord administrateur"
- Date range selector: "7 derniers jours" dropdown

**Key Metrics Row (Grid of 5):**
- Card 1: "Utilisateurs" - Count: "3,245" - Trend: "+12% vs semaine dernière"
- Card 2: "Propriétés" - Count: "1,892" - Trend: "+8%"
- Card 3: "Transactions" - Count: "456" - Trend: "+23%"
- Card 4: "Volume" - Amount: "45,600,000 FCFA" - Trend: "+18%"
- Card 5: "Commission" - Amount: "2,280,000 FCFA" - (5% of volume)

**Charts Section:**
- Row 1 (2 columns):
  - Left: "Inscriptions par jour" - Line chart showing new users over time
  - Right: "Propriétés par statut" - Donut chart (Active, Pending, Draft, Archived)
  
- Row 2 (2 columns):
  - Left: "Revenus par jour" - Bar chart showing transaction volume
  - Right: "Répartition par ville" - Horizontal bar chart (Yaoundé, Douala, etc.)

**Recent Activity Tables:**
- Tab view: "Utilisateurs récents" | "Propriétés récentes" | "Transactions récentes"

- Users table:
  - Avatar + Name
  - Email
  - Role (badge)
  - Joined date
  - Status
  - Actions: View, Edit

- Properties table:
  - Image + Title
  - Owner
  - City
  - Price
  - Status
  - Verification status
  - Actions: View, Verify, Delete

- Transactions table:
  - Reference
  - Renter → Landlord
  - Property
  - Amount
  - Status
  - Escrow status
  - Actions: View, Release escrow

**Pending Actions Card:**
- Highlighted section with urgent items:
  - "15 propriétés en attente de vérification"
  - "3 demandes de remboursement"
  - "2 signalements à traiter"
- Each with "Traiter →" link

**System Status:**
- Small card showing:
  - API status: "Opérationnel" (green)
  - MTN MoMo: "Opérationnel" (green)
  - Orange Money: "Opérationnel" (green)
```

---

### 13. Verifier Dashboard

```
Create a verifier dashboard for Piol property verification staff.

**Page Header:**
- Title: "Tableau de bord vérificateur"
- Greeting: "Bonjour, [Name]"
- Today's date

**Stats Cards (Grid of 4):**
- Card 1: "En attente" - Count: "12" - Icon: Clock - Yellow background
- Card 2: "En cours" - Count: "2" - Icon: Loader - Blue background
- Card 3: "Complétées aujourd'hui" - Count: "5" - Icon: CheckCircle - Green background
- Card 4: "Total ce mois" - Count: "45" - Icon: Calendar - Gray background

**Pending Verifications List:**
- Heading: "Vérifications en attente"
- Sort: "Plus anciennes d'abord" (to prioritize)
- List of verification cards:
  - Property image thumbnail
  - Title: "Appartement 2 chambres à Bastos"
  - Owner: "Marie K."
  - Location: "Bastos, Yaoundé"
  - Submitted: "Il y a 2 jours"
  - Type badge: "Visite terrain" or "Documents"
  - Priority indicator (if urgent)
  - Button: "Commencer la vérification"

**My Active Verifications:**
- Heading: "Mes vérifications en cours"
- Cards for verifications I've claimed:
  - Property info
  - Status: "En cours"
  - Started: "Commencée il y a 3h"
  - Button: "Continuer"

**Quick Actions:**
- "Voir la carte des vérifications" (map view of properties to verify)
- "Mes statistiques"

**Verification Detail Page (when clicking a verification):**
- Property full details
- Owner contact info
- Verification checklist:
  - [ ] Propriété visitée
  - [ ] Photos prises
  - [ ] Documents vérifiés
  - [ ] Propriétaire rencontré
- Photo upload section for visit photos
- Notes textarea
- Decision buttons:
  - "Approuver" (green) - with confirmation
  - "Rejeter" (red) - requires reason
  - "Demander plus d'informations" (yellow)

**Calendar Integration (optional):**
- Schedule visits
- View upcoming visits
```

---

### 14. Auth Pages (Sign In / Sign Up)

```
Create sign in and sign up pages for Piol using Clerk integration style.

**Sign In Page:**
- Centered card on subtle gradient background
- Logo at top
- Heading: "Connexion à Piol"
- Subheading: "Bienvenue! Connectez-vous pour continuer"

- Social login buttons:
  - "Continuer avec Google" (Google icon)
  - "Continuer avec Facebook" (Facebook icon)

- Divider: "ou"

- Email input: "Adresse email"
- Password input with show/hide toggle: "Mot de passe"
- "Mot de passe oublié?" link

- Primary button: "Se connecter"

- Footer: "Pas encore de compte? S'inscrire" link

- Note: These are styled containers - actual auth is handled by Clerk

**Sign Up Page:**
- Similar layout to sign in
- Heading: "Créer un compte Piol"
- Subheading: "Rejoignez la communauté Piol"

- Social signup buttons (same as sign in)

- Divider: "ou"

- First name input
- Last name input
- Email input
- Password input with requirements:
  - At least 8 characters
  - One uppercase
  - One number
- Password confirmation input

- Role selection (styled radio cards):
  - "Je cherche un logement" (Renter) - House search icon
  - "Je suis propriétaire" (Landlord) - Key icon

- Terms checkbox: "J'accepte les conditions d'utilisation et la politique de confidentialité"

- Primary button: "Créer mon compte"

- Footer: "Déjà un compte? Se connecter" link

**Onboarding Page (after signup):**
- Progress: Step 1 of 3
- Heading: "Finalisez votre profil"

- Step 1: Role confirmation
  - "Vous êtes:" - Radio selection
  - Next button

- Step 2: Phone number
  - "Numéro de téléphone"
  - Country code dropdown (+237)
  - Phone input
  - "Ce numéro sera utilisé pour les paiements Mobile Money"
  - Next button

- Step 3: Preferences
  - Language preference: Français / English
  - If renter: City preference dropdown
  - If landlord: Skip or add first property CTA
  - Finish button

- Completion:
  - Success animation
  - "Votre compte est prêt!"
  - "Commencer" button → redirects to dashboard
```

---

### 15. Error and Empty States

```
Create reusable error and empty state components for Piol.

**404 Not Found:**
- Centered content
- Large "404" text (muted)
- Illustration of confused person or lost location pin
- Heading: "Page introuvable"
- Text: "La page que vous recherchez n'existe pas ou a été déplacée."
- Primary button: "Retour à l'accueil"
- Secondary link: "Voir les propriétés"

**500 Server Error:**
- Similar layout
- Illustration of broken/error state
- Heading: "Oups! Une erreur est survenue"
- Text: "Nous travaillons à résoudre le problème. Veuillez réessayer dans quelques instants."
- Primary button: "Réessayer"
- Secondary button: "Contacter le support"

**No Search Results:**
- Illustration of empty magnifying glass
- Heading: "Aucun résultat trouvé"
- Text: "Aucune propriété ne correspond à vos critères. Essayez d'élargir votre recherche."
- Suggestions:
  - "Essayez une autre ville"
  - "Augmentez votre budget"
  - "Réduisez les filtres"
- Button: "Réinitialiser les filtres"

**Empty Favorites:**
- Illustration of empty heart
- Heading: "Aucune propriété sauvegardée"
- Text: "Sauvegardez vos propriétés préférées pour les retrouver facilement."
- Button: "Explorer les propriétés"

**Empty Messages:**
- Illustration of empty mailbox
- Heading: "Aucun message"
- Text: "Contactez des propriétaires pour commencer une conversation."
- Button: "Voir les propriétés"

**Empty Properties (Landlord):**
- Illustration of empty building
- Heading: "Aucune propriété publiée"
- Text: "Publiez votre première propriété et commencez à recevoir des demandes."
- Button: "Publier une propriété"

**Empty Transactions:**
- Illustration of empty wallet
- Heading: "Aucune transaction"
- Text: "Vos paiements et transactions apparaîtront ici."

**Loading States:**
- Skeleton loaders matching each content type:
  - Property card skeleton
  - Table row skeleton
  - Profile skeleton
  - Message skeleton
- Subtle shimmer animation
- Consistent with component shapes
```

---

## 🔄 Component Library Prompts

### Reusable Components

```
Create these reusable components for Piol:

**Property Card (Compact):**
- Use in grids and carousels
- Image, title, price, location, badges
- Hover state with shadow lift
- Favorite button
- Click navigates to detail

**Property Card (Horizontal):**
- Use in lists and dashboards
- Image left, content right
- More details visible
- Action buttons on right

**User Avatar with Badge:**
- Avatar image or initials fallback
- Size variants: sm, md, lg
- Optional verification badge
- Online status indicator

**Stat Card:**
- Icon (customizable)
- Label
- Value (large)
- Trend indicator (+/- percentage)
- Background color variants

**Status Badge:**
- Variants: success, warning, error, info, neutral
- Dot indicator option
- Consistent padding and typography

**Empty State:**
- Illustration slot
- Heading
- Description
- Action button
- Variants for different contexts

**Price Display:**
- Amount formatted with spaces: "150 000"
- Currency: "FCFA"
- Period: "/mois" or one-time
- Size variants

**Amenity Badge:**
- Icon + label
- Checkmark variant for detail page
- Compact variant for cards
```

---

## 📱 Mobile-Specific Prompts

```
Create mobile-specific components for Piol:

**Bottom Navigation Bar:**
- Fixed bottom
- 4-5 items max
- Icons + labels
- Active state indicator
- Safe area padding for notched phones
- Items: Home, Search/Properties, Messages (with badge), Profile

**Mobile Filter Sheet:**
- Slide up from bottom
- Handle bar at top
- Scrollable content
- Sticky "Appliquer" button at bottom
- Close button or swipe down to dismiss

**Property Card (Mobile):**
- Full width
- Swipeable image gallery
- Compact info layout
- Touch-optimized tap targets

**Mobile Header:**
- Back button (when applicable)
- Title (centered or left)
- Action buttons (right)
- Safe area padding for status bar
```

---

## 🎨 Style Guide Reminder

When using these prompts, always start your v0 session with the design system context from the top of this document to ensure consistency across all generated components.

**Key Styling Points:**
- Primary: Emerald green (#10b981 / emerald-500)
- Backgrounds: White, gray-50, slate-50
- Text: Gray-900 for headings, gray-600 for body
- Border radius: rounded-lg (8px) default
- Shadows: shadow-sm for subtle, shadow-md for cards
- Spacing: Use Tailwind spacing scale consistently
- Fonts: System font stack (Geist if available)

---

## 📋 Implementation Checklist

Use this to track which pages have been generated:

- [ ] Landing Page
- [ ] Property Listing
- [ ] Property Detail
- [ ] Dashboard Layout
- [ ] Renter Dashboard Home
- [ ] Landlord Dashboard Home
- [ ] Property Management
- [ ] Create/Edit Property Form
- [ ] Messages/Inbox
- [ ] Payments Page
- [ ] Settings Page
- [ ] Admin Dashboard
- [ ] Verifier Dashboard
- [ ] Auth Pages
- [ ] Error/Empty States
- [ ] Reusable Components
- [ ] Mobile Components
