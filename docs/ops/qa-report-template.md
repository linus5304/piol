# QA Report Template

## Metadata
- Date:
- Environment: local | preview | production-candidate
- Build/Commit:
- Tester:

## Automated Smoke Results
- Command(s) run:
- Result summary:
- Failing tests:

## Manual Checklist Results

### Guest
- [ ] Can browse property list and detail
- [ ] Protected actions require authentication

### Renter
- [ ] Can search/filter listings
- [ ] Can save/unsave properties
- [ ] Can message landlord from property detail
- [ ] Can view transaction history

### Landlord
- [ ] Can create draft property
- [ ] Can submit for verification
- [ ] Can activate approved listing
- [ ] Can access messages

### Verifier
- [ ] Can view pending queue
- [ ] Can claim verification
- [ ] Can approve and reject with notes

### Admin
- [ ] Can access admin dashboard
- [ ] Can manage user role/status
- [ ] Can access verification and transaction oversight

## Required Scenario Validation
- [ ] Missing/mismatched `CLERK_JWT_ISSUER_DOMAIN` is detected before release
- [ ] Access-control rules block unauthorized role/page combinations
- [ ] Listing lifecycle works: `draft -> pending_verification -> verified -> active`
- [ ] Rejected listing returns to editable flow
- [ ] Messaging read/unread behavior works in renter-landlord thread
- [ ] With `NEXT_PUBLIC_PAYMENTS_ENABLED=false`, checkout actions are hidden and history remains readable

## Defect Summary
- P0:
- P1:
- P2:
- P3:

## Release Recommendation
- [ ] GO
- [ ] NO-GO
- Notes:
