import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Check if Clerk is properly configured
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = clerkKey && !clerkKey.includes('REPLACE_WITH');

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/properties(.*)',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

// Content Security Policy directives
const cspDirectives = [
  "default-src 'self'",
  // Scripts: self + Clerk + Sentry + Vercel analytics
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.sentry.io https://va.vercel-scripts.com",
  // Styles: unsafe-inline required for shadcn/tailwind runtime styles
  "style-src 'self' 'unsafe-inline'",
  // Images: self + Clerk avatars + Unsplash + placeholder + data URIs
  "img-src 'self' blob: data: https://images.unsplash.com https://via.placeholder.com https://img.clerk.com https://*.clerk.com",
  // Fonts: self
  "font-src 'self'",
  // Connect: self + Convex (REST + WebSocket) + Clerk + Sentry + General Translation
  "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.clerk.accounts.dev https://*.clerk.com https://*.sentry.io https://*.ingest.sentry.io https://*.generaltranslation.com https://va.vercel-scripts.com",
  // Frames: none (prevent clickjacking)
  "frame-src 'self' https://*.clerk.accounts.dev",
  // Workers: self + blob (for Convex)
  "worker-src 'self' blob:",
  // Object: none
  "object-src 'none'",
  // Base URI: self
  "base-uri 'self'",
  // Form action: self
  "form-action 'self'",
  // Frame ancestors: none (prevent embedding)
  "frame-ancestors 'none'",
];

const cspHeader = cspDirectives.join('; ');

// Security headers applied to all responses
const securityHeaders: Record<string, string> = {
  'Content-Security-Policy': cspHeader,
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

// Passthrough proxy when Clerk is not configured
function passthroughProxy() {
  return applySecurityHeaders(NextResponse.next());
}

// Clerk proxy handler
const clerkProxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
  return applySecurityHeaders(NextResponse.next());
});

// Export the appropriate proxy based on configuration
export const proxy = isClerkConfigured ? clerkProxy : passthroughProxy;

// Default export for backwards compatibility
export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
