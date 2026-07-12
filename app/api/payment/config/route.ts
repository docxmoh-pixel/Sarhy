import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.NEXT_PUBLIC_TAP_PUBLIC_KEY
  if (!key) return NextResponse.json({ error: 'NEXT_PUBLIC_TAP_PUBLIC_KEY not configured' }, { status: 500 })
  return NextResponse.json({ public_key: key })
}
