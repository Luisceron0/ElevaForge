interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'orange'
  className?: string
}

export default function Badge({
  children,
  variant = 'blue',
  className = '',
}: BadgeProps) {
  const variantClasses =
    variant === 'blue'
      ? 'bg-forge-blue-mid/20 text-forge-blue-light border-forge-blue-mid/40'
      : 'bg-forge-orange-main/10 text-forge-orange-main border-forge-orange-main/30'

  return (
    <span
      className={`inline-block px-4 py-1 rounded-full text-sm font-semibold border ${variantClasses} ${className}`}
    >
      {children}
    </span>
  )
}
