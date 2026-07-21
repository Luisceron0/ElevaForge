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
    // RF-018 / A11Y-05: the count-up is progressive enhancement only — the
    // real value is already in the SSR markup below, so a user with
    // prefers-reduced-motion (or JS disabled/slow) never sees anything but
    // the final number.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const obj = { val: 0 }
      if (ref.current) ref.current.textContent = `0${suffix}`

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
        onComplete: () => {
          if (ref.current) ref.current.textContent = `${target}${suffix}`
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [target, duration, suffix])

  return (
    <span ref={ref} className={className} aria-label={`${target}${suffix}`}>
      {target}{suffix}
    </span>
  )
}
