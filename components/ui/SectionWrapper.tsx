interface SectionWrapperProps {
  children: React.ReactNode
  id?: string
  variant?: 'dark' | 'light'
  className?: string
}

export default function SectionWrapper({
  children,
  id,
  variant = 'dark',
  className = '',
}: SectionWrapperProps) {
  const bgClass =
    variant === 'dark' ? 'bg-forge-bg-dark' : 'bg-forge-bg-light'

  return (
    <section id={id} className={`py-24 ${bgClass} ${className}`}>
      <div className="max-w-6xl mx-auto px-6">{children}</div>
    </section>
  )
}
