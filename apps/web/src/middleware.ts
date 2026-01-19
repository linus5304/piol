import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/properties',
  '/properties/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/public(.*)',
]);

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/protected(.*)']);

/**
 * Check if Clerk is configured (must check env vars directly in middleware)
 */
function isClerkConfiguredInMiddleware() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return Boolean(key && !key.includes('REPLACE_WITH'));
}

export default clerkMiddleware(async (auth, request) => {
  // Demo mode: if Clerk is not configured, allow all routes
  if (!isClerkConfiguredInMiddleware()) {
    return NextResponse.next();
  }

  // Protect dashboard and protected API routes
  if (isProtectedRoute(request)) {
    const { userId } = await auth();

    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
