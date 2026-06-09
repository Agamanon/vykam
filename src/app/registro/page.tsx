'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'

export default function RegistroPage() {
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [alerta, setAlerta] = useState<{ tipo: 'error' | 'success'; texto: string } | null>(null)

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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre_completo: nombre },
      },
    })

    setCargando(false)

    if (error) {
      setAlerta({ tipo: 'error', texto: 'No se pudo crear la cuenta. Intenta de nuevo.' })
      return
    }

    setAlerta({
      tipo: 'success',
      texto: '¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.',
    })
    setTimeout(() => router.push('/login'), 3000)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div className="login-bg">
      {/* Barra superior */}
      <div className="top-bar">
        <Link href="/" className="back-link">
          <i className="bi bi-arrow-left"></i>
          Volver al sitio
        </Link>
      </div>

      {/* Card de registro */}
      <div className="login-wrapper">
        <div className="login-card">

          {/* Header */}
          <div className="login-header">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Vykam" className="login-logo" />
            <h1 className="login-title">Crear cuenta</h1>
            <p className="login-subtitle">Únete a Vykam y empieza a comprar y vender</p>
          </div>

          {/* Alerta */}
          {alerta && (
            <div className={`alert-msg show ${alerta.tipo}`}>
              <i className={`bi bi-${alerta.tipo === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}`}></i>
              <span>{alerta.texto}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>

            {/* Nombre */}
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">Nombre completo</label>
              <div className="input-wrapper">
                <i className="bi bi-person-fill input-icon"></i>
                <input
                  type="text"
                  id="nombre"
                  className="form-input"
                  placeholder="Tu nombre completo"
                  required
                  autoComplete="name"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <i className="bi bi-envelope-fill input-icon"></i>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="tucorreo@ejemplo.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <i className="bi bi-lock-fill input-icon"></i>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  aria-label="Mostrar contraseña"
                  onClick={() => setMostrarPassword(v => !v)}
                >
                  <i className={`bi bi-${mostrarPassword ? 'eye-slash-fill' : 'eye-fill'}`}></i>
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="form-group">
              <label className="form-label" htmlFor="confirmar">Confirmar contraseña</label>
              <div className="input-wrapper">
                <i className="bi bi-lock-fill input-icon"></i>
                <input
                  type={mostrarConfirmar ? 'text' : 'password'}
                  id="confirmar"
                  className="form-input"
                  placeholder="Repite tu contraseña"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  aria-label="Mostrar confirmación"
                  onClick={() => setMostrarConfirmar(v => !v)}
                >
                  <i className={`bi bi-${mostrarConfirmar ? 'eye-slash-fill' : 'eye-fill'}`}></i>
                </button>
              </div>
            </div>

            {/* Botón principal */}
            <button type="submit" className="btn-login" disabled={cargando}>
              <span>{cargando ? 'Creando cuenta...' : 'Crear cuenta'}</span>
              {!cargando && <i className="bi bi-arrow-right"></i>}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">o regístrate con</div>

          {/* Botón Google */}
          <button type="button" className="btn-google" onClick={handleGoogle}>
            <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          {/* Footer del card */}
          <div className="login-footer">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login">Iniciar sesión</Link>
          </div>

        </div>
      </div>

      {/* Trust badge */}
      <div className="trust-badge">
        <i className="bi bi-shield-check"></i> Conexión segura y protegida
      </div>
    </div>
  )
}
