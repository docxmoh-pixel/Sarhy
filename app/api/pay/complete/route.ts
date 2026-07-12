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
    const { order_id, payment_id, payment_status } = body

    console.log('[pay/complete] received:', { order_id, payment_id, payment_status })

    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

    const supabase = serviceClient()

    // Fetch order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, user_id, total_halalas, status')
      .eq('id', order_id)
      .single()

    if (fetchError || !order) {
      console.error('[pay/complete] order not found:', fetchError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log('[pay/complete] order current status:', order.status)

    // Skip if already processed
    if (order.status === 'paid') {
      console.log('[pay/complete] already paid, skipping')
      return NextResponse.json({ ok: true })
    }

    // 1. Mark order paid
    const updatePayload: Record<string, any> = { status: 'paid' }
    if (payment_id) updatePayload.payment_id = payment_id

    const { error: updateError } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', order_id)

    if (updateError) {
      console.error('[pay/complete] update error:', updateError)
      // Try without payment_id in case column doesn't exist
      const { error: retryError } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', order_id)
      if (retryError) {
        console.error('[pay/complete] retry update error:', retryError)
        return NextResponse.json({ error: retryError.message }, { status: 500 })
      }
    }

    console.log('[pay/complete] order marked paid ✓')

    // 2. Clear buyer's cart
    if (order.user_id) {
      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', order.user_id)
      if (cartError) console.error('[pay/complete] cart clear error:', cartError)
      else console.log('[pay/complete] cart cleared ✓')
    }

    // 3. Notify each unique seller
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id')
      .eq('order_id', order_id)

    if (orderItems && orderItems.length > 0) {
      const productIds = orderItems.map((i: any) => i.product_id)
      const { data: products } = await supabase
        .from('products')
        .select('seller_id')
        .in('id', productIds)

      const sellerIds = [...new Set((products ?? []).map((p: any) => p.seller_id).filter(Boolean))]
      console.log('[pay/complete] notifying sellers:', sellerIds)

      if (sellerIds.length > 0) {
        const { error: notifError } = await supabase.from('notifications').insert(
          sellerIds.map((sellerId: string) => ({
            user_id: sellerId,
            title: 'طلب جديد 🎉',
            message: `تم استلام طلب جديد بقيمة ${(order.total_halalas / 100).toFixed(2)} ر.س`,
            type: 'purchase',
            is_read: false,
            action_url: '/creator/dashboard/orders',
          }))
        )
        if (notifError) console.error('[pay/complete] notification error:', notifError)
        else console.log('[pay/complete] sellers notified ✓')
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[pay/complete] unexpected error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
