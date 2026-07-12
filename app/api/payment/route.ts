import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { order_id, amount } = await request.json()
    if (!order_id) return NextResponse.json({ error: 'order_id is required' }, { status: 400 })
    return NextResponse.json({ order_id, amount })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
