'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [alerta, setAlerta] = useState<{ tipo: 'error' | 'success'; texto: string } | null>(null)
  const [sesionLista, setSesionLista] = useState(false)

  useEffect(() => {
    // Supabase maneja el token de reset automáticamente via el hash de la URL
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSesionLista(true)
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAlerta(null)

    if (password !== confirmar) {
      setAlerta({ tipo: 'error', texto: 'Las contraseñas no coinciden.' })
      return
    }
    if (password.length < 6) {
      setAlerta({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres.' })
      return
    }

    setCargando(true)
    const { error } = await supabase.auth.updateUser({ password })
    setCargando(false)

    if (error) {
      setAlerta({ tipo: 'error', texto: 'No se pudo actualizar la contraseña. Intenta de nuevo.' })
    } else {
      setAlerta({ tipo: 'success', texto: '¡Contraseña actualizada! Redirigiendo...' })
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  return (
    <div className="login-bg">
      <div className="login-wrapper">
        <div className="login-card">

          <div className="login-header">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Vykam" className="login-logo" />
            <h1 className="login-title">Nueva contraseña</h1>
            <p className="login-subtitle">Ingresa tu nueva contraseña para continuar</p>
          </div>

          {!sesionLista ? (
            <div style={{ textAlign: 'center', padding: '1rem 0', color: '#64748b' }}>
              <div className="dash-spinner" style={{ margin: '0 auto 1rem' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Verificando enlace...</p>
            </div>
          ) : (
            <>
              {alerta && (
                <div className={`alert-msg show ${alerta.tipo}`}>
                  <i className={`bi bi-${alerta.tipo === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}`}></i>
                  <span>{alerta.texto}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">Nueva contraseña</label>
                  <div className="input-wrapper">
                    <i className="bi bi-lock-fill input-icon"></i>
                    <input
                      type={mostrarPassword ? 'text' : 'password'}
                      id="password" className="form-input"
                      placeholder="Mínimo 6 caracteres" required minLength={6}
                      value={password} onChange={e => setPassword(e.target.value)}
                    />
                    <button type="button" className="toggle-password" onClick={() => setMostrarPassword(v => !v)}>
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

                <div className="form-group">
                  <label className="form-label" htmlFor="confirmar">Confirmar contraseña</label>
                  <div className="input-wrapper">
                    <i className="bi bi-lock-fill input-icon"></i>
                    <input
                      type={mostrarConfirmar ? 'text' : 'password'}
                      id="confirmar" className="form-input"
                      placeholder="Repite tu contraseña" required minLength={6}
                      value={confirmar} onChange={e => setConfirmar(e.target.value)}
                    />
                    <button type="button" className="toggle-password" onClick={() => setMostrarConfirmar(v => !v)}>
                      {mostrarConfirmar ? (
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

                <button type="submit" className="btn-login" disabled={cargando}>
                  <span>{cargando ? 'Guardando...' : 'Guardar contraseña'}</span>
                  {!cargando && <i className="bi bi-check-lg"></i>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="trust-badge">
        <i className="bi bi-shield-check"></i> Conexión segura y protegida
      </div>
    </div>
  )
}
