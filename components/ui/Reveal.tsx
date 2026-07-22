'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

type As = 'div' | 'section' | 'article' | 'li' | 'span'

interface RevealProps {
  children: React.ReactNode
  /** Wrapper element tag. Default 'div'. */
  as?: As
  /** Stagger direct children instead of animating the wrapper as one unit. */
  stagger?: boolean
  /** Delay in seconds before the reveal starts. */
  delay?: number
  className?: string
  id?: string
  'aria-label'?: string
}

/**
 * Scroll-reveal wrapper (RF-026 / DIS-03). Fades + lifts its content in when
 * it enters the viewport. Under prefers-reduced-motion it renders the content
 * at its natural visible state and never creates a tween — same lesson as
 * lib/gsap.ts: a `.from({opacity:0})` that never advances would leave content
 * invisible forever. Motion here is pure progressive enhancement: the content
 * is fully present in the SSR HTML regardless (no SEO/CLS cost).
 */
export default function Reveal({
  children,
  as = 'div',
  stagger = false,
  delay = 0,
  className = '',
  id,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el
      gsap.from(targets, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: 'power2.out',
        delay,
        stagger: stagger ? 0.09 : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [stagger, delay])

  const Tag = as as React.ElementType
  return (
    <Tag ref={ref} id={id} className={className} {...rest}>
      {children}
    </Tag>
  )
}
