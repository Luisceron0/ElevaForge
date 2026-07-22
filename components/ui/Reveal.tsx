'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/gsap'

type As = 'div' | 'section' | 'article' | 'li' | 'span'

interface RevealProps {
  children: React.ReactNode
  as?: As
  stagger?: boolean
  delay?: number
  className?: string
  id?: string
  'aria-label'?: string
}

/**
 * Scroll-reveal wrapper (RF-026 / DIS-03). Fades + lifts content in when it
 * enters the viewport.
 *
 * Robustness (this replaced a ScrollTrigger `.from()` version that could
 * leave content stuck at opacity:0 if the trigger never fired — real bug:
 * projects not rendering): the content is fully visible in SSR HTML; JS only
 * hides it *after* mount, reveals it via IntersectionObserver (which fires
 * immediately if the element is already on screen), and a fallback timer
 * force-shows it if the observer never fires for any reason. Under
 * prefers-reduced-motion nothing is hidden at all.
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

    const targets: Element[] = stagger ? Array.from(el.children) : [el]
    if (targets.length === 0) return

    gsap.set(targets, { opacity: 0, y: 28 })

    let done = false
    const reveal = () => {
      if (done) return
      done = true
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        delay,
        stagger: stagger ? 0.09 : 0,
        overwrite: true,
      })
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) reveal()
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)

    // Belt-and-suspenders: never let content stay hidden.
    const fallback = window.setTimeout(reveal, 1600)

    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
      gsap.set(targets, { clearProps: 'opacity,transform' })
    }
  }, [stagger, delay])

  const Tag = as as React.ElementType
  return (
    <Tag ref={ref} id={id} className={className} {...rest}>
      {children}
    </Tag>
  )
}
