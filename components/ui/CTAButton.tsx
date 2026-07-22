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
    'inline-flex items-center justify-center text-center gap-2.5 font-semibold px-6 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-orange-main focus-visible:ring-offset-2 focus-visible:ring-offset-forge-bg-dark text-base leading-none cursor-pointer'
  const variantClasses = {
    // Dark text on the vivid orange fill — white-on-orange-main is 2.8:1
    // (fails WCAG AA's 4.5:1 for normal text); forge-bg-dark on orange-main
    // is 6.13:1, and on the orange-gold hover state it's 8.79:1.
    primary:
      'bg-forge-orange-main hover:bg-forge-orange-gold text-forge-bg-dark shadow-forge-cta hover:shadow-forge-hover hover:scale-[1.02] active:scale-[0.98]',
    outline:
      'border border-forge-orange-main/60 text-forge-orange-main hover:bg-forge-orange-main hover:text-forge-bg-dark hover:border-forge-orange-main',
    'outline-light':
      'border border-forge-blue-mid text-forge-blue-deep hover:bg-forge-blue-deep hover:text-white focus-visible:ring-offset-forge-bg-light',
    ghost:
      'text-forge-blue-light hover:text-white hover:bg-forge-blue-mid/15',
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
