'use client'

import { useRef, useLayoutEffect } from 'react'
import { gsap } from '@/lib/gsap'

interface AnimatedNumberProps {
  target: number
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedNumber({
  target,
  suffix = '',
  duration = 1.5,
  className = '',
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = Math.round(obj.val) + suffix
          }
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [target, duration, suffix])

  return (
    <span ref={ref} className={className} aria-label={`${target}${suffix}`}>
      0{suffix}
    </span>
  )
}
