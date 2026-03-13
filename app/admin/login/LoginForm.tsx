'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

// Max input lengths to prevent oversized payloads (OWASP A03 — Injection)
const MAX_USERNAME_LEN = 64
const MAX_PASSWORD_LEN = 128

type FormState = 'idle' | 'loading' | 'rate-limited'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [error, setError] = useState('')
  // Seconds remaining when rate-limited
  const [retryAfter, setRetryAfter] = useState(0)
  const retryTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const usernameRef = useRef<HTMLInputElement>(null)

  // Auto-focus username on mount
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  // Countdown timer when rate-limited
  useEffect(() => {
    if (retryAfter <= 0) {
      if (retryTimer.current) clearInterval(retryTimer.current)
      if (formState === 'rate-limited') setFormState('idle')
      return
    }
    retryTimer.current = setInterval(() => {
      setRetryAfter((s) => {
        if (s <= 1) {
          clearInterval(retryTimer.current!)
          setFormState('idle')
          setError('')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => { if (retryTimer.current) clearInterval(retryTimer.current) }
  }, [retryAfter]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearError = useCallback(() => {
    if (error) setError('')
  }, [error])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (formState !== 'idle') return

    // Trim client-side to avoid sending whitespace-only credentials
    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    if (!trimmedUsername || !trimmedPassword) {
      setError('Completa usuario y contraseña.')
      return
    }

    setError('')
    setFormState('loading')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send trimmed values
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword }),
        // Credentials included so the cookie is set on the same origin
        credentials: 'same-origin',
      })

      if (response.ok) {
        // Hard redirect prevents the login page from being cached in history
        window.location.replace('/admin')
        return
      }

      if (response.status === 429) {
        const retryHeader = response.headers.get('Retry-After')
        const seconds = retryHeader ? Math.max(1, parseInt(retryHeader, 10)) : 60
        setRetryAfter(seconds)
        setFormState('rate-limited')
        setError(`Demasiados intentos. Espera ${seconds} segundos antes de reintentar.`)
        return
      }

      // Use a generic message regardless of specific failure reason (OWASP A07)
      const payload = await response.json().catch(() => ({}))
      const msg =
        response.status === 400
          ? 'Solicitud inválida. Revisa los datos ingresados.'
          : (payload as Record<string, string>)?.error || 'Credenciales incorrectas.'
      setError(msg)
      setFormState('idle')
      // Clear password on failed attempt (never keep failed passwords in state)
      setPassword('')
    } catch {
      // Network/fetch error — don't expose internals
      setError('No se pudo conectar. Verifica tu conexión e intenta de nuevo.')
      setFormState('idle')
    }
  }

  const isDisabled = formState !== 'idle'

  return (
    <div className="w-full max-w-md">
      {/* Logotype */}
      <div className="mb-8 text-center">
        <span className="text-2xl font-bold font-humanst text-white tracking-tight">
          Eleva<span className="text-forge-orange-main">Forge</span>
        </span>
        <p className="mt-1 text-sm text-forge-bg-light/60">Panel de administración</p>
      </div>

      <div className="bg-forge-card-bg rounded-2xl p-8 shadow-card border border-white/5">
        <h1 className="text-xl font-semibold text-white mb-1">Inicia sesión</h1>
        <p className="text-sm text-forge-bg-light/50 mb-6">Acceso restringido a administradores.</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="ef-username" className="block text-sm font-medium text-forge-bg-light/80 mb-1.5">
              Usuario
            </label>
            <input
              id="ef-username"
              ref={usernameRef}
              type="text"
              name="username"
              autoComplete="username"
              required
              maxLength={MAX_USERNAME_LEN}
              disabled={isDisabled}
              value={username}
              onChange={(e) => { setUsername(e.target.value); clearError() }}
              className="w-full bg-forge-bg-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-forge-blue-primary focus:border-transparent disabled:opacity-50 transition-colors"
              placeholder="tu usuario"
            />
          </div>

          {/* Password with show/hide toggle */}
          <div>
            <label htmlFor="ef-password" className="block text-sm font-medium text-forge-bg-light/80 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="ef-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                required
                maxLength={MAX_PASSWORD_LEN}
                disabled={isDisabled}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError() }}
                className="w-full bg-forge-bg-dark border border-white/10 rounded-lg px-4 py-2.5 pr-11 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-forge-blue-primary focus:border-transparent disabled:opacity-50 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-white/40 hover:text-white/70 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" x2="22" y1="2" y2="22"/>
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error message — role=alert so screen readers announce it */}
          {error && (
            <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Rate-limit countdown */}
          {formState === 'rate-limited' && retryAfter > 0 && (
            <p className="text-xs text-forge-bg-light/40 text-center">
              Puedes reintentar en <span className="font-semibold text-forge-orange-main">{retryAfter}s</span>
            </p>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full bg-forge-orange-main hover:bg-forge-orange-gold text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {formState === 'loading' ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Verificando…
              </>
            ) : formState === 'rate-limited' ? (
              `Espera ${retryAfter}s`
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-forge-bg-light/25 select-none">
        Acceso exclusivo para el equipo ElevaForge
      </p>
    </div>
  )
}
