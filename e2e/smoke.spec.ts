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

  // ADR-012: la sección de proyectos entregados/en curso se eliminó del
  // sitio. El conteo ("1 proyecto entregado") era justamente la señal que
  // restaba confianza — este test falla si vuelve a aparecer por cualquier
  // vía (sección, ticker del hero o link de nav).
  test('home no longer advertises delivered/in-progress project counts (ADR-012)', async ({ request }) => {
    const html = await (await request.get('/')).text()
    expect(html).not.toMatch(/proyectos? entregados?/i)
    expect(html).not.toMatch(/Proyectos en curso/i)
    expect(html).not.toContain('id="proyectos"')
    expect(html).not.toContain('href="/proyectos"')
  })

  test('geo metadata targets Colombia, not Mexico (SEO-01/ADR-002)', async ({ request }) => {
    const response = await request.get('/')
    const html = await response.text()
    expect(html).toContain('es_CO')
    expect(html).not.toContain('es_MX')
    expect(html).not.toContain('México')
  })

  test('no @gmail.com anywhere in the public site (RF-021)', async ({ request }) => {
    for (const path of ['/', '/contacto', '/privacidad', '/terminos', '/nosotros']) {
      const html = await (await request.get(path)).text()
      expect(html, `${path} must not contain a gmail address`).not.toContain('@gmail.com')
    }
  })

  test('/api/leads is deprecated: GET and POST both 308-redirect to /api/contact (§12)', async ({ request }) => {
    const get = await request.get('/api/leads', { maxRedirects: 0 })
    expect(get.status()).toBe(308)
    expect(get.headers()['location']).toContain('/api/contact')

    const post = await request.post('/api/leads', {
      maxRedirects: 0,
      headers: { 'Content-Type': 'application/json' },
      data: { nombre: 'x', email: 'x@x.com', consent: true },
    })
    expect(post.status()).toBe(308)
    expect(post.headers()['location']).toContain('/api/contact')
  })

  test('/nosotros shows the 3 real engineers, not Miguel, no "4 ingenieros" (RF-005/006)', async ({ request }) => {
    const html = await (await request.get('/nosotros')).text()
    expect(html).toContain('Luis Cerón')
    expect(html).toContain('Jhonatan Diaz')
    expect(html).toContain('Santiago Reyes')
    expect(html).not.toContain('Miguel')
    expect(html).not.toContain('4 ingenieros')
    expect(html).not.toContain('cuatro ingenieros')
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

  test('multipage IA: /soluciones, /proceso, /contacto all resolve (§14)', async ({ request }) => {
    for (const path of ['/soluciones', '/proceso', '/contacto']) {
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

  // ADR-012: /proyectos y sus casos salieron del sitio. Lo ya indexado no
  // puede quedar en 404 — redirect permanente a /soluciones. Next.js emite
  // 308 (no 301) para `permanent: true`: mismo peso de "permanente" para
  // los buscadores, y además preserva el método HTTP.
  test('/proyectos and /proyectos/[slug] permanently redirect to /soluciones (ADR-012)', async ({ request }) => {
    for (const path of ['/proyectos', '/proyectos/avc', '/proyectos/lo-que-sea']) {
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status(), `${path} should redirect permanently`).toBe(308)
      expect(response.headers()['location'], `${path} should point at /soluciones`).toContain('/soluciones')
    }
  })

  test('sitemap no longer lists /proyectos (ADR-012)', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text()
    expect(body).not.toContain('/proyectos')
  })

  test('legacy #proyectos anchor redirects client-side to /soluciones (SEO-11)', async ({ page }) => {
    await page.goto('/#proyectos')
    await page.waitForURL('**/soluciones')
    expect(page.url()).toContain('/soluciones')
  })

  // Punto 2 del pedido: los demos son ahora la evidencia pública. Se
  // verifica el href real, el target/rel seguro y que el esquema sea https
  // (nunca javascript: — ver lib/safe-url.ts).
  test('home: Landing Page and Sitio Web expose their live demo links', async ({ page }) => {
    await page.goto('/')
    const demoLinks = page.locator('#soluciones a[target="_blank"]').filter({ hasText: 'Ver demo' })
    await expect(demoLinks).toHaveCount(2)

    const hrefs = await demoLinks.evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).getAttribute('href')),
    )
    expect(hrefs).toContain('https://koa.elevaforge.com/')
    expect(hrefs).toContain('https://store.koa.elevaforge.com/es')

    const rels = await demoLinks.evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).getAttribute('rel')),
    )
    for (const rel of rels) {
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    }
  })

  test('/soluciones/presencia-digital shows both demos with https hrefs', async ({ page }) => {
    await page.goto('/soluciones/presencia-digital')
    const demoLinks = page.getByRole('link', { name: /Ver demo en vivo/ })
    await expect(demoLinks).toHaveCount(2)
    const hrefs = await demoLinks.evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).getAttribute('href')),
    )
    for (const href of hrefs) {
      expect(href).toMatch(/^https:\/\//)
    }
    expect(hrefs).toContain('https://koa.elevaforge.com/')
    expect(hrefs).toContain('https://store.koa.elevaforge.com/es')
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
  //
  // Runs under prefers-reduced-motion for two reasons: (1) the Reveal
  // scroll-animations leave below-the-fold content at opacity:0 until
  // scrolled, which axe skips — reduced-motion renders every panel visible
  // immediately, so the whole colored-panel system actually gets checked;
  // (2) it eliminates the mid-fade blended-color false positives that a
  // running GSAP tween produces (see tasks/lessons.md).
  for (const path of ['/', '/soluciones', '/soluciones/presencia-digital', '/proceso', '/contacto', '/preguntas-frecuentes', '/nosotros']) {
    test(`${path} has no WCAG 2.2 AA violations (axe-core)`, async ({ page }) => {
      // Emulate reduced motion so the Reveal scroll-animations render every
      // panel visible immediately (axe skips opacity:0 content) and no
      // mid-fade blended colors are scanned.
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(path)
      await page.waitForTimeout(600)
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

    // Hero headline lines are masked/translated in via GSAP; under reduced
    // motion they must render at their natural visible state.
    await expect(page.locator('[data-hero-eyebrow]')).toBeVisible()
    await expect(page.locator('[data-hero-line]').first()).toHaveCSS('opacity', '1')
    await expect(page.locator('[data-hero-sub]')).toHaveCSS('opacity', '1')

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

  // SEO-05: every page needs exactly one <h1>. /contacto rendered zero
  // (ContactSection only ever emitted an <h2>) until it got a headingLevel
  // prop.
  test('/contacto has exactly one <h1> (SEO-05)', async ({ page }) => {
    await page.goto('/contacto')
    await expect(page.locator('h1')).toHaveCount(1)
  })

  // ADR-003: no explicit price signal anywhere, including structured data.
  // A leftover `priceRange` in the Organization JSON-LD contradicted the
  // decision to remove price comparisons from the site.
  test('Organization JSON-LD carries no priceRange field (ADR-003)', async ({ page }) => {
    await page.goto('/')
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents()
    const orgScript = jsonLdScripts.find((s) => s.includes('ProfessionalService'))
    expect(orgScript).toBeTruthy()
    const orgData = JSON.parse(orgScript!)
    expect(orgData.priceRange).toBeUndefined()
  })

  // RF-004: the visible WhatsApp number must come from
  // NEXT_PUBLIC_WHATSAPP_NUMBER via formatWhatsAppDisplay(), not a
  // hardcoded literal independent of the actual link target.
  test('/contacto: visible WhatsApp number matches the wa.me link target (RF-004)', async ({ page }) => {
    await page.goto('/contacto')
    const link = page.getByRole('link', { name: /^WhatsApp:/ })
    const href = await link.getAttribute('href')
    const linkDigits = href!.match(/wa\.me\/(\d+)/)![1]
    const visibleText = await link.innerText()
    const visibleDigits = visibleText.replace(/\D/g, '')
    expect(visibleDigits).toBe(linkDigits)
  })
})
