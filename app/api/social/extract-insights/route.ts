import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

function makeSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  )
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = makeSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { posts } = await req.json() as { posts: { id: string; [key: string]: unknown }[] }

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ skipped: 0, saved: 0, ignored: 0 })
    }

    // جلب المنشورات المعالجة مسبقاً من processed_posts
    const { data: done, error: doneErr } = await supabase
      .from('processed_posts')
      .select('post_id')

    if (doneErr) throw doneErr

    const doneIds = new Set((done ?? []).map((r: { post_id: string }) => r.post_id))

    const newPosts = posts.filter(p => !doneIds.has(p.id))
    if (newPosts.length === 0) {
      return NextResponse.json({ skipped: posts.length, saved: 0, ignored: 0 })
    }

    let saved = 0
    let ignored = 0
    const processedRows: { post_id: string }[] = []

    for (const post of newPosts) {
      const insight = extractInsight(post)

      if (insight) {
        const { error: insErr } = await supabase
          .from('benchmark_insights')
          .insert({ ...insight, created_by: user.id })

        if (!insErr) saved++
        else ignored++
      } else {
        ignored++
      }

      // سجّل المنشور كمعالَج بغض النظر عن النتيجة
      processedRows.push({ post_id: post.id })
    }

    if (processedRows.length > 0) {
      const { error: trackErr } = await supabase
        .from('processed_posts')
        .upsert(processedRows, { onConflict: 'post_id', ignoreDuplicates: true })

      if (trackErr) throw trackErr
    }

    return NextResponse.json({
      skipped: posts.length - newPosts.length,
      saved,
      ignored,
    })
  } catch (err) {
    console.error('[extract-insights]', err)
    return NextResponse.json({ error: 'Failed to extract insights' }, { status: 500 })
  }
}

function extractInsight(post: { id: string; [key: string]: unknown }) {
  const text = (post.text ?? post.content ?? post.body ?? '') as string
  if (!text || text.trim().length < 20) return null

  return {
    post_id: post.id,
    source: post.source ?? 'social',
    content: text.trim(),
    metadata: post,
  }
}
