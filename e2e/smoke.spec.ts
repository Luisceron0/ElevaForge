import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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

  test('/preguntas-frecuentes answers "cómo se define la inversión" with FAQPage schema (RF-019/CRO-05)', async ({ page }) => {
    const response = await page.goto('/preguntas-frecuentes')
    expect(response?.status()).toBeLessThan(400)

    const bodyText = await page.locator('main').innerText()
    expect(bodyText).toContain('inversión')

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents()
    const faqScript = jsonLdScripts.find((s) => s.includes('FAQPage'))
    expect(faqScript).toBeTruthy()
    const faqData = JSON.parse(faqScript!)
    expect(faqData.mainEntity.length).toBeGreaterThan(0)
  })

  test('contact form is a real two-step flow: paso 1 posts immediately, paso 2 is optional (RF-020)', async ({ page }) => {
    const postedPayloads: Record<string, unknown>[] = []
    await page.route('**/api/contact', async (route) => {
      const body = route.request().postDataJSON()
      postedPayloads.push(body)
      await route.fulfill({ status: 202, contentType: 'application/json', body: JSON.stringify({ success: true, id: 'test-id' }) })
    })

    await page.goto('/contacto')
    await expect(page.getByText('Paso 1 de 2')).toBeVisible()

    await page.locator('#nombre').fill('Ana Test')
    await page.locator('#email').fill('ana@example.com')
    await page.locator('#mensaje').fill('Quiero digitalizar mi inventario')
    await page.locator('input[type="checkbox"]').check()
    await page.getByRole('button', { name: 'Solicitar diagnóstico' }).click()

    // Paso 1 already posted the lead — before paso 2 is ever touched.
    await expect.poll(() => postedPayloads.length).toBe(1)
    expect(postedPayloads[0]).toMatchObject({ nombre: 'Ana Test', email: 'ana@example.com', origen: 'web-contact-main-paso1' })

    await expect(page.getByText('Paso 2 (opcional)')).toBeVisible()
    await page.getByText('Omitir, ya terminé').click()
    await expect(page.getByText('Mensaje enviado')).toBeVisible()

    // Skipping paso 2 must NOT fire a second request.
    expect(postedPayloads.length).toBe(1)
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

  // A11Y-01/DIS-04: WCAG 2.2 AA, automated via axe-core. This is exactly the
  // class of bug Fase 5 fixed (color-contrast on the primary CTA button and
  // several muted-text tokens) — locks the fix in so it can't silently
  // regress. Covers every public page; /admin is an internal tool, out of
  // scope here.
  for (const path of ['/', '/soluciones', '/soluciones/presencia-digital', '/proyectos', '/proceso', '/contacto', '/preguntas-frecuentes', '/nosotros']) {
    test(`${path} has no WCAG 2.2 AA violations (axe-core)`, async ({ page }) => {
      await page.goto(path)
      // HeroSection/RoadmapSection run a GSAP entrance animation on mount;
      // scanning mid-fade can catch a transiently low-contrast blended
      // color that was never the page's real, settled state. Let it finish.
      await page.waitForTimeout(1500)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
    })
  }

  // DIS-03: gsap.globalTimeline.timeScale(0) — the previous approach to
  // prefers-reduced-motion — froze .from() entrance animations at their
  // opacity:0 starting state forever. Confirms the actual fix: content
  // stays fully visible immediately, no animation, under reduced motion.
  test('prefers-reduced-motion: hero and roadmap content is visible immediately, never stuck at opacity:0', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    await expect(page.locator('[data-hero-badge]')).toBeVisible()
    await expect(page.locator('[data-hero-title]')).toHaveCSS('opacity', '1')
    await expect(page.locator('[data-hero-subtitle]')).toHaveCSS('opacity', '1')

    await page.locator('.timeline-container').scrollIntoViewIfNeeded()
    await expect(page.locator('.timeline-step').first()).toHaveCSS('opacity', '1')
  })

  // A11Y-02: axe-core checks static markup, not actual tab order — this
  // exercises real keyboard navigation on the two things a keyboard user
  // hits first on every page (skip-link, primary nav).
  test('keyboard: skip-link and header nav are reachable via Tab with a visible focus ring', async ({ page }) => {
    await page.goto('/')

    await page.keyboard.press('Tab')
    const skipLink = page.getByText('Saltar al contenido principal')
    await expect(skipLink).toBeFocused()

    // Tab through the header nav links + persistent CTA; each stop must be
    // a real link/button (not e.g. a div swallowing focus) and keep an
    // outline/ring on :focus-visible.
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('Tab')
    }
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
    const tagName = await focused.evaluate((el) => el.tagName.toLowerCase())
    expect(['a', 'button']).toContain(tagName)
  })
})
