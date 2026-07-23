/**
 * Next.js instrumentation hook — runs once per server instance cold start.
 * https://nextjs.org/docs/app/guides/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { checkLegacyAdminCoexistence } = await import('@/lib/security/admin-bootstrap-check')
  await checkLegacyAdminCoexistence()
}
