import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = req.headers.get('authorization')
  return header === `Bearer ${secret}`
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const daysParam = url.searchParams.get('days')
    const days = Number(daysParam) || 30

    const threshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    const supabase = createServerSupabaseClient()

    // Delete sent leads older than threshold (discord_sent_at)
    const { data: deletedSent, error: errSent } = await supabase
      .from('leads')
      .delete()
      .eq('status', 'sent')
      .lt('discord_sent_at', threshold)
      .select('id')

    if (errSent) {
      console.error('Error deleting sent leads:', errSent)
      return NextResponse.json({ error: 'Error deleting sent leads' }, { status: 500 })
    }

    // Delete failed leads older than threshold (last_attempt_at)
    const { data: deletedFailed, error: errFailed } = await supabase
      .from('leads')
      .delete()
      .eq('status', 'failed')
      .lt('last_attempt_at', threshold)
      .select('id')

    if (errFailed) {
      console.error('Error deleting failed leads:', errFailed)
      return NextResponse.json({ error: 'Error deleting failed leads' }, { status: 500 })
    }

    const sentCount = Array.isArray(deletedSent) ? deletedSent.length : 0
    const failedCount = Array.isArray(deletedFailed) ? deletedFailed.length : 0

    return NextResponse.json({ ok: true, deleted: { sent: sentCount, failed: failedCount } })
  } catch (err) {
    console.error('Cleanup error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Allow GET for manual trigger via browser (still requires auth)
  return POST(req)
}
