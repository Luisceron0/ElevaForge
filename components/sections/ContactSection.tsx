'use client'

import { useEffect, useRef, useState } from 'react'
import CTAButton from '@/components/ui/CTAButton'
import { WHATSAPP_URLS, WHATSAPP_DISPLAY } from '@/lib/whatsapp'
import { trackWhatsAppClick, trackFormStart, trackFormSubmitOk, trackFormError } from '@/lib/analytics'

const FORM_TYPE = 'contact-main'

function sanitizeInput(value: string): string {
  return value.replace(/\p{Cc}/gu, '').trim()
}

interface ContactSectionProps {
  title?: string
  description?: string
  responseTime?: string
  headingLevel?: 'h1' | 'h2'
}

type Step = 'uno' | 'dos' | 'listo'
type Status = 'idle' | 'loading' | 'error'

const EMPTY_STEP_DOS = {
  telefono: '',
  contacto_pref: 'email',
  empresa: '',
  presupuesto: '',
  servicio: '',
}

export default function ContactSection({ title, description, responseTime, headingLevel = 'h2' }: ContactSectionProps) {
  const Heading = headingLevel
  const [step, setStep] = useState<Step>('uno')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errorField, setErrorField] = useState<'' | 'nombre' | 'email' | 'consent'>('')
  const [honeypot, setHoneypot] = useState('')
  const [consent, setConsent] = useState(false)
  const [stepUno, setStepUno] = useState({ nombre: '', email: '', mensaje: '' })
  const [stepDos, setStepDos] = useState(EMPTY_STEP_DOS)
  const statusRef = useRef<HTMLDivElement>(null)
  const hasTrackedStart = useRef(false)

  useEffect(() => {
    if (status === 'error' && statusRef.current) {
      statusRef.current.focus()
    }
  }, [status])

  function trackStart() {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true
      trackFormStart(FORM_TYPE)
    }
  }

  const handleStepUnoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    trackStart()
    const { name, value } = e.target
    setStepUno((prev) => ({ ...prev, [name]: value }))
  }

  const handleStepDosChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setStepDos((prev) => ({ ...prev, [name]: value }))
  }

  // RF-020: paso 1 (≤4 campos) ya crea el lead como 'pending' — el
  // backend (leadSchema, POST /api/contact) no cambia. El SRS deja
  // explícitamente abierto si el paso 2 debe actualizar ese mismo lead o
  // insertar uno nuevo; "actualizar" requeriría un endpoint público nuevo
  // para editar un lead ajeno sin autenticación (superficie de ataque
  // nueva: ID guessing, rate-limit propio, etc.) que nadie revisó todavía.
  // Se optó por la opción que no toca el backend: el paso 2, si el
  // usuario lo completa, es un segundo insert con el mismo email/consent
  // y un origen distinguible — dos filas en vez de un update. Documentado
  // acá y en tasks/todo.md para que se pueda revisar la decisión.
  async function postLead(extra: Record<string, unknown>) {
    const payload = {
      nombre: sanitizeInput(stepUno.nombre),
      email: sanitizeInput(stepUno.email),
      mensaje: sanitizeInput(stepUno.mensaje).slice(0, 500),
      consent,
      _hp: honeypot,
      ...extra,
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
  }

  const handleSubmitStepUno = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stepUno.nombre || stepUno.nombre.trim().length < 2) {
      setStatus('error')
      setErrorField('nombre')
      setErrorMsg('El nombre es requerido (mínimo 2 caracteres).')
      trackFormError(FORM_TYPE, 'validation')
      return
    }

    if (!stepUno.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stepUno.email)) {
      setStatus('error')
      setErrorField('email')
      setErrorMsg('Por favor ingresa un email válido.')
      trackFormError(FORM_TYPE, 'validation')
      return
    }

    if (!consent) {
      setStatus('error')
      setErrorField('consent')
      setErrorMsg('Debes aceptar la política de privacidad para continuar.')
      trackFormError(FORM_TYPE, 'validation')
      return
    }

    setStatus('loading')
    setErrorField('')
    setErrorMsg('')

    try {
      await postLead({ origen: 'web-contact-main-paso1' })
      setStatus('idle')
      setStep('dos')
      trackFormSubmitOk(FORM_TYPE)
    } catch {
      setStatus('error')
      setErrorField('')
      setErrorMsg('Hubo un error. Escríbenos directamente a contacto@elevaforge.com')
      trackFormError(FORM_TYPE, 'server')
    }
  }

  const handleSubmitStepDos = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      await postLead({
        telefono: sanitizeInput(stepDos.telefono).slice(0, 32),
        empresa: sanitizeInput(stepDos.empresa).slice(0, 100),
        servicio: sanitizeInput(stepDos.servicio).slice(0, 64),
        contacto_pref: sanitizeInput(stepDos.contacto_pref).slice(0, 16),
        presupuesto: sanitizeInput(stepDos.presupuesto).slice(0, 64),
        origen: 'web-contact-main-paso2',
      })
      setStatus('idle')
      setStep('listo')
    } catch {
      setStatus('error')
      setErrorMsg('No pudimos guardar los datos adicionales, pero ya recibimos tu mensaje inicial.')
      trackFormError(FORM_TYPE, 'server')
    }
  }

  return (
    <section id="contacto" aria-label="Contacto" className="py-24 md:py-32 bg-ef-ink">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-start">
        <div>
          <p className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-ef-paper/60 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ef-orange" aria-hidden="true" />
            Solicitá tu diagnóstico
          </p>
          <Heading className="font-humanst text-fluid-display text-ef-paper leading-[0.95] mb-5">
            {title || 'Hablemos de tu proyecto'}
          </Heading>
          <p className="text-ef-paper/70 text-lg leading-relaxed max-w-xl mb-8">
            {description || 'Te ayudamos a aterrizar tu idea con alcance claro, tiempos realistas y una propuesta transparente.'}
          </p>

          <div className="space-y-4 text-base">
            <a
              href={WHATSAPP_URLS.hero}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('contact-section')}
              className="block text-ef-paper/80 hover:text-ef-orange transition-colors duration-200"
            >
              WhatsApp: {WHATSAPP_DISPLAY}
            </a>
            <a href="mailto:contacto@elevaforge.com" className="block text-ef-paper/80 hover:text-ef-orange transition-colors duration-200">
              Email: contacto@elevaforge.com
            </a>
            <p className="text-ef-paper/70">Tiempo de respuesta: {responseTime || 'Menos de 24 horas'}</p>
          </div>
        </div>

        <div className="bg-ef-paper/[0.04] rounded-3xl border border-ef-paper/12 p-6 md:p-8 backdrop-blur-sm">
          {step !== 'listo' && (
            <div className="flex items-center gap-3 mb-6 text-xs font-semibold uppercase tracking-widest text-ef-paper/60">
              <span className={step === 'uno' ? 'text-ef-orange' : ''}>Paso 1 de 2</span>
              <span className="h-px flex-1 bg-ef-paper/15" />
              <span className={step === 'dos' ? 'text-ef-orange' : ''}>Paso 2 (opcional)</span>
            </div>
          )}

          {step === 'uno' && (
            <form onSubmit={handleSubmitStepUno} noValidate className="space-y-5">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-ef-paper/70 mb-2">Nombre *</label>
                <input id="nombre" name="nombre" required aria-required="true" aria-invalid={errorField === 'nombre'} aria-describedby={errorField === 'nombre' ? 'contact-error' : undefined} value={stepUno.nombre} onChange={handleStepUnoChange} className="w-full bg-ef-ink/60 border border-ef-paper/15 rounded-xl px-4 py-3 text-ef-paper text-base placeholder:text-ef-paper/45 focus:outline-none focus:ring-2 focus:ring-ef-orange/60 focus:border-ef-orange/60 transition-all duration-200" placeholder="Tu nombre" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-ef-paper/70 mb-2">Email *</label>
                <input id="email" name="email" type="email" required aria-required="true" aria-invalid={errorField === 'email'} aria-describedby={errorField === 'email' ? 'contact-error' : undefined} value={stepUno.email} onChange={handleStepUnoChange} className="w-full bg-ef-ink/60 border border-ef-paper/15 rounded-xl px-4 py-3 text-ef-paper text-base placeholder:text-ef-paper/45 focus:outline-none focus:ring-2 focus:ring-ef-orange/60 focus:border-ef-orange/60 transition-all duration-200" placeholder="tu@email.com" />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-ef-paper/70 mb-2">Contame tu problema</label>
                <textarea id="mensaje" name="mensaje" value={stepUno.mensaje} onChange={handleStepUnoChange} maxLength={500} rows={4} className="w-full bg-ef-ink/60 border border-ef-paper/15 rounded-xl px-4 py-3 text-ef-paper text-base placeholder:text-ef-paper/45 focus:outline-none focus:ring-2 focus:ring-ef-orange/60 focus:border-ef-orange/60 transition-all duration-200" placeholder="Describe brevemente qué necesitás resolver" />
              </div>

              <label className="flex items-start gap-3 text-base text-ef-paper/80">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-ef-orange" required aria-required="true" aria-invalid={errorField === 'consent'} aria-describedby={errorField === 'consent' ? 'contact-error' : undefined} />
                Acepto la política de privacidad.
              </label>

              <CTAButton type="submit" size="full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Enviando...' : 'Solicitar diagnóstico'}
              </CTAButton>

              {status === 'error' && (
                <div ref={statusRef} tabIndex={-1} id="contact-error" className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 text-center text-red-300 text-base" role="alert">
                  {errorMsg}
                </div>
              )}
            </form>
          )}

          {step === 'dos' && (
            <div>
              <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4 text-center text-green-300 text-sm mb-6" role="status" aria-live="polite">
                Recibimos tu mensaje. Estos datos son opcionales y nos ayudan a preparar mejor la conversación.
              </div>

              <form onSubmit={handleSubmitStepDos} noValidate className="space-y-5">
                <div>
                  <label htmlFor="telefono" className="block text-sm font-semibold text-ef-paper/70 mb-2">Teléfono / WhatsApp</label>
                  <input id="telefono" name="telefono" value={stepDos.telefono} onChange={handleStepDosChange} className="w-full bg-ef-ink/60 border border-ef-paper/15 rounded-xl px-4 py-3 text-ef-paper text-base placeholder:text-ef-paper/45 focus:outline-none focus:ring-2 focus:ring-ef-orange/60 focus:border-ef-orange/60 transition-all duration-200" placeholder="+57..." />
                </div>

                <fieldset>
                  <legend className="block text-sm font-semibold text-ef-paper/70 mb-2">Preferencia de contacto</legend>
                  <div className="flex gap-4">
                    <label className="text-base text-ef-paper/80 inline-flex items-center gap-2">
                      <input type="radio" name="contacto_pref" value="email" checked={stepDos.contacto_pref === 'email'} onChange={handleStepDosChange} className="accent-ef-orange" />
                      Email
                    </label>
                    <label className="text-base text-ef-paper/80 inline-flex items-center gap-2">
                      <input type="radio" name="contacto_pref" value="whatsapp" checked={stepDos.contacto_pref === 'whatsapp'} onChange={handleStepDosChange} className="accent-ef-orange" />
                      WhatsApp
                    </label>
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="empresa" className="block text-sm font-semibold text-ef-paper/70 mb-2">Empresa</label>
                  <input id="empresa" name="empresa" value={stepDos.empresa} onChange={handleStepDosChange} className="w-full bg-ef-ink/60 border border-ef-paper/15 rounded-xl px-4 py-3 text-ef-paper text-base placeholder:text-ef-paper/45 focus:outline-none focus:ring-2 focus:ring-ef-orange/60 focus:border-ef-orange/60 transition-all duration-200" placeholder="Nombre de tu empresa" />
                </div>

                <div>
                  <label htmlFor="presupuesto" className="block text-sm font-semibold text-ef-paper/70 mb-2">Presupuesto estimado</label>
                  <select id="presupuesto" name="presupuesto" value={stepDos.presupuesto} onChange={handleStepDosChange} className="w-full bg-ef-ink/60 border border-ef-paper/15 rounded-xl px-4 py-3 text-ef-paper text-base focus:outline-none focus:ring-2 focus:ring-ef-orange/60 focus:border-ef-orange/60 transition-all duration-200">
                    <option value="">Seleccionar</option>
                    <option value="hasta-500">Hasta 500 USD</option>
                    <option value="500-1500">500 a 1500 USD</option>
                    <option value="1500-3000">1500 a 3000 USD</option>
                    <option value="3000+">3000+ USD</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="servicio" className="block text-sm font-semibold text-ef-paper/70 mb-2">Servicio de interés</label>
                  <select id="servicio" name="servicio" value={stepDos.servicio} onChange={handleStepDosChange} className="w-full bg-ef-ink/60 border border-ef-paper/15 rounded-xl px-4 py-3 text-ef-paper text-base focus:outline-none focus:ring-2 focus:ring-ef-orange/60 focus:border-ef-orange/60 transition-all duration-200">
                    <option value="">Seleccionar</option>
                    <option value="presencia-digital">Presencia Digital (landing / sitio web)</option>
                    <option value="sistemas-de-gestion">Sistemas de Gestión (CRM, ERP, PoS, Help Desk)</option>
                    <option value="software-personalizado">Software Personalizado</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <CTAButton type="submit" size="full" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Enviando...' : 'Completar'}
                  </CTAButton>
                  <button
                    type="button"
                    onClick={() => setStep('listo')}
                    className="text-sm text-ef-paper/60 hover:text-ef-paper transition-colors underline shrink-0"
                  >
                    Omitir, ya terminé
                  </button>
                </div>

                {status === 'error' && (
                  <div ref={statusRef} tabIndex={-1} className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-center text-red-300 text-sm" role="alert">
                    {errorMsg}
                  </div>
                )}
              </form>
            </div>
          )}

          {step === 'listo' && (
            <div tabIndex={-1} className="rounded-xl bg-green-500/10 border border-green-500/30 p-6 text-center text-green-300 text-base" role="status" aria-live="polite">
              Mensaje enviado. Te contactamos en menos de 24 horas.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
