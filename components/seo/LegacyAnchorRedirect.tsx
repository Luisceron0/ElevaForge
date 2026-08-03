'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// SEO-11: anclas viejas que ya no resuelven a ninguna sección de esta
// página. `#precios` desapareció con §11/ADR-003 (sin precios) y
// `#proyectos` con ADR-012 (la sección de proyectos se eliminó). `#proceso`
// y `#autonomia` siguen apuntando a secciones reales y no necesitan mapeo.
// Un 301 real no es posible para un fragmento de URL — el navegador lo
// remueve antes de que la request llegue al servidor — así que tiene que
// ser un redirect client-side una vez cargada la página.
const LEGACY_ANCHOR_MAP: Record<string, string> = {
  '#precios': '/soluciones',
  '#proyectos': '/soluciones',
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
