import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

// Clerk webhook endpoint with signature verification
http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    // Get Svix headers for verification
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');

    // If no secret or headers, skip verification in development
    const shouldVerify = webhookSecret && svixId && svixTimestamp && svixSignature;

    const payload = await request.text();
    let eventData: any;

    if (shouldVerify) {
      try {
        const wh = new Webhook(webhookSecret);
        eventData = wh.verify(payload, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        });
      } catch (err) {
        console.error('Clerk webhook verification failed:', err);
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      // Development mode - parse without verification
      eventData = JSON.parse(payload);
      console.warn('Clerk webhook verification skipped - CLERK_WEBHOOK_SECRET not set');
    }

    const eventType = eventData.type;
    const userData = eventData.data;

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
      console.error('Webhook processing error:', error);
      return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),
});

// MTN MoMo webhook callback
http.route({
  path: '/mtn-momo-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();

      console.log('MTN MoMo webhook received:', JSON.stringify(payload));

      // Extract data from MTN callback
      const { externalId, status, financialTransactionId } = payload;

      if (!externalId) {
        return new Response(JSON.stringify({ error: 'Missing externalId' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Map MTN status to our status
      const paymentStatus =
        status === 'SUCCESSFUL' ? 'completed' : status === 'FAILED' ? 'failed' : 'processing';

      // Update transaction
      await ctx.runMutation(internal.transactions.internalUpdateStatus, {
        transactionId: externalId,
        paymentStatus,
        externalId: financialTransactionId,
        callbackReceived: true,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('MTN MoMo webhook error:', error);
      return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),
});

// Orange Money webhook callback
http.route({
  path: '/orange-money-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();

      console.log('Orange Money webhook received:', JSON.stringify(payload));

      // Extract data from Orange callback
      const { status, order_id, txnid, notif_token } = payload;

      if (!order_id) {
        return new Response(JSON.stringify({ error: 'Missing order_id' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Process the notification via internal action
      await ctx.runAction(internal.actions.orangeMoney.handlePaymentNotification, {
        notifToken: notif_token || '',
        status: status || 'FAILED',
        orderId: order_id,
        txnId: txnid,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Orange Money webhook error:', error);
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
    return new Response(
      JSON.stringify({
        status: 'ok',
        timestamp: Date.now(),
        version: '1.0.0',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }),
});

export default http;
