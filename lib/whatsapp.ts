export function buildWhatsAppURL(message?: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573150812166'
  const defaultMsg =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Hola ElevaForge, quiero iniciar mi proyecto digital'
  const text = encodeURIComponent(message ?? defaultMsg)
  return `https://wa.me/${number}?text=${text}`
}
