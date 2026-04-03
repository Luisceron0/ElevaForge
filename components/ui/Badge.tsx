interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'orange' | 'neutral'
  className?: string
}

export default function Badge({
  children,
  variant = 'blue',
  className = '',
}: BadgeProps) {
  const variantClasses = {
    blue: 'bg-forge-blue-mid/15 text-forge-blue-light border-forge-blue-mid/30',
    orange:
      'bg-forge-orange-main/10 text-forge-orange-main border-forge-orange-main/30',
    neutral: 'bg-white/5 text-white/70 border-white/15',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold tracking-widest uppercase ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
