import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('x-tap-signature');
    const secret = process.env.TAP_SECRET_KEY;

    console.log('[webhook] received. signature:', signature);
    console.log('[webhook] body:', body.slice(0, 500));

    if (!secret) {
      console.error('[webhook] TAP_SECRET_KEY not configured');
      return new Response('Secret key not configured', { status: 500 });
    }

    // Verify HMAC signature (Tap uses SHA256 HMAC)
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(body).digest('hex');

    if (signature !== digest) {
      console.error('[webhook] signature mismatch. expected:', digest, 'got:', signature);
      return new Response('Invalid signature', { status: 401 });
    }

    const payload = JSON.parse(body);
    console.log('[webhook] parsed payload:', JSON.stringify(payload, null, 2));
    console.log('[webhook] status:', payload.status, '| order_id:', payload.metadata?.order_id, '| charge_id:', payload.id);

    // Tap sends 'CAPTURED' for successful payments
    if (payload.status === 'CAPTURED') {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const orderId = payload.metadata?.order_id;
      if (!orderId) {
        console.error('[webhook] no order_id in metadata');
        return new Response('Missing order_id', { status: 400 });
      }

      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      if (error) {
        console.error('[webhook] DB update error:', error);
        return new Response('DB update failed', { status: 500 });
      }

      console.log('[webhook] order', orderId, 'marked paid ✓');
      return new Response('OK', { status: 200 });
    }

    console.log('[webhook] payment not captured, status was:', payload.status);
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('[webhook] unexpected error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
