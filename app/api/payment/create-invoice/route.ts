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

    console.log('[create-invoice] received:', { amount, order_id })

    if (!amount || !order_id) {
      return NextResponse.json({ error: 'amount and order_id are required' }, { status: 400 })
    }

    const secretKey = process.env.PAYLINK_SECRET_KEY
    const appId = process.env.PAYLINK_APP_ID
    if (!secretKey || !appId) {
      console.error('[create-invoice] Paylink credentials not configured')
      return NextResponse.json({ error: 'Paylink credentials not configured' }, { status: 500 })
    }

    // Fetch order details
    const supabase = serviceClient()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, buyer_name, buyer_email, buyer_phone, total_halalas, user_id')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      console.error('[create-invoice] order not found:', orderError)
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

    // Create invoice in Paylink
    const paylinkResponse = await fetch('https://paylink.sa/api/createInvoice', {
      method: 'POST',
      headers: {
        'Authorization': secretKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount / 100, // Convert halalas to SAR
        currency: 'SAR',
        customer_name: firstName,
        customer_email: email,
        customer_mobile: phone,
        order_id: order_id.slice(0, 8),
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
        description: `Order #${order_id.slice(0, 8)}`,
        products: [
          {
            title: `Order #${order_id.slice(0, 8)}`,
            quantity: 1,
            price: amount / 100,
          }
        ],
      }),
    })

    if (!paylinkResponse.ok) {
      const errorText = await paylinkResponse.text()
      console.error('[create-invoice] Paylink API error:', errorText)
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
    }

    const paylinkData = await paylinkResponse.json()
    console.log('[create-invoice] Paylink invoice created:', paylinkData)

    return NextResponse.json({
      invoice_id: paylinkData.id,
      url: paylinkData.url,
    })
  } catch (err: any) {
    console.error('[create-invoice] unexpected error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
