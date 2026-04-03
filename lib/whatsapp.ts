const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573150812166'

const MESSAGES = {
  hero:
    'Hola ElevaForge, quiero iniciar mi proyecto digital',
  roadmap:
    'Hola ElevaForge, quiero una asesoria gratuita sobre mi proyecto',
  pricingWeb:
    'Hola ElevaForge, estoy interesado en el paquete Sitio Web / Landing. ¿Podemos conversar?',
  pricingPos:
    'Hola ElevaForge, estoy interesado en el paquete PoS + Gestor de Inventario. ¿Podemos conversar?',
  pricingCustom:
    'Hola ElevaForge, estoy interesado en Software Personalizado. ¿Podemos conversar?',
} as const

export const WHATSAPP_URLS = {
  base: `https://wa.me/${WHATSAPP_NUMBER}`,
  hero: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES.hero)}`,
  roadmap: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES.roadmap)}`,
  pricingWeb: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES.pricingWeb)}`,
  pricingPos: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES.pricingPos)}`,
  pricingCustom: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES.pricingCustom)}`,
}

export function buildWhatsAppURL(message?: string): string {
  if (!message) return WHATSAPP_URLS.hero
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
