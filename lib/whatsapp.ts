const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573150812166'

const MESSAGES = {
  hero:
    'Hola ElevaForge, quiero iniciar mi proyecto digital',
  roadmap:
    'Hola ElevaForge, quiero una asesoria gratuita sobre mi proyecto',
  familiaPresenciaDigital:
    'Hola ElevaForge, quiero conversar sobre una solución de Presencia Digital para mi negocio.',
  familiaSistemasGestion:
    'Hola ElevaForge, quiero conversar sobre un Sistema de Gestión para mi negocio.',
  familiaSoftwarePersonalizado:
    'Hola ElevaForge, quiero conversar sobre una solución de Software Personalizado.',
} as const

export const WHATSAPP_URLS = {
  base: `https://wa.me/${WHATSAPP_NUMBER}`,
  hero: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES.hero)}`,
  roadmap: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES.roadmap)}`,
  familiaPresenciaDigital: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES.familiaPresenciaDigital)}`,
  familiaSistemasGestion: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES.familiaSistemasGestion)}`,
  familiaSoftwarePersonalizado: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES.familiaSoftwarePersonalizado)}`,
}

export function buildWhatsAppURL(message?: string): string {
  if (!message) return WHATSAPP_URLS.hero
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
