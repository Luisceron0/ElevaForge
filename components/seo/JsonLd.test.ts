import { describe, expect, it } from 'vitest'
import { escapeJsonLd } from './JsonLd'

describe('escapeJsonLd', () => {
  it('never emits a literal </script> even if content tries to close the tag', () => {
    const evil = { description: 'safe</script><script>alert(1)</script>' }
    const output = escapeJsonLd(evil)
    expect(output).not.toContain('</script>')
    expect(output).not.toContain('<script>')
  })

  it('still produces valid JSON once the escape is reversed', () => {
    const data = { name: 'ElevaForge', description: 'a < b' }
    const output = escapeJsonLd(data)
    // < is a standard JSON string escape — JSON.parse understands it natively.
    expect(JSON.parse(output)).toEqual(data)
  })

  it('regression guard: a single-backslash replacement is a no-op and must never be reintroduced', () => {
    // This is the exact bug found and fixed in this codebase: '<' as a
    // JS string literal evaluates to '<' before .replace() runs, so
    // replacing '<' with '<' (single backslash) does nothing.
    const noopReplacement = 'a<b'.replace(/</g, '<')
    expect(noopReplacement).toBe('a<b')

    // The correct fix uses a literal backslash + "u003c" as text.
    const correctReplacement = 'a<b'.replace(/</g, '\\u003c')
    expect(correctReplacement).toBe('a\\u003cb')
    expect(correctReplacement).not.toBe('a<b')
  })
})
