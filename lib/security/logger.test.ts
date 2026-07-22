import { describe, expect, it, vi, afterEach } from 'vitest'
import { hashIdentifier, logSecurityEvent } from './logger'

describe('hashIdentifier', () => {
  it('never returns the raw input value', () => {
    expect(hashIdentifier('admin@elevaforge.com')).not.toContain('admin@elevaforge.com')
  })

  it('is deterministic, so repeated attempts on the same account stay correlatable', () => {
    expect(hashIdentifier('someuser')).toBe(hashIdentifier('someuser'))
  })

  it('differs across distinct identifiers', () => {
    expect(hashIdentifier('userA')).not.toBe(hashIdentifier('userB'))
  })
})

describe('logSecurityEvent — RF-015 (no cleartext identifiers in LOGIN_FAILED/LOGIN_SUCCESS)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('never writes a raw username to the log output', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const username = 'sensitive-admin-name'

    logSecurityEvent({
      type: 'LOGIN_FAILED',
      ip: '203.0.113.1',
      path: '/api/admin/login',
      method: 'POST',
      details: `user_hash: ${hashIdentifier(username)}`,
    })

    const loggedLine = warnSpy.mock.calls[0][0] as string
    expect(loggedLine).not.toContain(username)
  })
})
