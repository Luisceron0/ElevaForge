import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { hasActiveAdminSessionInRequest } from '@/lib/security/admin-access'
import { validateOrigin } from '@/lib/security/csrf'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function getBucketName(): string {
  return process.env.SUPABASE_STORAGE_BUCKET || 'site-assets'
}

function sanitizeFolder(raw: string): 'projects' | 'about' | 'members' {
  const folder = raw.trim().toLowerCase()
  if (folder === 'members') return 'members'
  return folder === 'about' ? 'about' : 'projects'
}

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image'
}

export async function POST(request: NextRequest) {
  if (!(await hasActiveAdminSessionInRequest(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const origin = validateOrigin(request)
  if (!origin.valid) {
    return NextResponse.json({ error: 'Solicitud no autorizada' }, { status: 403 })
  }

  const ip = getClientIp(request)
  const rl = checkRateLimit(`${ip}:${request.nextUrl.pathname}`, {
    maxRequests: 20,
    windowMs: 60_000,
  })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Demasiados intentos, intenta más tarde' }, { status: 429 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Formulario inválido' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Debes adjuntar un archivo' }, { status: 400 })
  }

  if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: 'La imagen debe pesar máximo 5 MB' }, { status: 413 })
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: 'Formato no permitido. Usa JPG, PNG, WEBP, GIF o AVIF' }, { status: 415 })
  }

  const folder = sanitizeFolder(String(form.get('folder') ?? 'projects'))
  const ext = EXT_BY_MIME[file.type] || 'bin'
  const filenameSlug = toSlug(file.name)
  const path = `${folder}/${Date.now()}-${filenameSlug}-${randomUUID()}.${ext}`
  const bucket = getBucketName()

  const bytes = await file.arrayBuffer()
  const supabase = createServerSupabaseClient()
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, Buffer.from(bytes), {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json(
      { error: `No se pudo subir la imagen: ${uploadError.message}` },
      { status: 500 },
    )
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return NextResponse.json({
    path,
    bucket,
    publicUrl: data.publicUrl,
  })
}
