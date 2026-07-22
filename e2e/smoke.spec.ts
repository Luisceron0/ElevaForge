import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('homepage loads with the expected title and no console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    const response = await page.goto('/')
    expect(response?.status()).toBeLessThan(400)
    await expect(page).toHaveTitle(/ElevaForge/)
    expect(consoleErrors).toEqual([])
  })

  test('CSP header is present on the homepage response (proxy.ts)', async ({ page }) => {
    const response = await page.goto('/')
    const csp = response?.headers()['content-security-policy']
    expect(csp).toBeTruthy()
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain('strict-dynamic')
  })

  test('/api/health responds 200', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBe(200)
  })

  test('/admin/login is reachable and does not redirect to the public site', async ({ page }) => {
    const response = await page.goto('/admin/login')
    expect(response?.status()).toBeLessThan(400)
    await expect(page.locator('form')).toBeVisible()
  })

  test('robots.txt disallows /api/ and /admin/', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('/api/')
    expect(body).toContain('/admin/')
  })

  test('sitemap.xml includes all indexable pages, including /nosotros (SEO-02)', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('/nosotros')
    expect(body).toContain('/privacidad')
    expect(body).toContain('/terminos')
  })

  test('no two header nav links point to the same destination (F-07)', async ({ page }) => {
    await page.goto('/')
    const hrefs = await page.locator('header nav ul a').evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).getAttribute('href')),
    )
    expect(hrefs.length).toBeGreaterThan(0)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  test('Lighthouse trust scores render their real value in the raw HTML, not 0 (F-08/RF-018)', async ({ request }) => {
    const response = await request.get('/')
    const html = await response.text()
    // The Lighthouse score cards use aria-label="<realScore>" on the same
    // span whose SSR text content used to be hardcoded to "0" before GSAP
    // hydrated and animated it client-side.
    const scoreSpans = [...html.matchAll(/aria-label="(\d{1,3})">(\d{1,3})</g)]
    expect(scoreSpans.length).toBeGreaterThan(0)
    for (const [, ariaValue, textValue] of scoreSpans) {
      expect(textValue).toBe(ariaValue)
      expect(textValue).not.toBe('0')
    }
  })

  test('delivered project count agrees grammatically in Spanish (F-08)', async ({ request }) => {
    const response = await request.get('/')
    const html = await response.text()
    // Bug was: count=1 rendered the plural "proyectos entregados" regardless
    // of value (SRS evidence: "1 proyectos entregados").
    expect(html).not.toMatch(/>1<!--\s*-->\s*<!--\s*-->\s*proyectos entregados/)
    expect(html).toMatch(/>1<!--\s*-->\s*<!--\s*-->\s*proyecto entregado</)
  })

  test('geo metadata targets Colombia, not Mexico (SEO-01/ADR-002)', async ({ request }) => {
    const response = await request.get('/')
    const html = await response.text()
    expect(html).toContain('es_CO')
    expect(html).not.toContain('es_MX')
    expect(html).not.toContain('México')
  })

  test('no prices anywhere in the public HTML (ADR-003)', async ({ request }) => {
    const response = await request.get('/')
    const html = await response.text()
    // Old package model showed literal USD/COP prices — the new
    // "Familias de soluciones" section must never show a price.
    expect(html).not.toMatch(/USD\s*\$?\d/)
    expect(html).not.toMatch(/\bCOP\b/)
    expect(html).not.toMatch(/priceUsd|priceCop/)
  })

  test('home renders the 3 fixed familias de soluciones, no "Paquetes" (§11/§15)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#soluciones')).toBeVisible()
    const solucionesText = await page.locator('#soluciones').innerText()
    expect(solucionesText).toContain('Presencia Digital')
    expect(solucionesText).toContain('Sistemas de Gestión')
    expect(solucionesText).toContain('Software Personalizado')

    const navText = await page.locator('header nav').innerText()
    expect(navText).not.toContain('Paquetes')
  })

  test('multipage IA: /soluciones, /proyectos, /proceso, /contacto all resolve (§14)', async ({ request }) => {
    for (const path of ['/soluciones', '/proyectos', '/proceso', '/contacto']) {
      const response = await request.get(path)
      expect(response.status(), `${path} should resolve`).toBeLessThan(400)
    }
  })

  test('/soluciones/[familia]: all 3 fixed familias resolve, unknown slug 404s', async ({ request }) => {
    for (const id of ['presencia-digital', 'sistemas-de-gestion', 'software-personalizado']) {
      const response = await request.get(`/soluciones/${id}`)
      expect(response.status(), `${id} should resolve`).toBe(200)
    }
    const notFound = await request.get('/soluciones/no-existe')
    expect(notFound.status()).toBe(404)
  })

  test('/proyectos/[slug]: delivered project resolves with BreadcrumbList JSON-LD', async ({ page, request }) => {
    const listResponse = await request.get('/proyectos')
    expect(listResponse.status()).toBe(200)

    // AVC is the seeded "entregado" project in DEFAULT_PROJECTS.
    const response = await page.goto('/proyectos/avc')
    expect(response?.status()).toBeLessThan(400)
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents()
    const hasBreadcrumb = jsonLdScripts.some((s) => s.includes('BreadcrumbList'))
    expect(hasBreadcrumb).toBe(true)
  })

  test('legacy #precios anchor redirects client-side to /soluciones (SEO-11)', async ({ page }) => {
    await page.goto('/#precios')
    await page.waitForURL('**/soluciones')
    expect(page.url()).toContain('/soluciones')
  })

  test('Vercel Analytics script does not trigger a CSP violation (RF-017)', async ({ page }) => {
    const cspViolations: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && /content security policy|csp/i.test(msg.text())) {
        cspViolations.push(msg.text())
      }
    })

    await page.goto('/')
    // Give the client-boundary <Analytics /> effect a beat to inject its script.
    await page.waitForTimeout(1000)
    expect(cspViolations).toEqual([])
  })
})
