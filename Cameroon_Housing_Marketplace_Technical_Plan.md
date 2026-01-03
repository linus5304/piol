# Cameroon Housing Marketplace

## Technical Architecture & Development Plan

**Document Version:** 1.0  
**Date:** January 2025  
**Status:** Technical Specification

---

# Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Design](#2-architecture-design)
3. [Technology Stack](#3-technology-stack)
4. [Database Schema](#4-database-schema)
5. [API Design](#5-api-design)
6. [Mobile Application](#6-mobile-application)
7. [Payment Integration](#7-payment-integration)
8. [Property Verification System](#8-property-verification-system)
9. [Security & Compliance](#9-security--compliance)
10. [Infrastructure & DevOps](#10-infrastructure--devops)
11. [Development Roadmap](#11-development-roadmap)
12. [Testing Strategy](#12-testing-strategy)

---

# 1. System Overview

## 1.1 Platform Components

```
┌─────────────────────────────────────────────────────────────┐
│                    User-Facing Applications                  │
├──────────────────────┬──────────────────────────────────────┤
│  Mobile App (iOS)    │  Mobile App (Android)  │  Web PWA     │
└──────────────────────┴──────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway / CDN                       │
│              (Rate Limiting, Authentication)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services (Microservices)          │
├──────────────┬──────────────┬──────────────┬───────────────┤
│   User       │   Property   │   Payment    │   Verification │
│   Service    │   Service    │   Service    │   Service      │
├──────────────┼──────────────┼──────────────┼───────────────┤
│   Search     │   Messaging  │   Notification│   Analytics   │
│   Service    │   Service    │   Service    │   Service     │
└──────────────┴──────────────┴──────────────┴───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
├──────────────┬──────────────┬──────────────┬───────────────┤
│  PostgreSQL  │   Redis      │   S3/Cloud   │   Elasticsearch│
│  (Primary DB) │   (Cache)    │   Storage    │   (Search)    │
└──────────────┴──────────────┴──────────────┴───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Integrations                     │
├──────────────┬──────────────┬──────────────┬───────────────┤
│  MTN MoMo API│ Orange Money │  Google Maps │   SMS Gateway │
│              │     API      │   / OSM      │               │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

## 1.2 Core Features

### Phase 1 (MVP - Months 1-6)

- User authentication & profiles (renters, landlords)
- Property listing creation & management
- Property search & filtering
- Basic property verification workflow
- In-app messaging
- Payment integration (Mobile Money)
- Bilingual support (French/English)

### Phase 2 (Months 6-12)

- Escrow payment system
- Tenant screening & scoring
- Landlord ratings & reviews
- Digital lease generation
- Push notifications
- Offline mode (browse saved listings)
- Advanced analytics dashboard

### Phase 3 (Year 2+)

- Pay-as-you-go rent collection
- Property management tools (multi-property dashboard)
- Rent financing integration
- Insurance products
- Virtual property tours
- AI-powered recommendations

---

# 2. Architecture Design

## 2.1 High-Level Architecture

**Architecture Pattern:** Microservices with API Gateway

**Rationale:**

- Scalability: Independent scaling of services
- Maintainability: Clear separation of concerns
- Technology flexibility: Different services can use different tech stacks
- Fault isolation: Failure in one service doesn't bring down entire system

## 2.2 Service Breakdown

### Core Services

**1. User Service**

- User registration, authentication, profile management
- Role management (renter, landlord, admin, verifier)
- Account verification (email, phone, ID)

**2. Property Service**

- Property listing CRUD operations
- Property metadata (location, amenities, pricing)
- Property status management (active, verified, rented, archived)

**3. Verification Service**

- Property verification workflow
- Document verification (ownership, ID)
- Verification status tracking
- Verifier assignment & management

**4. Search Service**

- Property search & filtering
- Location-based search (geospatial queries)
- Full-text search (Elasticsearch)
- Search ranking & relevance

**5. Messaging Service**

- In-app messaging between users
- Message notifications
- Conversation management

**6. Payment Service**

- Mobile Money integration (MTN MoMo, Orange Money)
- Escrow management
- Transaction history
- Payment reconciliation

**7. Notification Service**

- Push notifications (FCM, APNS)
- SMS notifications
- Email notifications
- In-app notifications

**8. Analytics Service**

- User behavior tracking
- Business metrics (listings, transactions, revenue)
- Reporting & dashboards

## 2.3 Data Flow

### Property Listing Flow

```
1. Landlord creates listing → Property Service
2. Property Service stores in PostgreSQL
3. Verification Service creates verification task
4. Verifier assigned → Verification Service
5. Verifier visits property → Updates verification status
6. Property approved → Property Service updates status
7. Property indexed → Search Service (Elasticsearch)
8. Property visible to renters → Search results
```

### Transaction Flow

```
1. Renter finds property → Search Service
2. Renter contacts landlord → Messaging Service
3. Agreement reached → Payment Service creates escrow
4. Renter pays via Mobile Money → Payment Service
5. Funds held in escrow → Payment Service
6. Move-in confirmed → Payment Service releases funds
7. Transaction completed → Analytics Service tracks
```

---

# 3. Technology Stack

## 3.1 Backend

### Primary Stack

- **Language:** Node.js (TypeScript) or Python (FastAPI)
- **Framework:** Express.js (Node) or FastAPI (Python)
- **Database:** PostgreSQL 14+ (primary), Redis (cache)
- **Search:** Elasticsearch 8+
- **Message Queue:** RabbitMQ or AWS SQS
- **File Storage:** AWS S3 or Cloudflare R2

### Rationale

- **Node.js/Python:** Fast development, large ecosystem, good for APIs
- **PostgreSQL:** ACID compliance, JSON support, geospatial extensions (PostGIS)
- **Redis:** Fast caching, session management, rate limiting
- **Elasticsearch:** Powerful search, geospatial queries, analytics
- **RabbitMQ/SQS:** Reliable message queuing for async operations

### Alternative Stack (If Cost-Conscious)

- **Language:** Python (Django)
- **Database:** PostgreSQL (same)
- **Search:** PostgreSQL full-text search (initially, migrate to Elasticsearch later)
- **File Storage:** Local storage initially, migrate to S3 later

## 3.2 Frontend (Mobile)

### Primary Stack

- **Framework:** React Native (Expo) or Flutter
- **State Management:** Redux Toolkit (React Native) or Provider/Riverpod (Flutter)
- **Navigation:** React Navigation (React Native) or Navigator (Flutter)
- **HTTP Client:** Axios or Dio
- **Local Storage:** AsyncStorage (React Native) or SharedPreferences (Flutter)

### Rationale

- **React Native/Flutter:** Cross-platform, single codebase, good performance
- **Expo (if React Native):** Faster development, easier deployment
- **Redux/Provider:** Predictable state management

### Recommendation: **Flutter**

- Better performance on low-end devices
- Single codebase (iOS + Android)
- Good offline support
- Strong localization support (French/English)

## 3.3 Web (PWA)

### Stack

- **Framework:** Next.js (React) or Nuxt.js (Vue)
- **State Management:** Zustand or Pinia
- **PWA:** Workbox for service workers
- **Styling:** Tailwind CSS

### Rationale

- **Next.js/Nuxt.js:** SSR, good SEO, PWA support
- **PWA:** Works offline, installable, good for low-end devices

## 3.4 Infrastructure

### Cloud Provider

- **Primary:** AWS (EC2, RDS, S3, CloudFront) or DigitalOcean (simpler, cheaper)
- **CDN:** Cloudflare (free tier available)
- **Monitoring:** Sentry (error tracking), DataDog or New Relic (APM)

### DevOps

- **CI/CD:** GitHub Actions or GitLab CI
- **Containerization:** Docker
- **Orchestration:** Docker Compose (dev), Kubernetes (production, if needed)
- **Infrastructure as Code:** Terraform or Pulumi

---

# 4. Database Schema

## 4.1 Core Tables

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('renter', 'landlord', 'admin', 'verifier')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    language_preference VARCHAR(10) DEFAULT 'fr' CHECK (language_preference IN ('fr', 'en')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    id_verified BOOLEAN DEFAULT FALSE,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
```

### Properties Table

```sql
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landlord_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('studio', '1br', '2br', '3br', '4br', 'house', 'apartment', 'villa')),
    rent_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XAF',
    caution_months INTEGER DEFAULT 2,
    upfront_months INTEGER DEFAULT 6,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100),
    amenities JSONB, -- {wifi: true, parking: true, ac: false, ...}
    images JSONB, -- [{url: "...", order: 1}, ...]
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_verification', 'verified', 'active', 'rented', 'archived')),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in_progress', 'approved', 'rejected')),
    verified_at TIMESTAMP,
    verifier_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);

CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_location ON properties USING GIST (
    ll_to_earth(location_latitude, location_longitude)
); -- PostGIS extension for geospatial queries
```

### Verifications Table

```sql
CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id),
    verifier_id UUID NOT NULL REFERENCES users(id),
    verification_type VARCHAR(50) NOT NULL CHECK (verification_type IN ('property_visit', 'ownership_document', 'id_verification')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected')),
    notes TEXT,
    documents JSONB, -- [{type: "title_deed", url: "...", verified: true}, ...]
    visit_date TIMESTAMP,
    visit_photos JSONB, -- [{url: "...", timestamp: "..."}, ...]
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_verifications_property ON verifications(property_id);
CREATE INDEX idx_verifications_verifier ON verifications(verifier_id);
CREATE INDEX idx_verifications_status ON verifications(status);
```

### Transactions Table

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id),
    renter_id UUID NOT NULL REFERENCES users(id),
    landlord_id UUID NOT NULL REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('rent_payment', 'deposit', 'commission', 'refund')),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XAF',
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('mtn_momo', 'orange_money', 'bank_transfer', 'cash')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    escrow_status VARCHAR(20) CHECK (escrow_status IN ('held', 'released', 'refunded')),
    mobile_money_reference VARCHAR(100),
    transaction_reference VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_transactions_property ON transactions(property_id);
CREATE INDEX idx_transactions_renter ON transactions(renter_id);
CREATE INDEX idx_transactions_landlord ON transactions(landlord_id);
CREATE INDEX idx_transactions_status ON transactions(payment_status);
```

### Messages Table

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    property_id UUID REFERENCES properties(id),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_property ON messages(property_id);
```

### Reviews Table

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),
    reviewee_id UUID NOT NULL REFERENCES users(id),
    review_type VARCHAR(20) NOT NULL CHECK (review_type IN ('landlord_review', 'tenant_review', 'property_review')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
```

## 4.2 Additional Tables

### Tenant Screening Table

```sql
CREATE TABLE tenant_screenings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    renter_id UUID NOT NULL REFERENCES users(id),
    property_id UUID REFERENCES properties(id),
    employment_status VARCHAR(50),
    employer_name VARCHAR(255),
    monthly_income DECIMAL(12, 2),
    previous_rental_history JSONB,
    references JSONB, -- [{name: "...", phone: "...", relationship: "..."}, ...]
    credit_score INTEGER,
    screening_status VARCHAR(20) DEFAULT 'pending',
    screening_score DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
```

---

# 5. API Design

## 5.1 API Architecture

**Style:** RESTful API with JSON

**Authentication:** JWT (JSON Web Tokens)

**Versioning:** URL-based (`/api/v1/...`)

**Rate Limiting:** 100 requests/minute per user, 1000 requests/minute per IP

## 5.2 Core Endpoints

### Authentication Endpoints

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/verify-phone
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

### User Endpoints

```
GET    /api/v1/users/me
PUT    /api/v1/users/me
GET    /api/v1/users/:id
POST   /api/v1/users/me/upload-avatar
POST   /api/v1/users/me/verify-id
```

### Property Endpoints

```
GET    /api/v1/properties
GET    /api/v1/properties/:id
POST   /api/v1/properties
PUT    /api/v1/properties/:id
DELETE /api/v1/properties/:id
POST   /api/v1/properties/:id/upload-images
GET    /api/v1/properties/search
GET    /api/v1/properties/nearby
```

### Verification Endpoints

```
POST   /api/v1/properties/:id/request-verification
GET    /api/v1/verifications
GET    /api/v1/verifications/:id
PUT    /api/v1/verifications/:id/update-status
POST   /api/v1/verifications/:id/upload-documents
```

### Payment Endpoints

```
POST   /api/v1/payments/initiate
POST   /api/v1/payments/callback (Mobile Money webhook)
GET    /api/v1/payments/:id
GET    /api/v1/payments/transactions
POST   /api/v1/payments/escrow/create
POST   /api/v1/payments/escrow/release
```

### Messaging Endpoints

```
GET    /api/v1/messages/conversations
GET    /api/v1/messages/conversations/:id
POST   /api/v1/messages/send
PUT    /api/v1/messages/:id/read
```

### Search Endpoints

```
GET    /api/v1/search/properties
GET    /api/v1/search/autocomplete
GET    /api/v1/search/suggestions
```

## 5.3 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## 5.4 API Documentation

**Tool:** Swagger/OpenAPI 3.0

**Location:** `/api/v1/docs`

**Auto-generation:** From code annotations (JSDoc/TypeDoc for TypeScript, docstrings for Python)

---

# 6. Mobile Application

## 6.1 Architecture (Flutter)

### Project Structure

```
lib/
├── main.dart
├── app/
│   ├── app.dart
│   └── routes.dart
├── core/
│   ├── constants/
│   ├── utils/
│   ├── services/
│   └── widgets/
├── features/
│   ├── auth/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── properties/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── search/
│   ├── messaging/
│   ├── payments/
│   └── profile/
├── shared/
│   ├── models/
│   ├── widgets/
│   └── services/
└── localization/
    ├── app_localizations.dart
    ├── en/
    └── fr/
```

### State Management: Provider/Riverpod

### Key Packages

```yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.0.0
  http: ^1.1.0
  shared_preferences: ^2.2.0
  cached_network_image: ^3.3.0
  google_maps_flutter: ^2.5.0
  image_picker: ^1.0.0
  flutter_localizations:
    sdk: flutter
  intl: ^0.18.0
  connectivity_plus: ^5.0.0
  workmanager: ^0.5.0
  firebase_messaging: ^14.0.0
  flutter_secure_storage: ^9.0.0
```

## 6.2 Key Features Implementation

### Offline Support

- **Local Database:** Hive or SQLite for cached data
- **Sync Strategy:** Background sync when online
- **Offline Queue:** Queue API requests when offline, sync when online

### Image Handling

- **Caching:** `cached_network_image` for efficient image loading
- **Compression:** Compress images before upload
- **Lazy Loading:** Load images on-demand in lists

### Localization

- **i18n:** Flutter's built-in localization
- **Language Switching:** User preference stored in SharedPreferences
- **RTL Support:** Not needed (French/English are LTR)

### Push Notifications

- **Firebase Cloud Messaging (FCM):** For Android
- **Apple Push Notification Service (APNS):** For iOS
- **Background Handling:** WorkManager for background tasks

## 6.3 UI/UX Considerations

### Design Principles

- **Mobile-First:** Optimized for small screens
- **Low Data Usage:** Compressed images, lazy loading
- **Offline-First:** Works without internet (browse saved listings)
- **Accessibility:** Screen reader support

### Key Screens

1. **Onboarding:** Language selection, role selection (renter/landlord)
2. **Home:** Property listings, search bar, filters
3. **Property Details:** Images, description, map, contact landlord
4. **Search:** Filters (location, price, type, amenities)
5. **Messages:** Conversations, chat interface
6. **Profile:** User info, listings (landlord), saved properties (renter)
7. **Payments:** Transaction history, payment methods

---

# 7. Payment Integration

## 7.1 Mobile Money Integration

### MTN Mobile Money API

**Endpoint:** `https://sandbox.momodeveloper.mtn.com` (sandbox), `https://momodeveloper.mtn.com` (production)

**Authentication:** OAuth 2.0 (API Key + API Secret)

**Key Operations:**

1. **Request to Pay:** Initiate payment from user
2. **Get Transaction Status:** Check payment status
3. **Get Account Balance:** Check platform balance
4. **Transfer:** Transfer funds (escrow release)

**Implementation:**

```typescript
// Example: Request to Pay
POST /collection/v1_0/requesttopay
Headers:
  Authorization: Bearer {access_token}
  X-Target-Environment: sandbox|production
  X-Reference-Id: {unique_reference}
  Content-Type: application/json

Body:
{
  "amount": "10000",
  "currency": "XAF",
  "externalId": "transaction_123",
  "payer": {
    "partyIdType": "MSISDN",
    "partyId": "237677777777"
  },
  "payerMessage": "Rent payment for Property XYZ",
  "payeeNote": "Payment for rent"
}
```

### Orange Money API

**Endpoint:** `https://api.orange.com` (varies by country)

**Authentication:** OAuth 2.0

**Key Operations:**

- Similar to MTN MoMo (request to pay, status check, transfer)

### Payment Flow

```
1. User initiates payment → Frontend
2. Frontend calls Backend API → POST /api/v1/payments/initiate
3. Backend creates transaction record → Database
4. Backend calls Mobile Money API → Request to Pay
5. Mobile Money sends callback → Backend webhook
6. Backend updates transaction status → Database
7. Backend notifies user → Push notification
8. Frontend polls or receives webhook → Update UI
```

### Escrow Implementation

```
1. Renter pays → Funds held in platform Mobile Money account
2. Transaction status: "held" → Database
3. Move-in confirmed (both parties) → Release funds
4. Backend transfers to landlord → Mobile Money Transfer API
5. Transaction status: "released" → Database
```

## 7.2 Payment Security

- **Webhook Verification:** Verify webhook signatures from Mobile Money providers
- **Idempotency:** Use unique transaction references to prevent duplicate payments
- **Encryption:** Encrypt sensitive payment data at rest
- **PCI Compliance:** Don't store full payment credentials (use Mobile Money tokens)

---

# 8. Property Verification System

## 8.1 Verification Workflow

### Step 1: Listing Creation

```
Landlord creates listing → Property status: "draft"
Landlord submits for verification → Property status: "pending_verification"
System creates verification task → Verification Service
```

### Step 2: Verifier Assignment

```
System assigns verifier → Based on location, workload
Verifier receives notification → Push notification, email
Verifier accepts task → Verification status: "in_progress"
```

### Step 3: Property Visit

```
Verifier visits property → Mobile app (verifier dashboard)
Verifier takes photos → Upload via mobile app
Verifier checks documents → Upload ownership documents
Verifier fills verification form → Location, amenities, condition
```

### Step 4: Document Review

```
Verifier uploads documents → Ownership deed, ID
System stores documents → S3/Cloud Storage
Admin reviews documents → Admin dashboard
Admin approves/rejects → Verification status updated
```

### Step 5: Approval

```
Verification approved → Property status: "verified"
Property goes live → Searchable, visible to renters
Verification badge shown → UI displays verified badge
```

## 8.2 Verifier Mobile App

**Features:**

- Task list (assigned verifications)
- Property visit form
- Photo capture & upload
- Document upload
- GPS location capture
- Offline mode (sync when online)

**Tech Stack:** Flutter (same as main app, different user role)

---

# 9. Security & Compliance

## 9.1 Authentication & Authorization

### Authentication

- **JWT Tokens:** Access token (15 min expiry) + Refresh token (7 days expiry)
- **Password Hashing:** bcrypt (cost factor 12)
- **2FA:** Optional (SMS-based, Phase 2)

### Authorization

- **Role-Based Access Control (RBAC):** renter, landlord, admin, verifier
- **Resource-Level Permissions:** Users can only access their own resources

## 9.2 Data Security

### Encryption

- **At Rest:** Database encryption (PostgreSQL encryption)
- **In Transit:** TLS 1.3 for all API communications
- **Sensitive Data:** Encrypt PII (phone numbers, IDs) in database

### Data Privacy

- **GDPR/CCPA Compliance:** User data export, deletion rights
- **Data Minimization:** Only collect necessary data
- **Consent Management:** User consent for data processing

## 9.3 API Security

- **Rate Limiting:** Prevent abuse (100 req/min per user)
- **Input Validation:** Sanitize all user inputs
- **SQL Injection Prevention:** Parameterized queries
- **XSS Prevention:** Sanitize user-generated content
- **CORS:** Configured for mobile app origins only

## 9.4 Compliance

### Cameroon-Specific

- **Data Protection Law 2010/012:** User consent, data security
- **Telecom Regulations:** SMS gateway compliance
- **Financial Regulations:** Payment processing compliance (if applicable)

---

# 10. Infrastructure & DevOps

## 10.1 Infrastructure Setup

### Development Environment

```
- Local development: Docker Compose
  - PostgreSQL container
  - Redis container
  - Elasticsearch container (optional, use PostgreSQL search initially)
  - Backend API container
```

### Staging Environment

```
- DigitalOcean Droplet (4GB RAM, 2 vCPU)
  - Docker containers for services
  - PostgreSQL (managed or container)
  - Redis (container)
  - Nginx reverse proxy
  - SSL certificate (Let's Encrypt)
```

### Production Environment

```
- DigitalOcean Droplets (scalable)
  - Load balancer (Nginx)
  - Backend services (2+ instances)
  - PostgreSQL (managed database)
  - Redis (managed or container)
  - Elasticsearch (managed or container)
  - S3-compatible storage (DigitalOcean Spaces)
  - CDN (Cloudflare)
```

## 10.2 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linter
        run: npm run lint

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to staging
        run: |
          # SSH to staging server
          # Pull latest code
          # Restart services

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # SSH to production server
          # Pull latest code
          # Run migrations
          # Restart services
```

## 10.3 Monitoring & Logging

### Application Monitoring

- **Error Tracking:** Sentry (free tier: 5K events/month)
- **APM:** New Relic or DataDog (if budget allows)
- **Uptime Monitoring:** UptimeRobot (free tier)

### Logging

- **Application Logs:** Winston (Node.js) or Python logging
- **Log Aggregation:** ELK Stack (Elasticsearch, Logstash, Kibana) or simpler: file-based logs + log rotation

### Metrics

- **Business Metrics:** Custom dashboard (Grafana)
  - Active users
  - Listings created
  - Transactions completed
  - Revenue
- **Technical Metrics:** Prometheus + Grafana
  - API response times
  - Error rates
  - Database query performance

---

# 11. Development Roadmap

## 11.1 Phase 1: MVP (Months 1-6)

### Month 1: Foundation

- [ ] Project setup (backend, mobile app, database)
- [ ] User authentication & authorization
- [ ] Basic user profiles
- [ ] Database schema implementation

### Month 2: Property Management

- [ ] Property listing CRUD
- [ ] Image upload & storage
- [ ] Property search (basic)
- [ ] Location services (maps integration)

### Month 3: Verification System

- [ ] Verification workflow
- [ ] Verifier mobile app (basic)
- [ ] Document upload & storage
- [ ] Verification status management

### Month 4: Messaging & Communication

- [ ] In-app messaging
- [ ] Push notifications (basic)
- [ ] Email notifications
- [ ] SMS notifications (optional)

### Month 5: Payment Integration

- [ ] MTN Mobile Money integration
- [ ] Orange Money integration (if time permits)
- [ ] Payment transaction tracking
- [ ] Payment webhooks

### Month 6: Polish & Launch

- [ ] Bilingual support (French/English)
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Security audit
- [ ] Beta testing
- [ ] Soft launch

## 11.2 Phase 2: Scale (Months 7-12)

### Months 7-8: Escrow & Trust

- [ ] Escrow payment system
- [ ] Tenant screening
- [ ] Landlord ratings & reviews
- [ ] Digital lease generation

### Months 9-10: Advanced Features

- [ ] Pay-as-you-go rent collection
- [ ] Offline mode (mobile app)
- [ ] Advanced search (filters, sorting)
- [ ] Analytics dashboard

### Months 11-12: Optimization

- [ ] Performance optimization
- [ ] Scalability improvements
- [ ] Advanced analytics
- [ ] Marketing tools

## 11.3 Phase 3: Growth (Year 2+)

### Property Management Tools

- [ ] Multi-property dashboard
- [ ] Rent collection automation
- [ ] Maintenance request management
- [ ] Financial reporting

### Additional Services

- [ ] Rent financing integration
- [ ] Insurance products
- [ ] Virtual property tours
- [ ] AI-powered recommendations

---

# 12. Testing Strategy

## 12.1 Backend Testing

### Unit Tests

- **Coverage Target:** 80%+
- **Framework:** Jest (Node.js) or pytest (Python)
- **Focus:** Business logic, utilities, services

### Integration Tests

- **Framework:** Supertest (Node.js) or pytest (Python)
- **Focus:** API endpoints, database operations
- **Test Database:** Separate test database

### E2E Tests

- **Framework:** Postman/Newman or Cypress
- **Focus:** Critical user flows (register → list property → verify → rent)

## 12.2 Mobile App Testing

### Unit Tests

- **Framework:** Flutter test
- **Coverage Target:** 70%+

### Widget Tests

- **Framework:** Flutter test
- **Focus:** UI components, user interactions

### Integration Tests

- **Framework:** Flutter Driver or Integration Test
- **Focus:** Critical user flows

### Manual Testing

- **Devices:** Low-end Android, mid-range Android, iOS
- **Network Conditions:** 3G, 4G, offline
- **Languages:** French, English

## 12.3 Performance Testing

### Load Testing

- **Tool:** Apache JMeter or k6
- **Scenarios:**
  - 100 concurrent users
  - 1000 properties in database
  - Search performance
  - Payment processing

### Stress Testing

- **Tool:** Same as load testing
- **Scenarios:**
  - Peak traffic (10x normal load)
  - Database connection limits
  - API rate limiting

## 12.4 Security Testing

- **Penetration Testing:** OWASP Top 10 vulnerabilities
- **Authentication Testing:** JWT token security
- **API Security:** Rate limiting, input validation
- **Data Security:** Encryption, PII protection

---

# 13. Cost Estimates

## 13.1 Development Costs

### Team (6 months)

- **Backend Developer:** $3,000/month × 6 = $18,000
- **Mobile Developer:** $3,000/month × 6 = $18,000
- **UI/UX Designer:** $2,000/month × 3 = $6,000
- **QA Engineer:** $2,000/month × 3 = $6,000
- **Total:** $48,000

### Infrastructure (Monthly)

- **Hosting (DigitalOcean):** $40/month (4GB RAM, 2 vCPU)
- **Database (Managed PostgreSQL):** $15/month
- **Storage (S3/Spaces):** $10/month (estimated)
- **CDN (Cloudflare):** Free tier
- **Domain & SSL:** $20/year
- **Monitoring (Sentry):** Free tier (5K events/month)
- **Total:** ~$65/month

### Third-Party Services

- **SMS Gateway:** $0.05-0.10 per SMS (pay-as-you-go)
- **Email Service (SendGrid):** Free tier (100 emails/day)
- **Mobile Money API:** Transaction fees (varies by provider)

## 13.2 Year 1 Total Costs

- **Development:** $48,000
- **Infrastructure (12 months):** $780
- **Third-Party Services:** $2,000 (estimated)
- **Total:** ~$50,780

_Note: This aligns with the $52,500 product development budget in the business plan._

---

# 14. Risk Mitigation (Technical)

## 14.1 Technical Risks

| Risk                          | Impact | Mitigation                                                               |
| ----------------------------- | ------ | ------------------------------------------------------------------------ |
| **Mobile Money API downtime** | High   | Fallback to manual payment processing, retry logic, webhook verification |
| **Database performance**      | Medium | Indexing, query optimization, connection pooling, read replicas          |
| **Image storage costs**       | Medium | Image compression, CDN caching, lazy loading                             |
| **Offline sync conflicts**    | Low    | Conflict resolution strategy, last-write-wins or manual merge            |
| **API rate limiting**         | Medium | Implement rate limiting, caching, request queuing                        |

## 14.2 Scalability Considerations

### Database Scaling

- **Read Replicas:** For search-heavy operations
- **Sharding:** If database grows beyond single instance capacity
- **Caching:** Redis for frequently accessed data

### Application Scaling

- **Horizontal Scaling:** Multiple backend instances behind load balancer
- **Microservices:** Split services as they grow (start monolithic, refactor later)
- **CDN:** Static assets, images

### Cost Optimization

- **Start Small:** Use cheaper infrastructure initially
- **Scale Up:** Upgrade as traffic grows
- **Monitor Costs:** Set up billing alerts

---

# 15. Next Steps

## 15.1 Immediate Actions

1. **Finalize Technology Stack:** Node.js vs Python, Flutter vs React Native
2. **Set Up Development Environment:** GitHub repo, Docker setup, CI/CD
3. **Design Database Schema:** Finalize schema, create migration scripts
4. **Create API Documentation:** OpenAPI/Swagger spec
5. **Design Mobile App UI:** Figma/Sketch mockups
6. **Set Up Infrastructure:** Staging environment, domain, SSL

## 15.2 Pre-Development

1. **Mobile Money API Access:** Apply for MTN MoMo and Orange Money developer accounts
2. **SMS Gateway:** Set up account (Twilio, Africa's Talking, etc.)
3. **Domain Registration:** Register domain name
4. **Legal Review:** Review data privacy requirements

## 15.3 Development Kickoff

1. **Sprint Planning:** Break down Phase 1 into 2-week sprints
2. **Team Onboarding:** Set up development tools, access, documentation
3. **Daily Standups:** Track progress, blockers
4. **Weekly Reviews:** Demo progress, gather feedback

---

**Document End**

_This technical plan is a living document and should be updated as the project evolves._
