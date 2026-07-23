'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// SEO-11: `#precios` is the one old in-page anchor that no longer resolves
// to anything on this page (the section was renamed to #soluciones as part
// of §11/ADR-003, dropping prices). `#proyectos`, `#proceso` and
// `#autonomia` still point to real sections here and need no mapping.
// A real 301 isn't possible for a URL fragment — it's stripped by the
// browser before the request ever reaches the server — so this has to be
// a client-side redirect once the page has loaded.
const LEGACY_ANCHOR_MAP: Record<string, string> = {
  '#precios': '/soluciones',
}

export default function LegacyAnchorRedirect() {
  const router = useRouter()

  useEffect(() => {
    const target = LEGACY_ANCHOR_MAP[window.location.hash]
    if (target) {
      router.replace(target)
    }
  }, [router])

  return null
}
