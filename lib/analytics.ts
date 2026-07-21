/**
 * Funnel event tracking (RF-017) — Vercel Analytics, no cookies, no PII.
 *
 * Event set matches the SRS exactly: page_view (automatic, via <Analytics />
 * in app/layout.tsx), click_whatsapp, form_start, form_submit_ok, form_error.
 *
 * Rule: properties passed here must never contain user-entered text (name,
 * email, message, etc.) — only structural/categorical values.
 */

import { track } from '@vercel/analytics'

export function trackWhatsAppClick(source: string): void {
  track('click_whatsapp', { source })
}

export function trackFormStart(formType: string): void {
  track('form_start', { form_type: formType })
}

export function trackFormSubmitOk(formType: string): void {
  track('form_submit_ok', { form_type: formType })
}

export function trackFormError(formType: string, reason: 'validation' | 'server'): void {
  track('form_error', { form_type: formType, reason })
}
