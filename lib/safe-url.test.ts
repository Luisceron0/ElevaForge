import { describe, expect, it } from 'vitest'
import { isSafeExternalUrl, safeExternalUrl } from './safe-url'

describe('safeExternalUrl', () => {
  it('accepts the real demo urls of the catalog', () => {
    expect(safeExternalUrl('https://koa.elevaforge.com/')).toBe('https://koa.elevaforge.com/')
    expect(safeExternalUrl('https://store.koa.elevaforge.com/es')).toBe('https://store.koa.elevaforge.com/es')
  })

  it('accepts http as well as https (una demo interna puede no tener TLS todavía)', () => {
    expect(safeExternalUrl('http://localhost:3000/demo')).toBe('http://localhost:3000/demo')
  })

  it('trims surrounding whitespace', () => {
    expect(safeExternalUrl('  https://koa.elevaforge.com/  ')).toBe('https://koa.elevaforge.com/')
  })

  // Cada uno de estos, puesto crudo en un href, ejecuta script en el
  // navegador del visitante o lo saca del sitio sin que se note.
  it.each([
    ['javascript:alert(1)', 'esquema ejecutable'],
    ['JaVaScRiPt:alert(1)', 'esquema ejecutable con mayúsculas mezcladas'],
    ['\tjavascript:alert(1)', 'esquema ejecutable con tab adelante'],
    ['  javascript:alert(1)', 'esquema ejecutable con espacios adelante'],
    ['data:text/html,<script>alert(1)</script>', 'data URI'],
    ['vbscript:msgbox(1)', 'vbscript'],
    ['file:///etc/passwd', 'file'],
    ['//evil.example.com', 'protocol-relative'],
    ['koa.elevaforge.com', 'sin esquema'],
    ['/soluciones', 'ruta relativa'],
    ['', 'vacío'],
    [null, 'null'],
    [undefined, 'undefined'],
    [{ toString: (): string => 'javascript:alert(1)' }, 'objeto que se stringifica a javascript:'],
  ])('rejects %s (%s)', (value: unknown, _reason: string) => {
    expect(safeExternalUrl(value)).toBeUndefined()
    expect(isSafeExternalUrl(value)).toBe(false)
  })
})
