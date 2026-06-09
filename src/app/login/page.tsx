'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [recordarme, setRecordarme] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [alerta, setAlerta] = useState<{ tipo: 'error' | 'success'; texto: string } | null>(null)

  // Modal recuperar contraseña
  const [modalRecuperar, setModalRecuperar] = useState(false)
  const [emailRecuperar, setEmailRecuperar] = useState('')
  const [enviandoRecuperar, setEnviandoRecuperar] = useState(false)
  const [alertaRecuperar, setAlertaRecuperar] = useState<{ tipo: 'error' | 'success'; texto: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setAlerta(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setCargando(false)
      setAlerta({ tipo: 'error', texto: 'Correo o contraseña incorrectos. Intenta de nuevo.' })
      return
    }

    setAlerta({ tipo: 'success', texto: '¡Inicio de sesión exitoso! Redirigiendo...' })
    setTimeout(() => router.push('/dashboard'), 1000)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function handleRecuperar(e: React.FormEvent) {
    e.preventDefault()
    setEnviandoRecuperar(true)
    setAlertaRecuperar(null)

    const { error } = await supabase.auth.resetPasswordForEmail(emailRecuperar, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setEnviandoRecuperar(false)

    if (error) {
      setAlertaRecuperar({ tipo: 'error', texto: 'No se pudo enviar el correo. Verifica la dirección.' })
    } else {
      setAlertaRecuperar({ tipo: 'success', texto: '¡Correo enviado! Revisa tu bandeja de entrada.' })
      setTimeout(() => {
        setModalRecuperar(false)
        setEmailRecuperar('')
        setAlertaRecuperar(null)
      }, 3000)
    }
  }

  return (
    <div className="login-bg">

      {/* ===== MODAL RECUPERAR CONTRASEÑA ===== */}
      {modalRecuperar && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }} onClick={() => setModalRecuperar(false)}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: '2rem',
            width: '100%', maxWidth: 420,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔑</div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                Recuperar contraseña
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            {alertaRecuperar && (
              <div className={`alert-msg show ${alertaRecuperar.tipo}`} style={{ marginBottom: '1rem' }}>
                <i className={`bi bi-${alertaRecuperar.tipo === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}`}></i>
                <span>{alertaRecuperar.texto}</span>
              </div>
            )}

            <form onSubmit={handleRecuperar}>
              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <div className="input-wrapper">
                  <i className="bi bi-envelope-fill input-icon"></i>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="tucorreo@ejemplo.com"
                    required
                    value={emailRecuperar}
                    onChange={e => setEmailRecuperar(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-login" disabled={enviandoRecuperar}>
                <span>{enviandoRecuperar ? 'Enviando...' : 'Enviar enlace'}</span>
                {!enviandoRecuperar && <i className="bi bi-send-fill"></i>}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setModalRecuperar(false)}
              style={{
                width: '100%', marginTop: '0.75rem', background: 'none',
                border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.7rem',
                color: '#64748b', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ===== CARD DE LOGIN ===== */}
      <div className="login-wrapper">
        <div className="login-card">

          <div className="login-header">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Vykam" className="login-logo" />
            <h1 className="login-title">Bienvenido de vuelta</h1>
            <p className="login-subtitle">Inicia sesión para continuar comprando y vendiendo</p>
          </div>

          {alerta && (
            <div className={`alert-msg show ${alerta.tipo}`}>
              <i className={`bi bi-${alerta.tipo === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}`}></i>
              <span>{alerta.texto}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <i className="bi bi-envelope-fill input-icon"></i>
                <input
                  type="email" id="email" className="form-input"
                  placeholder="tucorreo@ejemplo.com" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <i className="bi bi-lock-fill input-icon"></i>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  id="password" className="form-input"
                  placeholder="Ingresa tu contraseña" required
                  autoComplete="current-password" minLength={6}
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button" className="toggle-password"
                  aria-label="Mostrar contraseña"
                  onClick={() => setMostrarPassword(v => !v)}
                >
                  {mostrarPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox" id="remember"
                  checked={recordarme} onChange={e => setRecordarme(e.target.checked)}
                />
                <label htmlFor="remember">Recordarme</label>
              </div>
              <button
                type="button"
                className="forgot-link"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
                onClick={() => { setModalRecuperar(true); setEmailRecuperar(email) }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" className="btn-login" disabled={cargando}>
              <span>{cargando ? 'Ingresando...' : 'Iniciar sesión'}</span>
              {!cargando && <i className="bi bi-arrow-right"></i>}
            </button>
          </form>

          <div className="divider">o continúa con</div>

          <button type="button" className="btn-google" onClick={handleGoogle}>
            <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="login-footer">
            ¿No tienes cuenta?{' '}
            <Link href="/registro">Crear cuenta</Link>
          </div>

        </div>
      </div>

      {/* Trust badge */}
      <div className="trust-badge">
        <i className="bi bi-shield-check"></i> Conexión segura y protegida
      </div>

      {/* Volver al sitio */}
      <div className="top-bar">
        <Link href="/" className="back-link">
          <i className="bi bi-arrow-left"></i>
          Volver al sitio
        </Link>
      </div>

    </div>
  )
}
