import { httpRouter } from 'convex/server';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

// Clerk webhook endpoint
http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const payload = await request.json();
    const headers = Object.fromEntries(request.headers.entries());

    // Verify webhook signature in production
    // const svixId = headers['svix-id'];
    // const svixTimestamp = headers['svix-timestamp'];
    // const svixSignature = headers['svix-signature'];
    // TODO: Add signature verification with Svix

    const eventType = payload.type;
    const userData = payload.data;

    console.log(`Received Clerk webhook: ${eventType}`);

    try {
      switch (eventType) {
        case 'user.created':
          await ctx.runMutation(internal.users.createUserFromClerk, {
            clerkId: userData.id,
            email: userData.email_addresses?.[0]?.email_address || '',
            firstName: userData.first_name || undefined,
            lastName: userData.last_name || undefined,
            profileImageUrl: userData.image_url || undefined,
            phone: userData.phone_numbers?.[0]?.phone_number || undefined,
            role: (userData.unsafe_metadata?.role as 'renter' | 'landlord') || 'renter',
          });
          break;

        case 'user.updated':
          await ctx.runMutation(internal.users.updateUserFromClerk, {
            clerkId: userData.id,
            email: userData.email_addresses?.[0]?.email_address,
            firstName: userData.first_name || undefined,
            lastName: userData.last_name || undefined,
            profileImageUrl: userData.image_url || undefined,
            phone: userData.phone_numbers?.[0]?.phone_number || undefined,
          });
          break;

        case 'user.deleted':
          await ctx.runMutation(internal.users.deleteUserByClerkId, {
            clerkId: userData.id,
          });
          break;

        default:
          console.log(`Unhandled webhook event: ${eventType}`);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Webhook error:', error);
      return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),
});

// Health check endpoint
http.route({
  path: '/health',
  method: 'GET',
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
});

export default http;
