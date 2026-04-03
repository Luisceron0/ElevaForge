'use client'

import { useEffect, useRef, useState } from 'react'
import CTAButton from '@/components/ui/CTAButton'
import { WHATSAPP_URLS } from '@/lib/whatsapp'

function sanitizeInput(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    contacto_pref: 'email',
    empresa: '',
    mensaje: '',
    presupuesto: '',
    servicio: '',
  })
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errorField, setErrorField] = useState<'' | 'nombre' | 'email' | 'consent'>('')
  const [honeypot, setHoneypot] = useState('')
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ((status === 'success' || status === 'error') && statusRef.current) {
      statusRef.current.focus()
    }
  }, [status])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || formData.nombre.trim().length < 2) {
      setStatus('error')
      setErrorField('nombre')
      setErrorMsg('El nombre es requerido (mínimo 2 caracteres).')
      return
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus('error')
      setErrorField('email')
      setErrorMsg('Por favor ingresa un email válido.')
      return
    }

    if (!consent) {
      setStatus('error')
      setErrorField('consent')
      setErrorMsg('Debes aceptar la política de privacidad para continuar.')
      return
    }

    setStatus('loading')
    setErrorField('')
    setErrorMsg('')

    try {
      const payload = {
        nombre: sanitizeInput(formData.nombre),
        email: sanitizeInput(formData.email),
        telefono: sanitizeInput(formData.telefono).slice(0, 32),
        empresa: sanitizeInput(formData.empresa).slice(0, 100),
        mensaje: sanitizeInput(formData.mensaje).slice(0, 500),
        servicio: sanitizeInput(formData.servicio).slice(0, 64),
        contacto_pref: sanitizeInput(formData.contacto_pref).slice(0, 16),
        presupuesto: sanitizeInput(formData.presupuesto).slice(0, 64),
        consent,
        origen: 'web-contact-main',
        _hp: honeypot,
      }

      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err?.error || 'Error al enviar el mensaje.')
      }

      setStatus('success')
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        contacto_pref: 'email',
        empresa: '',
        mensaje: '',
        presupuesto: '',
        servicio: '',
      })
      setConsent(false)
      setHoneypot('')
    } catch {
      setStatus('error')
      setErrorField('')
      setErrorMsg(
        'Hubo un error. Escríbenos directamente a elevaforge@gmail.com'
      )
    }
  }

  return (
    <section id="contacto" aria-label="Contacto" className="py-24 md:py-32 bg-forge-bg-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-start">
        <div>
          <h2 className="font-humanst text-white leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Hablemos de tu proyecto
          </h2>
          <p className="text-forge-text-body text-lg leading-relaxed max-w-xl mb-8">
            Te ayudamos a aterrizar tu idea con alcance claro, tiempos realistas
            y una propuesta transparente.
          </p>

          <div className="space-y-4 text-base">
            <a href={WHATSAPP_URLS.hero} target="_blank" rel="noopener noreferrer" className="block text-forge-blue-light hover:text-white transition-colors duration-200">
              WhatsApp: +57 315 081 2166
            </a>
            <a href="mailto:elevaforge@gmail.com" className="block text-forge-blue-light hover:text-white transition-colors duration-200">
              Email: elevaforge@gmail.com
            </a>
            <p className="text-forge-text-body">Tiempo de respuesta: Menos de 24 horas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="bg-forge-card-bg rounded-2xl border border-forge-blue-mid/25 p-6 md:p-8 shadow-forge-card space-y-5">
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold text-white/70 mb-2">Nombre *</label>
            <input id="nombre" name="nombre" required aria-required="true" aria-invalid={errorField === 'nombre'} aria-describedby={errorField === 'nombre' ? 'contact-error' : undefined} value={formData.nombre} onChange={handleChange} className="w-full bg-forge-surface border border-forge-blue-mid/25 rounded-lg px-4 py-3 text-white text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-forge-orange-main/50 focus:border-forge-orange-main/50 transition-all duration-200" placeholder="Tu nombre" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-white/70 mb-2">Email *</label>
            <input id="email" name="email" type="email" required aria-required="true" aria-invalid={errorField === 'email'} aria-describedby={errorField === 'email' ? 'contact-error' : undefined} value={formData.email} onChange={handleChange} className="w-full bg-forge-surface border border-forge-blue-mid/25 rounded-lg px-4 py-3 text-white text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-forge-orange-main/50 focus:border-forge-orange-main/50 transition-all duration-200" placeholder="tu@email.com" />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-semibold text-white/70 mb-2">Teléfono / WhatsApp</label>
            <input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-forge-surface border border-forge-blue-mid/25 rounded-lg px-4 py-3 text-white text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-forge-orange-main/50 focus:border-forge-orange-main/50 transition-all duration-200" placeholder="+57..." />
          </div>

          <fieldset>
            <legend className="block text-sm font-semibold text-white/70 mb-2">Preferencia de contacto</legend>
            <div className="flex gap-4">
              <label className="text-base text-white/80 inline-flex items-center gap-2">
                <input type="radio" name="contacto_pref" value="email" checked={formData.contacto_pref === 'email'} onChange={handleChange} className="accent-forge-orange-main" />
                Email
              </label>
              <label className="text-base text-white/80 inline-flex items-center gap-2">
                <input type="radio" name="contacto_pref" value="whatsapp" checked={formData.contacto_pref === 'whatsapp'} onChange={handleChange} className="accent-forge-orange-main" />
                WhatsApp
              </label>
            </div>
          </fieldset>

          <div>
            <label htmlFor="empresa" className="block text-sm font-semibold text-white/70 mb-2">Empresa</label>
            <input id="empresa" name="empresa" value={formData.empresa} onChange={handleChange} className="w-full bg-forge-surface border border-forge-blue-mid/25 rounded-lg px-4 py-3 text-white text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-forge-orange-main/50 focus:border-forge-orange-main/50 transition-all duration-200" placeholder="Nombre de tu empresa" />
          </div>

          <div>
            <label htmlFor="mensaje" className="block text-sm font-semibold text-white/70 mb-2">Cuéntanos tu idea</label>
            <textarea id="mensaje" name="mensaje" value={formData.mensaje} onChange={handleChange} maxLength={500} rows={5} className="w-full bg-forge-surface border border-forge-blue-mid/25 rounded-lg px-4 py-3 text-white text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-forge-orange-main/50 focus:border-forge-orange-main/50 transition-all duration-200" placeholder="Describe tu objetivo en pocas líneas" />
          </div>

          <div>
            <label htmlFor="presupuesto" className="block text-sm font-semibold text-white/70 mb-2">Presupuesto estimado</label>
            <select id="presupuesto" name="presupuesto" value={formData.presupuesto} onChange={handleChange} className="w-full bg-forge-surface border border-forge-blue-mid/25 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-forge-orange-main/50 focus:border-forge-orange-main/50 transition-all duration-200">
              <option value="">Seleccionar</option>
              <option value="hasta-500">Hasta 500 USD</option>
              <option value="500-1500">500 a 1500 USD</option>
              <option value="1500-3000">1500 a 3000 USD</option>
              <option value="3000+">3000+ USD</option>
            </select>
          </div>

          <div>
            <label htmlFor="servicio" className="block text-sm font-semibold text-white/70 mb-2">Servicio de interés</label>
            <select id="servicio" name="servicio" value={formData.servicio} onChange={handleChange} className="w-full bg-forge-surface border border-forge-blue-mid/25 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-forge-orange-main/50 focus:border-forge-orange-main/50 transition-all duration-200">
              <option value="">Seleccionar</option>
              <option value="landing">Sitio Web / Landing</option>
              <option value="pos">PoS + Inventario</option>
              <option value="custom">Software Personalizado</option>
            </select>
          </div>

          <label className="flex items-start gap-3 text-base text-white/80">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-forge-orange-main" required aria-required="true" aria-invalid={errorField === 'consent'} aria-describedby={errorField === 'consent' ? 'contact-error' : undefined} />
            Acepto la política de privacidad.
          </label>

          <CTAButton
            type="submit"
            size="full"
            ariaLabel="Enviar formulario de contacto"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Enviando...
              </span>
            ) : (
              'Enviar mensaje'
            )}
          </CTAButton>

          {status === 'success' && (
            <div
              ref={statusRef}
              tabIndex={-1}
              className="rounded-xl bg-green-500/10 border border-green-500/30 p-6 text-center text-green-300 text-base"
              role="status"
              aria-live="polite"
            >
              Mensaje enviado. Te contactamos en menos de 24 horas.
            </div>
          )}

          {status === 'error' && (
            <div
              ref={statusRef}
              tabIndex={-1}
              id="contact-error"
              className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 text-center text-red-300 text-base"
              role="alert"
            >
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
