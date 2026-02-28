import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { isAuthorizedWorker } from '@/lib/security/worker-auth'
import { logSecurityEvent } from '@/lib/security/logger'

const MAX_ATTEMPTS = 5
// When running once per day we can increase the batch size to process backlog.
const BATCH_SIZE = 200

async function processBatch() {
  const supabase = createServerSupabaseClient()

  // Quick lightweight count check — if zero pending leads, return immediately.
  const head = await supabase
    .from('leads')
    .select('id', { head: true, count: 'exact' })
    .eq('status', 'pending')
    .lt('attempts', MAX_ATTEMPTS)

  if (head.error) {
    console.error('Error checking pending leads count:', head.error)
    throw head.error
  }

  const pendingCount = head.count ?? 0
  if (!pendingCount || pendingCount === 0) {
    return { processed: 0, sent: 0, failed: 0 }
  }

  // Fetch a batch of pending leads (ordered by oldest)
  const { data: rows, error: fetchError } = await supabase
    .from('leads')
    .select('id,nombre,email,presupuesto,contacto_pref,origen,attempts')
    .eq('status', 'pending')
    .lt('attempts', MAX_ATTEMPTS)
    .order('created_at', { ascending: true })
    .limit(BATCH_SIZE)

  if (fetchError) {
    console.error('Error fetching pending leads:', fetchError)
    throw fetchError
  }

  if (!rows || rows.length === 0) return { processed: 0, sent: 0, failed: 0 }

  const webhook = process.env.DISCORD_WEBHOOK_URL
  if (!webhook) throw new Error('DISCORD_WEBHOOK_URL not configured')

  // Build aggregated messages while respecting Discord's 2000 char limit.
  const MAX_LEN = 1900
  const messages: string[] = []
  const header = `Nuevos leads: ${pendingCount} (procesando ${rows.length} en este lote)`
  let current = header + '\n\n'

  for (const lead of rows) {
    const line = `- ${lead.nombre} — ${lead.email} — ${lead.presupuesto || 'N/A'} — ${lead.contacto_pref || 'N/A'}`
    if ((current + line + '\n').length > MAX_LEN) {
      messages.push(current)
      current = ''
    }
    current += line + '\n'
  }
  if (current.trim().length > 0) messages.push(current)

  let sent = 0
  let failed = 0

  // Send each aggregated message with a small delay between to avoid rate limits
  for (const msg of messages) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: msg }),
      })

      const now = new Date().toISOString()

      if (res.ok) {
        // Mark all leads in this batch as sent — we mark individually below as well
        sent += rows.length
      } else {
        failed += rows.length
      }

      // Small sleep to be nice with rate limits
      await new Promise((r) => setTimeout(r, 200))
    } catch (err) {
      console.error('Error sending aggregated message to Discord:', err)
      failed += rows.length
    }
  }

  // Update each lead's status individually (to track attempts and failures precisely)
  for (const lead of rows) {
    const id = lead.id
    const now = new Date().toISOString()
    const nextAttempts = (lead.attempts || 0) + 1
    const update: Record<string, unknown> = { attempts: nextAttempts, last_attempt_at: now }
    if (sent > 0) update.status = 'sent'
    if (failed > 0 && sent === 0) update.status = nextAttempts >= MAX_ATTEMPTS ? 'failed' : 'pending'
    try {
      await supabase.from('leads').update(update).eq('id', id)
    } catch (err) {
      console.error('Error updating lead status for id', id, err)
    }
  }

  return { processed: rows.length, sent, failed }
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

async function handleWorkerRequest(req: NextRequest) {
  // A07: Timing-safe auth check via shared utility
  if (!isAuthorizedWorker(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const result = await processBatch()
    return NextResponse.json({ ok: true, ...result })
  } catch (err: unknown) {
    // A10: Never expose internal errors to caller — log and return generic message
    logSecurityEvent({
      type: 'UNHANDLED_ERROR',
      ip: getClientIp(req),
      path: req.nextUrl.pathname,
      method: req.method,
      details: err instanceof Error ? err.message : 'unknown',
    })
    console.error('Worker error:', err)
    return NextResponse.json({ ok: false, error: 'Internal processing error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return handleWorkerRequest(req)
}

export async function POST(req: NextRequest) {
  return handleWorkerRequest(req)
}
