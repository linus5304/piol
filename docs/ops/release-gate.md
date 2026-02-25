# Pre-Production Release Gate

## Scope
Applies to web + Convex + Clerk only.
Mobile is excluded from this gate for current MVP cycle.

## Hard Gate Criteria
All conditions must pass.

1. Environment and Secrets
- Environment matrix is current (`docs/ops/environment-matrix.md`).
- Secret provisioning completed (`docs/ops/secret-provisioning.md`).
- Preview and production Clerk/Convex mappings verified.

2. Build and Tests
- Web typecheck passes.
- Convex tests pass.
- Smoke tests pass on target environment.

3. Access and Workflow
- Role access-control checks pass for guest/renter/landlord/verifier/admin.
- Listing lifecycle scenario passes.
- Messaging scenario passes.

4. Payment Staging Policy
- Wave 1: `NEXT_PUBLIC_PAYMENTS_ENABLED=false` in preview and production.
- Checkout action UI hidden; payment history UI still available.
- Payments are de-emphasized in primary user navigation/copy during the growth-first phase.

5. Defect Threshold
- P0 = 0
- P1 = 0
- Manual checklist pass rate >= 95%

## Rollout Policy

## Wave 1
- Ship core marketplace workflows.
- Keep payment initiation gated off.
- Monitor auth, listing lifecycle, and messaging stability.

## Wave 2
Enable payment initiation only after all below are true:
1. Convex callback paths validated in production-like environment.
2. MTN and Orange credentials verified for target environment.
3. End-to-end payment smoke tests pass.
4. Incident response owner identified for payment failures.

## Required Evidence Before Release Approval
- Completed QA report using `docs/ops/qa-report-template.md`.
- Link to successful CI run(s).
- Link to release commit/PR.
- Explicit GO decision by reviewer/owner.
