'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { trackWhatsAppClick } from '@/lib/analytics'

interface WhatsAppLinkProps extends ComponentProps<typeof Link> {
  /** Identifies which surface the click came from (e.g. "footer", "pricing-web"). No PII. */
  source: string
}

/**
 * Thin client-boundary wrapper so server components (Footer, PricingSection)
 * can render a WhatsApp link with click tracking (RF-017) without becoming
 * client components themselves.
 */
export default function WhatsAppLink({ source, onClick, ...props }: WhatsAppLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackWhatsAppClick(source)
        onClick?.(e)
      }}
    />
  )
}
