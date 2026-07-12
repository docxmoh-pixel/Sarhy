import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('id')
  if (!orderId) return NextResponse.json({ error: 'Missing order id' }, { status: 400 })

  const supabase = serviceClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)

  const productIds = (orderItems ?? []).map((i: any) => i.product_id)
  const { data: products } = productIds.length
    ? await supabase.from('products').select('id, title, price_halalas, images').in('id', productIds)
    : { data: [] }

  const items = (orderItems ?? []).map((item: any) => ({
    ...item,
    product: (products ?? []).find((p: any) => p.id === item.product_id) ?? null,
  }))

  return NextResponse.json({ order, items })
}
