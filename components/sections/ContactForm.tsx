'use client'

import { useState, useRef, useEffect } from 'react'

interface ContactFormProps {
  type?: 'general' | 'proyecto' | 'consulta'
}

/** Sanitize text input - strip control characters */
function sanitizeInput(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

export default function ContactForm({ type = 'general' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    mensaje: '',
    telefono: '',
    contacto_pref: 'email',
    presupuesto: '',
    servicio: '',
  })
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  // A06: Honeypot anti-bot field — invisible to users, bots auto-fill it
  const [honeypot, setHoneypot] = useState('')
  const statusRef = useRef<HTMLDivElement>(null)

  // Focus the status message when it changes (for screen readers)
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

  /** Store lightweight lead in DB via /api/contact (outbox pattern). */
  async function saveLead(extra?: Record<string, string>) {
    const payload = {
      nombre: sanitizeInput(formData.nombre),
      email: sanitizeInput(formData.email),
      contacto_pref: sanitizeInput(formData.contacto_pref).slice(0, 16),
      presupuesto: sanitizeInput(formData.presupuesto).slice(0, 64),
      consent: true,
      _hp: honeypot,
      ...extra,
    }
    const resp = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return resp
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre || formData.nombre.trim().length < 2) {
      setStatus('error')
      setErrorMsg('El nombre es requerido (mínimo 2 caracteres)')
      return
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus('error')
      setErrorMsg('Por favor ingresa un email válido')
      return
    }
    if (!consent) {
      setStatus('error')
      setErrorMsg('Debe aceptar la política de privacidad para continuar')
      return
    }

    setStatus('loading')
    setErrorMsg('')
    try {
      const resp = await saveLead()
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err?.error || 'Error al enviar el mensaje')
      }

      setStatus('success')
      setFormData({ nombre: '', email: '', empresa: '', mensaje: '', telefono: '', contacto_pref: 'email', presupuesto: '', servicio: '' })
      setHoneypot('')
      setConsent(false)

      // Navegar en la misma pestaña a la sección Roadmap de Transparencia y hacer scroll suave
      try {
        const url = '/?hideTestimonials=1#proceso'
        // Si ya estamos en la página raíz, actualizamos la URL y hacemos scroll suave.
        if (window.location.pathname === '/' || window.location.pathname === '') {
          history.replaceState(null, '', url)
          setTimeout(() => {
            const el = document.getElementById('proceso')
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            else window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 100)
        } else {
          // Si estamos en otra ruta, navegamos en la misma pestaña hacia la URL con ancla.
          window.location.href = url
        }
      } catch (err) {
        // Silenciar errores de navegación
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  if (status === 'success') {
    return (
      <div
        ref={statusRef}
        className="text-center py-8"
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h4 className="font-humanst text-xl text-forge-bg-dark mb-2">
          ¡Mensaje enviado!
        </h4>
        <p className="text-forge-bg-dark/70">
          Nos pondremos en contacto contigo pronto.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-forge-orange-main hover:underline text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:ring-offset-2 rounded"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
      aria-label="Formulario de contacto"
    >
      {/* A06: Honeypot field — hidden from humans, bots auto-fill it */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden pointer-events-none"
      >
        <label htmlFor={`website-${type}`}>Website</label>
        <input
          id={`website-${type}`}
          name="website"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor={`nombre-${type}`}
          className="block text-sm font-semibold text-forge-bg-dark mb-1.5"
        >
          Nombre <span aria-hidden="true">*</span>
          <span className="sr-only">(requerido)</span>
        </label>
        <input
          id={`nombre-${type}`}
          name="nombre"
          type="text"
          required
          autoComplete="name"
          maxLength={100}
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre completo"
          aria-required="true"
          className="w-full px-4 py-3 rounded-xl border border-forge-blue-mid/20 bg-white text-forge-bg-dark placeholder:text-forge-bg-dark/40 focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:border-transparent transition-[border-color,box-shadow] duration-150"
        />
      </div>

      <div>
        <label
          htmlFor={`email-${type}`}
          className="block text-sm font-semibold text-forge-bg-dark mb-1.5"
        >
          Email <span aria-hidden="true">*</span>
          <span className="sr-only">(requerido)</span>
        </label>
        <input
          id={`email-${type}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          aria-required="true"
          className="w-full px-4 py-3 rounded-xl border border-forge-blue-mid/20 bg-white text-forge-bg-dark placeholder:text-forge-bg-dark/40 focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:border-transparent transition-[border-color,box-shadow] duration-150"
        />
      </div>

      <div>
        <label
          htmlFor={`telefono-${type}`}
          className="block text-sm font-semibold text-forge-bg-dark mb-1.5"
        >
          Teléfono / WhatsApp
        </label>
        <input
          id={`telefono-${type}`}
          name="telefono"
          type="tel"
          autoComplete="tel"
          maxLength={32}
          value={formData.telefono}
          onChange={handleChange}
          placeholder="+57 3xx xxx xxxx (opcional)"
          className="w-full px-4 py-3 rounded-xl border border-forge-blue-mid/20 bg-white text-forge-bg-dark placeholder:text-forge-bg-dark/40 focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:border-transparent transition-[border-color,box-shadow] duration-150"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-forge-bg-dark mb-1.5">Preferencia de contacto</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm text-forge-bg-dark">
            <input type="radio" name="contacto_pref" value="email" checked={formData.contacto_pref==='email'} onChange={(e)=> setFormData(prev=>({...prev, contacto_pref: e.target.value}))} />
            <span>Email</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-forge-bg-dark">
            <input type="radio" name="contacto_pref" value="telefono" checked={formData.contacto_pref==='telefono'} onChange={(e)=> setFormData(prev=>({...prev, contacto_pref: e.target.value}))} />
            <span>Teléfono / WhatsApp</span>
          </label>
        </div>
      </div>

      <div>
        <label
          htmlFor={`empresa-${type}`}
          className="block text-sm font-semibold text-forge-bg-dark mb-1.5"
        >
          Empresa
        </label>
        <input
          id={`empresa-${type}`}
          name="empresa"
          type="text"
          autoComplete="organization"
          maxLength={100}
          value={formData.empresa}
          onChange={handleChange}
          placeholder="Nombre de tu empresa (opcional)"
          className="w-full px-4 py-3 rounded-xl border border-forge-blue-mid/20 bg-white text-forge-bg-dark placeholder:text-forge-bg-dark/40 focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:border-transparent transition-[border-color,box-shadow] duration-150"
        />
      </div>

      <div>
        <label
          htmlFor={`mensaje-${type}`}
          className="block text-sm font-semibold text-forge-bg-dark mb-1.5"
        >
          Cuéntanos tu idea
        </label>
        <textarea
          id={`mensaje-${type}`}
          name="mensaje"
          rows={4}
          maxLength={500}
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="Describe brevemente tu proyecto o necesidad..."
          className="w-full px-4 py-3 rounded-xl border border-forge-blue-mid/20 bg-white text-forge-bg-dark placeholder:text-forge-bg-dark/40 focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:border-transparent transition-[border-color,box-shadow] duration-150 resize-none"
        />
        <p className="text-xs text-forge-bg-dark/40 mt-1" aria-live="polite">
          {formData.mensaje.length}/500 caracteres
        </p>
      </div>

      <div>
        <label htmlFor={`presupuesto-${type}`} className="block text-sm font-semibold text-forge-bg-dark mb-1.5">Presupuesto estimado (precios en USD; equivalente en COP)</label>
        <select id={`presupuesto-${type}`} name="presupuesto" value={formData.presupuesto} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-forge-blue-mid/20 bg-white text-forge-bg-dark focus:outline-none focus:ring-2 focus:ring-forge-orange-main">
          <option value="">Selecciona una opción (opcional)</option>
          <option value="80">Desde $80 (≈ 304.000 COP) — PoS / Gestor de inventario</option>
          <option value="125_web">Desde $125 (≈ 475.000 COP) — Sitio web institucional</option>
          <option value="80_custom">Desde $80 (≈ 304.000 COP) — Software personalizado</option>
          <option value="otro">Otro / No estoy seguro</option>
        </select>
      </div>

      <div>
        <label htmlFor={`servicio-${type}`} className="block text-sm font-semibold text-forge-bg-dark mb-1.5">Servicio de interés</label>
        <select id={`servicio-${type}`} name="servicio" value={formData.servicio} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-forge-blue-mid/20 bg-white text-forge-bg-dark focus:outline-none focus:ring-2 focus:ring-forge-orange-main">
          <option value="">Selecciona</option>
          <option value="mvp">MVP / Producto inicial</option>
          <option value="crecimiento">Producto y crecimiento</option>
          <option value="auditoria">Auditoría técnica</option>
          <option value="consultoria">Consultoría técnica</option>
        </select>
      </div>

      <div className="flex items-start gap-3">
        <input id={`consent-${type}`} name="consent" type="checkbox" checked={consent} onChange={(e)=> setConsent(e.target.checked)} className="mt-1" />
        <label htmlFor={`consent-${type}`} className="text-sm text-forge-bg-dark">Acepto la <a href="/privacidad" className="text-forge-orange-main underline">política de privacidad</a> y el tratamiento de mis datos.</label>
      </div>

      {status === 'error' && (
        <div
          ref={statusRef}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
          className="text-red-600 text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
        className="w-full bg-forge-orange-main hover:bg-forge-orange-gold text-white font-bold py-3 px-6 rounded-xl shadow-cta transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:ring-offset-2 flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </span>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Enviar mensaje
          </>
        )}
      </button>

    </form>
  )
}
