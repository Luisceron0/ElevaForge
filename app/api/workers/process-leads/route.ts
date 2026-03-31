import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { isAuthorizedWorker } from '@/lib/security/worker-auth'
import { logSecurityEvent } from '@/lib/security/logger'

const MAX_ATTEMPTS = 5
// When running once per day we can increase the batch size to process backlog.
const BATCH_SIZE = 200

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
  if (!isAllowedDiscordWebhook(webhook)) {
    throw new Error('DISCORD_WEBHOOK_URL has an invalid host or format')
  }

  // Build aggregated message chunks respecting Discord's 2000 char limit.
  // Track which lead IDs belong to each chunk so delivery outcome is per-lead.
  const MAX_LEN = 1900
  const messageGroups: { content: string; leadIds: string[] }[] = []
  const header = `Nuevos leads: ${pendingCount} (procesando ${rows.length} en este lote)`
  let currentContent = header + '\n\n'
  let currentIds: string[] = []

  for (const lead of rows) {
    const line = `- ${lead.nombre} — ${lead.email} — ${lead.presupuesto || 'N/A'} — ${lead.contacto_pref || 'N/A'}`
    if ((currentContent + line + '\n').length > MAX_LEN) {
      messageGroups.push({ content: currentContent, leadIds: currentIds })
      currentContent = ''
      currentIds = []
    }
    currentContent += line + '\n'
    currentIds.push(lead.id)
  }
  if (currentContent.trim().length > 0) messageGroups.push({ content: currentContent, leadIds: currentIds })

  const succeededIds = new Set<string>()

  // Send each chunk with a small delay between to avoid rate limits.
  // Only leads whose chunk delivered successfully are marked as sent.
  for (const group of messageGroups) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: group.content }),
      })
      if (res.ok) {
        group.leadIds.forEach((id) => succeededIds.add(id))
      }
      // Small sleep to be nice with rate limits
      await new Promise((r) => setTimeout(r, 200))
    } catch (err) {
      console.error('Error sending aggregated message to Discord:', err)
    }
  }

  // Update each lead's status individually based on per-chunk delivery outcome
  for (const lead of rows) {
    const id = lead.id
    const now = new Date().toISOString()
    const nextAttempts = (lead.attempts || 0) + 1
    const update: Record<string, unknown> = { attempts: nextAttempts, last_attempt_at: now }
    if (succeededIds.has(id)) {
      update.status = 'sent'
      update.discord_sent_at = now
    } else {
      update.status = nextAttempts >= MAX_ATTEMPTS ? 'failed' : 'pending'
    }
    try {
      await supabase.from('leads').update(update).eq('id', id)
    } catch (err) {
      console.error('Error updating lead status for id', id, err)
    }
  }

  return {
    processed: rows.length,
    sent: succeededIds.size,
    failed: rows.length - succeededIds.size,
  }
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

export async function GET() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405, headers: { Allow: 'POST' } })
}

export async function POST(req: NextRequest) {
  return handleWorkerRequest(req)
}
