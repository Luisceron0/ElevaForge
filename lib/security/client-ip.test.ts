import { describe, expect, it, vi, afterEach } from 'vitest'
import { getTrustedClientIp } from './client-ip'

function makeRequest(headerMap: Record<string, string>) {
  return {
    headers: {
      get: (name: string) => headerMap[name.toLowerCase()] ?? null,
    },
  }
}

describe('getTrustedClientIp', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('trusts x-real-ip (the header @vercel/functions#ipAddress reads) in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const req = makeRequest({ 'x-real-ip': '203.0.113.9', 'x-forwarded-for': '9.9.9.9' })
    expect(getTrustedClientIp(req)).toBe('203.0.113.9')
  })

  it('falls back to x-vercel-forwarded-for when x-real-ip is absent, in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const req = makeRequest({ 'x-vercel-forwarded-for': '198.51.100.7, 10.0.0.1' })
    expect(getTrustedClientIp(req)).toBe('198.51.100.7')
  })

  it('never trusts a client-supplied x-forwarded-for in production (F-01)', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4' })
    expect(getTrustedClientIp(req)).toBe('unknown')
  })

  it('falls back to raw headers only outside production, for local dev convenience', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(getTrustedClientIp(req)).toBe('1.2.3.4')
  })

  it('returns "unknown" when no IP header is present at all', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const req = makeRequest({})
    expect(getTrustedClientIp(req)).toBe('unknown')
  })
})
