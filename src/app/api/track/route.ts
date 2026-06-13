import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const path = new URL(req.url).searchParams.get('path') ?? '/'
  await supabase.from('page_visits').insert({ path })

  return NextResponse.json({ ok: true })
}
