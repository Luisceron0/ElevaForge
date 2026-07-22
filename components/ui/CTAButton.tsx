'use client'

import Link from 'next/link'
import { trackWhatsAppClick } from '@/lib/analytics'

interface CTAButtonProps {
  href?: string
  label?: string
  children?: React.ReactNode
  variant?: 'primary' | 'outline' | 'outline-light' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

export default function CTAButton({
  href,
  label,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ariaLabel,
  target,
  rel,
  onClick,
  disabled = false,
}: CTAButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center text-center gap-2.5 font-semibold px-6 py-3 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ef-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ef-paper text-base leading-none cursor-pointer'
  const variantClasses = {
    // Orange is the SECONDARY accent (ADR-011). It stays as a fill with ink
    // text (6.36:1); white-on-orange fails AA (2.81:1) so never used. Hover
    // inverts to an ink pill with orange text (also 6.36:1) — an intentional
    // editorial flip, both states verified.
    primary:
      'bg-ef-orange text-ef-ink hover:bg-ef-ink hover:text-ef-orange hover:scale-[1.02] active:scale-[0.98]',
    // For use ON dark panels (ink/teal): cream outline that fills to cream.
    outline:
      'border border-ef-paper/45 text-ef-paper hover:bg-ef-paper hover:text-ef-ink',
    // For use ON light panels (cream): ink outline that fills to ink.
    'outline-light':
      'border border-ef-ink/25 text-ef-ink hover:bg-ef-ink hover:text-ef-paper focus-visible:ring-offset-ef-paper',
    ghost:
      'text-ef-teal hover:text-ef-ink hover:bg-ef-ink/5',
  }

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    full: 'w-full justify-center px-6 py-3 text-base',
  }

  const content = <span>{children ?? label}</span>

  const disabledClasses = disabled
    ? 'opacity-60 pointer-events-none cursor-not-allowed'
    : ''

  const mergedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`
  const finalLabel = ariaLabel ?? label

  if (href) {
    const isExternal = href.startsWith('http')
    const isWhatsApp = href.includes('wa.me')

    return (
      <Link
        href={href}
        target={target ?? (isExternal ? '_blank' : '_self')}
        rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
        aria-label={finalLabel}
        aria-disabled={disabled}
        className={mergedClassName}
        onClick={isWhatsApp ? () => trackWhatsAppClick(finalLabel || href) : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      aria-label={finalLabel}
      className={mergedClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  )
}
