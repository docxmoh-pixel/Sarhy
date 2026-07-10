import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const sellerId = request.nextUrl.searchParams.get('id')
  if (!sellerId) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data: profile } = await supabaseAdmin
    .from('seller_profiles')
    .select('store_name')
    .eq('id', sellerId)
    .single()

  if (profile?.store_name) {
    return NextResponse.json({ name: profile.store_name })
  }

  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(sellerId)
  const fullName = userData?.user?.user_metadata?.full_name ?? null

  return NextResponse.json({ name: fullName })
}
