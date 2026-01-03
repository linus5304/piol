export default {
  providers: [
    {
      // Clerk configuration
      // The domain will be set via environment variable
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex',
    },
  ],
};

