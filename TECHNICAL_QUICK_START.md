# Technical Quick Start Guide
## Cameroon Housing Marketplace

**For:** Development Team  
**Purpose:** Get started quickly with development setup

---

# Prerequisites

- Node.js 18+ (or Python 3.10+)
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose
- Flutter 3.0+ (for mobile app)
- Git

---

# Quick Setup (5 Minutes)

## 1. Clone Repository
```bash
git clone https://github.com/your-org/cameroon-housing-marketplace.git
cd cameroon-housing-marketplace
```

## 2. Backend Setup (Node.js)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run dev
```

**Backend runs on:** `http://localhost:3000`

## 3. Mobile App Setup (Flutter)

```bash
cd mobile
flutter pub get
flutter run
```

## 4. Database Setup (Docker)

```bash
docker-compose up -d postgres redis
```

---

# Environment Variables

## Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/housing_marketplace
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Mobile Money APIs
MTN_MOMO_API_KEY=your-api-key
MTN_MOMO_API_SECRET=your-api-secret
MTN_MOMO_ENVIRONMENT=sandbox

ORANGE_MONEY_API_KEY=your-api-key
ORANGE_MONEY_API_SECRET=your-api-secret

# AWS S3 (or DigitalOcean Spaces)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_BUCKET_NAME=housing-marketplace-images
AWS_REGION=us-east-1

# SMS Gateway
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://api.sms-provider.com

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key

# App
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:8080
```

---

# Database Migrations

## Create Migration
```bash
npm run migrate:create add_users_table
```

## Run Migrations
```bash
npm run migrate
```

## Rollback Migration
```bash
npm run migrate:rollback
```

---

# API Testing

## Using cURL

### Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "237677777777",
    "password": "password123",
    "role": "renter",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Property (with auth token)
```bash
curl -X POST http://localhost:3000/api/v1/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Beautiful 2BR Apartment",
    "description": "Spacious apartment in Douala",
    "property_type": "2br",
    "rent_amount": 150000,
    "city": "Douala",
    "neighborhood": "Bonamoussadi",
    "location_latitude": 4.0511,
    "location_longitude": 9.7679
  }'
```

---

# Mobile App Development

## Run on iOS Simulator
```bash
cd mobile
flutter run -d ios
```

## Run on Android Emulator
```bash
cd mobile
flutter run -d android
```

## Build APK
```bash
flutter build apk --release
```

## Build iOS
```bash
flutter build ios --release
```

---

# Common Commands

## Backend
```bash
npm run dev          # Start development server
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run linter
npm run lint:fix     # Fix linting errors
```

## Mobile
```bash
flutter pub get       # Install dependencies
flutter run          # Run app
flutter test         # Run tests
flutter analyze      # Run analyzer
```

---

# Project Structure

```
cameroon-housing-marketplace/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── migrations/
│   ├── tests/
│   └── package.json
├── mobile/
│   ├── lib/
│   │   ├── app/
│   │   ├── core/
│   │   ├── features/
│   │   └── shared/
│   ├── test/
│   └── pubspec.yaml
├── web/
│   ├── src/
│   ├── public/
│   └── package.json
└── docker-compose.yml
```

---

# Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/property-search
   ```

2. **Make Changes**
   - Write code
   - Write tests
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add property search functionality"
   ```

4. **Push & Create PR**
   ```bash
   git push origin feature/property-search
   # Create PR on GitHub
   ```

5. **Code Review & Merge**
   - PR reviewed by team
   - CI/CD runs tests
   - Merge to main

---

# Testing

## Backend Tests
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test
```

## Mobile Tests
```bash
# Unit tests
flutter test

# Widget tests
flutter test test/widget_test.dart

# Integration tests
flutter drive --target=test_driver/app.dart
```

---

# Debugging

## Backend
- Use `console.log()` or `logger.debug()`
- Use VS Code debugger (attach to Node.js process)
- Check logs: `tail -f logs/app.log`

## Mobile
- Use `print()` or `debugPrint()`
- Use Flutter DevTools
- Check logs: `flutter logs`

---

# Deployment

## Staging
```bash
git push origin develop
# Auto-deploys to staging via CI/CD
```

## Production
```bash
git push origin main
# Auto-deploys to production via CI/CD
```

---

# Useful Resources

- **API Documentation:** `http://localhost:3000/api/v1/docs`
- **Database Schema:** See `backend/migrations/`
- **Design System:** See `mobile/lib/shared/widgets/`
- **Architecture Docs:** See `docs/architecture.md`

---

# Getting Help

- **Technical Questions:** Ask in #dev channel (Slack/Discord)
- **Bugs:** Create issue on GitHub
- **Feature Requests:** Create issue with `feature` label

---

**Happy Coding! 🚀**

