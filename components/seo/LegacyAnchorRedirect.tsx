'use client'

import { useEffect } from 'react'

// SEO-11: anclas viejas que ya no resuelven a ninguna sección de esta
// página. `#precios` desapareció con §11/ADR-003 (sin precios) y
// `#proyectos` con ADR-012 (la sección de proyectos se eliminó). Ambas
// apuntan ahora a `#soluciones` (la página /soluciones dedicada también se
// eliminó — ver este mismo cambio). `#proceso` y `#autonomia` siguen
// apuntando a secciones reales y no necesitan mapeo.
//
// Ambos destinos son anclas de ESTA MISMA página (Home) — no hace falta
// `router.replace` a otra ruta. Asignar `location.hash` directamente
// dispara el scroll nativo del navegador al elemento, algo que
// `router.replace`/`pushState` no hace por sí solo.
const LEGACY_ANCHOR_MAP: Record<string, string> = {
  '#precios': 'soluciones',
  '#proyectos': 'soluciones',
}

export default function LegacyAnchorRedirect() {
  useEffect(() => {
    const target = LEGACY_ANCHOR_MAP[window.location.hash]
    if (target) {
      window.location.hash = target
    }
  }, [])

  return null
}
