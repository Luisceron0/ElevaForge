import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * DIS-03: call this before building any `.from()`-style entrance timeline
 * and skip creating the animation entirely when it's true.
 *
 * NOTE: this project previously tried `gsap.globalTimeline.timeScale(0)`
 * to respect prefers-reduced-motion. That freezes time for every nested
 * timeline, but `.from({ opacity: 0, ... })` applies its start state
 * immediately and only reaches the visible end state once the tween
 * advances — with time frozen, it never does. Result: content animated
 * with `.from()` (HeroSection, RoadmapSection) would stay invisible
 * forever for reduced-motion users, which is worse than no reduced-motion
 * handling at all. The correct fix is per-component: don't create the
 * `.from()` tween in the first place, so elements simply render at their
 * natural (visible) DOM state.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export { gsap, ScrollTrigger }
