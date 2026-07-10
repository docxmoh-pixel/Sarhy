import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, order_id } = body;

    if (!amount || !order_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const moyasarApiKey = process.env.MOYASAR_SECRET_KEY;
    if (!moyasarApiKey) {
      return NextResponse.json({ error: 'Moyasar API key not configured' }, { status: 500 });
    }

    // Moyasar requires amount as a positive integer (halalas)
    const amountInt = Math.round(Number(amount));
    if (!amountInt || amountInt < 1) {
      return NextResponse.json({ error: `Invalid amount: ${amount}` }, { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

    const payload = {
      amount: amountInt,
      currency: 'SAR',
      description: `Order #${String(order_id).slice(0, 8)}`,
      callback_url: `${origin}/orders/success/${order_id}`,
      metadata: { order_id },
      source: { type: 'creditcard' },
    };

    const moyasarResponse = await fetch('https://api.moyasar.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${moyasarApiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await moyasarResponse.text();
    console.log('[Payment] Moyasar status:', moyasarResponse.status);
    console.log('[Payment] Moyasar body:', responseText);

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: `Moyasar non-JSON response (${moyasarResponse.status}): ${responseText.slice(0, 300)}` },
        { status: 500 }
      );
    }

    if (!moyasarResponse.ok) {
      const detail = responseData?.errors
        ? JSON.stringify(responseData.errors)
        : responseData?.message || JSON.stringify(responseData);
      return NextResponse.json(
        { error: `Moyasar error: ${detail}` },
        { status: 500 }
      );
    }

    if (!responseData.url) {
      return NextResponse.json(
        { error: `No URL in Moyasar response: ${JSON.stringify(responseData)}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: responseData.url,
      payment_id: responseData.id,
    });

  } catch (error: any) {
    console.error('[Payment] Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
