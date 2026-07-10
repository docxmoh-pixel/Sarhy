import { headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('x-moyasar-signature');
    const secret = process.env.MOYASAR_SECRET_KEY;

    if (!secret) {
      return new Response('Moyasar secret key not configured', { status: 500 });
    }

    // التحقق من التوقيع (Signature) من Moyasar
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(body).digest('hex');

    if (signature !== digest) {
      console.error('Invalid signature:', { signature, digest });
      return new Response('Invalid signature', { status: 401 });
    }

    const payload = JSON.parse(body);

    if (payload.status === 'paid') {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll: () => [], setAll: () => {} } }
      );

      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', payload.metadata.order_id);

      if (error) return new Response('Update Failed', { status: 500 });

      return new Response('Success', { status: 200 });
    }

    return new Response('Payment not paid', { status: 200 });
  } catch (error) {
    console.error('Payment callback error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
