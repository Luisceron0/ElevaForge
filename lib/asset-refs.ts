const STORAGE_REF_PREFIX = 'storage://'

export function getStorageBucketName(): string {
  return process.env.SUPABASE_STORAGE_BUCKET || 'site-assets'
}

export function toStorageAssetRef(path: string): string {
  const normalized = normalizeStoragePath(path)
  return normalized ? `${STORAGE_REF_PREFIX}${normalized}` : ''
}

export function isStorageAssetRef(value: string | null | undefined): boolean {
  return String(value ?? '').trim().startsWith(STORAGE_REF_PREFIX)
}

export function normalizeStoragePath(path: string | null | undefined): string {
  return String(path ?? '')
    .trim()
    .replace(/^\/+/, '')
}

export function extractStoragePath(value: string | null | undefined): string | null {
  const raw = String(value ?? '').trim()
  if (!raw) return null

  if (raw.startsWith(STORAGE_REF_PREFIX)) {
    return normalizeStoragePath(raw.slice(STORAGE_REF_PREFIX.length)) || null
  }

  if (/^(projects|about|members)\//i.test(raw)) {
    return normalizeStoragePath(raw)
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw)
      const bucket = getStorageBucketName()
      const match = url.pathname.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/(.+)$/)
      if (!match) return null
      if (match[1] !== bucket) return null
      return normalizeStoragePath(decodeURIComponent(match[2])) || null
    } catch {
      return null
    }
  }

  return null
}

export function isAssetRef(value: string | null | undefined): boolean {
  const raw = String(value ?? '').trim()
  if (!raw) return false
  if (raw.startsWith('/')) return true
  if (/^https?:\/\//i.test(raw)) return true
  return Boolean(extractStoragePath(raw))
}

export function normalizeAssetRef(value: string | null | undefined): string {
  const raw = String(value ?? '').trim()
  if (!raw) return ''

  const storagePath = extractStoragePath(raw)
  if (storagePath) {
    return toStorageAssetRef(storagePath)
  }

  return raw
}
