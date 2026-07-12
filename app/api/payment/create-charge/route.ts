import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, order_id } = body

    console.log('[create-charge] received:', { amount, order_id })

    if (!amount || !order_id) {
      return NextResponse.json({ error: 'amount and order_id are required' }, { status: 400 })
    }

    const secret_key = process.env.TAP_SECRET_KEY
    if (!secret_key) {
      console.error('[create-charge] TAP_SECRET_KEY not configured')
      return NextResponse.json({ error: 'Tap secret key not configured' }, { status: 500 })
    }

    // Fetch order details
    const supabase = serviceClient()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, buyer_name, buyer_email, buyer_phone, total_halalas, user_id')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      console.error('[create-charge] order not found:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Fetch user details if order customer info is missing
    let firstName = order.buyer_name?.split(' ')[0] || order.buyer_name || 'Customer'
    let email = order.buyer_email
    let phone = order.buyer_phone

    if (!email || !phone) {
      const { data: userData } = await supabase.auth.admin.getUserById(order.user_id)
      if (userData?.user) {
        email = email || userData.user.email
        phone = phone || userData.user.phone
      }
    }

    // Ensure required fields have values
    firstName = firstName || 'Customer'
    email = email || 'customer@example.com'
    phone = phone || '500000000'

    // Create charge in Tap
    const tapResponse = await fetch('https://api.tap.company/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount / 100, // Convert halalas to SAR
        currency: 'SAR',
        customer: {
          first_name: firstName,
          email: email,
          phone: {
            country_code: '966',
            number: phone.replace(/^0/, '').replace(/\D/g, ''),
          },
        },
        source: {
          id: 'src_all',
        },
        post: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
        },
        redirect: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/pay/${order_id}/success`,
        },
        metadata: {
          order_id: order_id,
        },
        description: `Order #${order_id.slice(0, 8)}`,
      }),
    })

    if (!tapResponse.ok) {
      const errorText = await tapResponse.text()
      console.error('[create-charge] Tap API error:', errorText)
      return NextResponse.json({ error: 'Failed to create charge' }, { status: 500 })
    }

    const tapData = await tapResponse.json()
    console.log('[create-charge] Tap charge created:', tapData.id)

    return NextResponse.json({
      charge_id: tapData.id,
      url: tapData.transaction?.url || tapData.url,
    })
  } catch (err: any) {
    console.error('[create-charge] unexpected error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
