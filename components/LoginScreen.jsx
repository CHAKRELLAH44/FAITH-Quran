'use client'
import { useState, useEffect } from 'react'

const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const IconApple = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function LoginScreen({ onLogin }) {
  const [name,           setName]      = useState('')
  const [deferredPrompt, setDeferred]  = useState(null)
  const [installed,      setInstalled] = useState(false)
  const [isIOS,          setIsIOS]     = useState(false)
  const [showIOSTip,     setShowIOSTip]= useState(false)

  // ── mounted : garantit que tout le code browser s'exécute côté client ───
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Détecter iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream
    setIsIOS(ios)

    // Déjà installée en standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
    }

    // Capturer l'événement beforeinstallprompt (Chrome / Android / PC)
    const handler = (e) => { e.preventDefault(); setDeferred(e) }
    window.addEventListener('beforeinstallprompt', handler)

    // Après installation réussie
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setDeferred(null)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleLogin = () => { if (name.trim()) onLogin(name.trim()) }

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setDeferred(null)
  }

  // Ces valeurs ne sont calculées qu'après le montage → pas de mismatch SSR
  const showInstallBtn = mounted && deferredPrompt && !installed
  const showAppleBtn   = mounted && isIOS && !installed
  const showInstalled  = mounted && installed
  const showSection    = showInstallBtn || showAppleBtn || showInstalled

  return (
    <div suppressHydrationWarning style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column',
      padding: '40px 20px', position: 'relative', zIndex: 1,
    }}>

      {/* ── Ornement animé ── */}
      <div style={{ width: 120, height: 120, marginBottom: 32 }}>
        <svg viewBox="0 0 120 120" fill="none" className="rotate-slow">
          <g stroke="#c9a84c" strokeWidth="0.8" opacity="0.7">
            <polygon points="60,8 72,32 98,32 78,50 86,76 60,60 34,76 42,50 22,32 48,32" fill="none"/>
            <circle cx="60" cy="60" r="50" fill="none"/>
            <circle cx="60" cy="60" r="38" fill="none" opacity="0.4"/>
            <line x1="60" y1="10" x2="60" y2="110"/>
            <line x1="10" y1="60" x2="110" y2="60"/>
            <line x1="24" y1="24" x2="96" y2="96"/>
            <line x1="96" y1="24" x2="24" y2="96"/>
          </g>
          <g stroke="#c9a84c" strokeWidth="0.5" opacity="0.4">
            <circle cx="60" cy="60" r="28" fill="none"/>
          </g>
        </svg>
      </div>

      {/* ── Bismillah ── */}
      <div style={{
        fontFamily: 'Amiri, serif', fontSize: 'clamp(28px, 4vw, 48px)',
        color: 'var(--gold-light)', textAlign: 'center',
        marginBottom: 8, direction: 'rtl',
      }}>
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </div>

      {/* ── Titre NŪR ── */}
      <div style={{
        fontFamily: 'Cinzel, serif', fontSize: 'clamp(36px, 6vw, 64px)',
        fontWeight: 700, color: 'var(--gold)', letterSpacing: 8,
        textAlign: 'center', marginBottom: 8,
      }}>NŪR</div>

      <div style={{
        color: 'var(--text-secondary)', fontSize: 14, letterSpacing: 2,
        textAlign: 'center', marginBottom: 48, fontWeight: 300,
        textTransform: 'uppercase',
      }}>
        Plateforme Coran Interactive &nbsp;✦&nbsp; 114 Sourates
      </div>

      {/* ── Carte login ── */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-bright)',
        borderRadius: 16, padding: '40px 48px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 0 60px rgba(201,168,76,0.06), 0 20px 60px rgba(0,0,0,0.4)',
      }}>

        {/* Label */}
        <label style={{
          display: 'block', fontSize: 11, letterSpacing: 2,
          color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 10,
        }}>
          Votre Prénom
        </label>

        {/* Input */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="ex: Imane, Mohammed, Sara..."
          maxLength={30}
          autoComplete="off"
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)', borderRadius: 8,
            padding: '14px 18px', color: 'var(--text-primary)',
            fontFamily: 'Lato, sans-serif', fontSize: 16,
            outline: 'none', marginBottom: 16, transition: 'all 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.background = 'rgba(201,168,76,0.04)' }}
          onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
        />

        {/* Bouton connexion */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
            border: 'none', borderRadius: 8, padding: 15,
            color: '#0a0a0c', fontFamily: 'Cinzel, serif',
            fontSize: 14, fontWeight: 700, letterSpacing: 3,
            cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none' }}
        >
          ✦ &nbsp; Commencer la Lecture &nbsp; ✦
        </button>

        {/* ── Section PWA — visible seulement après montage ── */}
        {showSection && (
          <>
            {/* Séparateur */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              margin: '20px 0 0',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: 2, textTransform: 'uppercase' }}>
                Application
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Bouton Chrome / Android / PC */}
            {showInstallBtn && (
              <button
                onClick={handleInstall}
                style={{
                  width: '100%', marginTop: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: 'transparent', border: '1px solid var(--border-bright)',
                  borderRadius: 8, padding: '12px 15px',
                  color: 'var(--gold)', fontFamily: 'Lato, sans-serif',
                  fontSize: 13, fontWeight: 700, letterSpacing: 1,
                  cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--glow)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,168,76,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <IconDownload />
                Installer l'application
              </button>
            )}

            {/* Bouton iOS */}
            {showAppleBtn && (
              <div>
                <button
                  onClick={() => setShowIOSTip(t => !t)}
                  style={{
                    width: '100%', marginTop: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: 'transparent', border: '1px solid var(--border-bright)',
                    borderRadius: 8, padding: '12px 15px',
                    color: 'var(--gold)', fontFamily: 'Lato, sans-serif',
                    fontSize: 13, fontWeight: 700, letterSpacing: 1,
                    cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--glow)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <IconApple />
                  Installer sur iPhone
                </button>

                {showIOSTip && (
                  <div style={{
                    marginTop: 12,
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid var(--border)',
                    borderRadius: 8, padding: '14px 16px',
                    fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.9,
                  }}>
                    <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 6, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
                      Comment installer :
                    </div>
                    <div>1. Appuie sur <strong style={{ color: 'var(--gold-light)' }}>Partager</strong> ↑ en bas de Safari</div>
                    <div>2. Choisis <strong style={{ color: 'var(--gold-light)' }}>Sur l'écran d'accueil</strong></div>
                    <div>3. Appuie sur <strong style={{ color: 'var(--gold-light)' }}>Ajouter</strong> ✦</div>
                  </div>
                )}
              </div>
            )}

            {/* Déjà installée */}
            {showInstalled && (
              <div style={{
                marginTop: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px', background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8,
                fontSize: 12, color: 'var(--gold)', letterSpacing: 1,
              }}>
                <IconCheck />
                Application installée
              </div>
            )}
          </>
        )}

      </div>

      {/* ── Tagline ── */}
      <div style={{
        marginTop: 32, fontSize: 11, color: 'var(--text-dim)',
        letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center',
      }}>
        ✦ &nbsp; Lecture &nbsp;·&nbsp; Compréhension &nbsp;·&nbsp; Suivi &nbsp; ✦
      </div>

    </div>
  )
}