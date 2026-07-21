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
})
