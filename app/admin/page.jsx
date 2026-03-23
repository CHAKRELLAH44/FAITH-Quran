'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

export default function AdminLogin() {
  const [code,    setCode]    = useState('')
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const router = useRouter()

  async function handleLogin() {
    if (!code.trim()) { setError('Entrez le code secret'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Code incorrect'); return }
      router.push('/admin/dashboard')
    } catch { setError('Erreur de connexion') }
    finally   { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 24, position: 'relative', zIndex: 1,
    }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
        borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 380,
        boxShadow: '0 0 60px rgba(201,168,76,0.08)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--glow)', border: '1px solid var(--border-bright)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', color: 'var(--gold)',
        }}>
          <IconLock />
        </div>

        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, fontWeight: 700, color: 'var(--gold)', textAlign: 'center', letterSpacing: 3, marginBottom: 6 }}>
          ADMIN
        </div>
        <div style={{ fontFamily: 'Amiri, serif', fontSize: 18, color: 'var(--gold-light)', textAlign: 'center', marginBottom: 32 }}>
          لوحة التحكم
        </div>

        <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 10 }}>
          Code Secret
        </label>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input
            type={show ? 'text' : 'password'}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${error ? 'rgba(200,60,60,0.5)' : 'var(--border)'}`,
              borderRadius: 8, padding: '14px 44px 14px 18px',
              color: 'var(--text-primary)', fontFamily: 'Lato, sans-serif',
              fontSize: 16, outline: 'none', transition: 'all 0.2s',
              letterSpacing: show ? 0 : 4,
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.background = 'rgba(201,168,76,0.04)' }}
            onBlur={e  => { e.target.style.borderColor = error ? 'rgba(200,60,60,0.5)' : 'var(--border)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
          />
          <button onClick={() => setShow(s => !s)} style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-dim)', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            <IconEye />
          </button>
        </div>

        {error && (
          <div style={{ fontSize: 12, color: '#c05050', marginBottom: 16, textAlign: 'center' }}>
            ⚠ {error}
          </div>
        )}

        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%',
          background: loading ? 'var(--gold-dim)' : 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
          border: 'none', borderRadius: 8, padding: 15,
          color: '#0a0a0c', fontFamily: 'Cinzel, serif',
          fontSize: 13, fontWeight: 700, letterSpacing: 3,
          cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase',
        }}>
          {loading ? '...' : '✦ Accéder ✦'}
        </button>

        <div style={{ marginTop: 20, fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', letterSpacing: 1 }}>
          Accès réservé à l'administrateur
        </div>
      </div>
    </div>
  )
}