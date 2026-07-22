import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { isAuthorizedWorker } from '@/lib/security/worker-auth'
import { logSecurityEvent } from '@/lib/security/logger'
import { getTrustedClientIp } from '@/lib/security/client-ip'

const MAX_ATTEMPTS = 5
// When running once per day we can increase the batch size to process backlog.
const BATCH_SIZE = 200
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elevaforge.com'

function isAllowedDiscordWebhook(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    const host = parsed.hostname.toLowerCase()
    const isDiscordHost = host === 'discord.com' || host === 'discordapp.com'
    return isDiscordHost && parsed.pathname.startsWith('/api/webhooks/')
  } catch {
    return false
  }
}

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

  // Only IDs + attempts leave the DB — NO PII. The lead content (nombre,
  // email, mensaje, etc.) is reviewed exclusively in /admin/leads; the
  // notification below is intentionally PII-free (RF-012 revisado: los leads
  // se quedan en el administrador para revisión, a Discord solo llega el
  // aviso de que hay leads nuevos). Esto satisface minimización de datos
  // (Ley 1581) y evita mandar PII a un tercero (Discord).
  const { data: rows, error: fetchError } = await supabase
    .from('leads')
    .select('id,attempts')
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
  if (!isAllowedDiscordWebhook(webhook)) {
    throw new Error('DISCORD_WEBHOOK_URL has an invalid host or format')
  }

  // Single PII-free notification pointing to the admin panel for review.
  const plural = rows.length === 1 ? 'nuevo lead' : 'nuevos leads'
  const content = `🔔 ${rows.length} ${plural} en ElevaForge. Revisalos en el panel: ${SITE_URL}/admin/leads`

  let delivered = false
  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    delivered = res.ok
  } catch (err) {
    console.error('Error sending notification to Discord:', err)
  }

  // One notification for the whole batch → all leads share its outcome.
  const now = new Date().toISOString()
  for (const lead of rows) {
    const nextAttempts = (lead.attempts || 0) + 1
    const update: Record<string, unknown> = { attempts: nextAttempts, last_attempt_at: now }
    if (delivered) {
      update.status = 'sent'
      update.discord_sent_at = now
    } else {
      update.status = nextAttempts >= MAX_ATTEMPTS ? 'failed' : 'pending'
    }
    try {
      await supabase.from('leads').update(update).eq('id', lead.id)
    } catch (err) {
      console.error('Error updating lead status for id', lead.id, err)
    }
  }

  return {
    processed: rows.length,
    sent: delivered ? rows.length : 0,
    failed: delivered ? 0 : rows.length,
  }
}

async function handleWorkerRequest(req: NextRequest) {
  const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
  // A07: Timing-safe auth check via shared utility
  if (!isAuthorizedWorker(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE })
  }
  try {
    const result = await processBatch()
    return NextResponse.json({ ok: true, ...result }, { headers: NO_STORE })
  } catch (err: unknown) {
    // A10: Never expose internal errors to caller — log and return generic message
    logSecurityEvent({
      type: 'UNHANDLED_ERROR',
      ip: getTrustedClientIp(req),
      path: req.nextUrl.pathname,
      method: req.method,
      details: err instanceof Error ? err.message : 'unknown',
    })
    console.error('Worker error:', err)
    return NextResponse.json({ ok: false, error: 'Internal processing error' }, { status: 500, headers: NO_STORE })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405, headers: { Allow: 'POST' } })
}

export async function POST(req: NextRequest) {
  return handleWorkerRequest(req)
}
