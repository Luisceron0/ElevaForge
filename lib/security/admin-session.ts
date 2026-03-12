import crypto from 'crypto'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const ADMIN_COOKIE_NAME = 'ef_admin_session'
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8
const SCRYPT_N = 16384
const SCRYPT_R = 8
const SCRYPT_P = 1
const SCRYPT_KEYLEN = 64

interface SessionPayload {
  u: string
  exp: number
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)

  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}

function getSessionSeed() {
  return process.env.ADMIN_SESSION_SEED || process.env.SUPABASE_SERVICE_ROLE_KEY || 'elevaforge-admin'
}

function base64Url(input: string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function signData(data: string): string {
  const seed = getSessionSeed()
  return crypto.createHmac('sha256', seed).update(data).digest('hex')
}

export function hashAdminPassword(plainPassword: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(plainPassword, salt, SCRYPT_KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  })

  return ['scrypt', SCRYPT_N, SCRYPT_R, SCRYPT_P, salt, hash.toString('hex')].join('$')
}

function verifyPasswordWithHash(plainPassword: string, storedHash: string): boolean {
  const parts = storedHash.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false

  const N = Number(parts[1])
  const r = Number(parts[2])
  const p = Number(parts[3])
  const salt = parts[4]
  const expected = parts[5]

  if (!N || !r || !p || !salt || !expected) return false

  const candidate = crypto.scryptSync(plainPassword, salt, expected.length / 2, { N, r, p }).toString('hex')
  return timingSafeEqual(candidate, expected)
}

async function verifyAgainstSupabase(username: string, password: string): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('admin_users')
      .select('password_hash,is_active')
      .eq('username', username)
      .maybeSingle()

    if (error || !data || !data.is_active) {
      return false
    }

    return verifyPasswordWithHash(password, String(data.password_hash || ''))
  } catch {
    return false
  }
}

function verifyAgainstLegacyEnv(username: string, password: string): boolean {
  const envUsername = process.env.ADMIN_USERNAME
  const envPassword = process.env.ADMIN_PASSWORD
  if (!envUsername || !envPassword) return false
  return timingSafeEqual(username, envUsername) && timingSafeEqual(password, envPassword)
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (!username || !password) return false

  const supabaseOk = await verifyAgainstSupabase(username, password)
  if (supabaseOk) return true

  // Backward compatibility for one legacy env admin while migrating.
  return verifyAgainstLegacyEnv(username, password)
}

export function createAdminSessionToken(username: string): string {
  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  }

  const payloadJson = JSON.stringify(payload)
  const payloadEncoded = base64Url(payloadJson)
  const signature = signData(payloadEncoded)
  return `${payloadEncoded}.${signature}`
}

function parseSessionToken(token: string | undefined): SessionPayload | null {
  if (!token || !token.includes('.')) return null

  const [payloadEncoded, signature] = token.split('.')
  if (!payloadEncoded || !signature) return null

  const expectedSignature = signData(payloadEncoded)
  if (!timingSafeEqual(signature, expectedSignature)) return null

  try {
    const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString('utf-8')) as SessionPayload
    if (!payload.u || typeof payload.exp !== 'number') return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function isValidAdminSession(token: string | undefined): boolean {
  return Boolean(parseSessionToken(token))
}

export function getSessionUsername(token: string | undefined): string | null {
  return parseSessionToken(token)?.u ?? null
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME
}

export function getAdminSessionTtlSeconds(): number {
  return ADMIN_SESSION_TTL_SECONDS
}

export async function hasAdminSession(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE_NAME)?.value
  return isValidAdminSession(token)
}

export function hasAdminSessionInRequest(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value
  return isValidAdminSession(token)
}
