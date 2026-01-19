const clerkDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;

// Validate auth configuration at startup
if (!clerkDomain) {
  console.warn(
    '⚠️  CLERK_JWT_ISSUER_DOMAIN not set in Convex environment variables.\n' +
      '   Auth will not work. Set this in Convex Dashboard → Settings → Environment Variables.\n' +
      '   Value should be your Clerk domain, e.g., "your-app.clerk.accounts.dev"'
  );
}

export default {
  providers: clerkDomain
    ? [
        {
          // Clerk configuration
          domain: clerkDomain,
          applicationID: 'convex',
        },
      ]
    : [],
};
