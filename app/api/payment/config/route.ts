import { NextResponse } from 'next/server'

export async function GET() {
  const appId = process.env.PAYLINK_APP_ID
  if (!appId) return NextResponse.json({ error: 'PAYLINK_APP_ID not configured' }, { status: 500 })
  return NextResponse.json({ app_id: appId })
}
