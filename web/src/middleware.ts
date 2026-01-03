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

// If Clerk is not configured, use a passthrough middleware
function passthroughMiddleware(_request: NextRequest) {
    return NextResponse.next();
}

// Export the appropriate middleware based on configuration
export default isClerkConfigured
    ? clerkMiddleware(async (auth, request) => {
          if (!isPublicRoute(request)) {
              await auth.protect();
          }
      })
    : passthroughMiddleware;

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};

