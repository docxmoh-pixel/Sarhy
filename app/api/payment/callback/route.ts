import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('x-paylink-signature');
    const secret = process.env.PAYLINK_SECRET_KEY;

    console.log('[webhook] received. signature:', signature);
    console.log('[webhook] body:', body.slice(0, 500));

    if (!secret) {
      console.error('[webhook] PAYLINK_SECRET_KEY not configured');
      return new Response('Secret key not configured', { status: 500 });
    }

    // Paylink sends webhook with order status
    const payload = JSON.parse(body);
    console.log('[webhook] parsed payload:', JSON.stringify(payload, null, 2));
    console.log('[webhook] status:', payload.status, '| order_id:', payload.order_id, '| invoice_id:', payload.id);

    // Paylink sends 'paid' for successful payments
    if (payload.status === 'paid') {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const orderId = payload.order_id;
      if (!orderId) {
        console.error('[webhook] no order_id in payload');
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

    console.log('[webhook] payment not paid, status was:', payload.status);
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('[webhook] unexpected error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
