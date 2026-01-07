import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

// Passthrough proxy when Clerk is not configured
function passthroughProxy() {
  return NextResponse.next();
}

// Clerk proxy handler
const clerkProxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
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
