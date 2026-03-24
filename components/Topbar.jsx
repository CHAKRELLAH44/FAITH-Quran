'use client'
import { useState } from 'react'

// ── Icônes ────────────────────────────────────────────────────
const IconGrid = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const navItems = [
  { key: 'home',      label: 'Sourates', Icon: IconGrid  },
  { key: 'favorites', label: 'Favoris',  Icon: IconStar  },
  { key: 'progress',  label: 'Suivi',    Icon: IconCheck },
]

export default function Topbar({ username, read, page, onNav, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pct = Math.round((read.length / 114) * 100)

  function handleNav(key) {
    onNav(key)
    setMenuOpen(false)
  }

  function handleLogout() {
    onLogout()
    setMenuOpen(false)
  }

  return (
    <>
      {/* ── Barre principale ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: 'rgba(10,10,12,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
      }}>

        {/* Logo */}
        <div onClick={() => handleNav('home')} style={{
          fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 700,
          color: 'var(--gold)', letterSpacing: 4, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'Amiri, serif', fontSize: 24, color: 'var(--gold-light)', fontWeight: 400 }}>إيمان</span>
          <span className="hide-mobile">FAITH</span>
        </div>

        {/* Nav desktop — cachée sur mobile */}
        <div className="nav-desktop" style={{ display: 'flex', gap: 6 }}>
          {navItems.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => handleNav(key)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: page === key ? 'var(--glow)' : 'transparent',
              border: `1px solid ${page === key ? 'var(--border-bright)' : 'transparent'}`,
              color: page === key ? 'var(--gold)' : 'var(--text-secondary)',
              fontFamily: 'Lato, sans-serif', fontSize: 12,
              letterSpacing: 1, padding: '6px 14px', borderRadius: 6,
              cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
            }}>
              <Icon />{label}
            </button>
          ))}
        </div>

        {/* Droite : progress + user + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

          {/* Progress — cachée sur petit mobile */}
          <div className="hide-small" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span>{read.length}/114</span>
            <div style={{ width: 48, height: 4, background: 'var(--bg-card)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: 'linear-gradient(90deg, var(--gold-dim), var(--gold))',
                width: `${pct}%`, transition: 'width 0.5s ease',
              }} />
            </div>
          </div>

          {/* Badge user — caché sur petit mobile */}
          <div className="hide-small" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--glow)', border: '1px solid var(--border-bright)',
            borderRadius: 20, padding: '4px 12px 4px 6px',
            fontSize: 12, color: 'var(--gold-light)',
          }}>
            <div style={{
              width: 24, height: 24,
              background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#0a0a0c',
            }}>
              {username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <span style={{ textTransform: 'capitalize', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {username?.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Avatar seul sur mobile */}
          <div className="show-small" style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#0a0a0c',
            flexShrink: 0,
          }}>
            {username?.[0]?.toUpperCase() ?? '?'}
          </div>

          {/* Bouton hamburger — visible sur mobile */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'none',
              alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36,
              background: menuOpen ? 'var(--glow)' : 'transparent',
              border: `1px solid ${menuOpen ? 'var(--border-bright)' : 'var(--border)'}`,
              borderRadius: 8, cursor: 'pointer',
              color: menuOpen ? 'var(--gold)' : 'var(--text-secondary)',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>

          {/* Déconnexion desktop */}
          <button
            className="logout-desktop"
            onClick={handleLogout}
            title="Déconnexion"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34,
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--text-dim)', cursor: 'pointer',
              transition: 'all 0.2s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180,60,60,0.5)'; e.currentTarget.style.color = '#c05050'; e.currentTarget.style.background = 'rgba(180,60,60,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent' }}
          >
            <IconLogout />
          </button>
        </div>
      </nav>

      {/* ── Menu mobile déroulant ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
          background: 'rgba(10,10,12,0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-bright)',
          padding: '16px 20px 20px',
          display: 'flex', flexDirection: 'column', gap: 8,
          animation: 'slideDown 0.2s ease',
        }}>

          {/* Info utilisateur */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'var(--glow)', border: '1px solid var(--border)',
            borderRadius: 10, marginBottom: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#0a0a0c',
              }}>
                {username?.[0]?.toUpperCase() ?? '?'}
              </div>
              <span style={{ fontSize: 14, color: 'var(--gold-light)', textTransform: 'capitalize' }}>
                {username?.replace(/_/g, ' ')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span>{read.length}/114</span>
              <div style={{ width: 40, height: 4, background: 'var(--bg-card)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  background: 'linear-gradient(90deg, var(--gold-dim), var(--gold))',
                  width: `${pct}%`,
                }} />
              </div>
            </div>
          </div>

          {/* Liens navigation */}
          {navItems.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => handleNav(key)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', borderRadius: 10,
              background: page === key ? 'var(--glow)' : 'transparent',
              border: `1px solid ${page === key ? 'var(--border-bright)' : 'var(--border)'}`,
              color: page === key ? 'var(--gold)' : 'var(--text-secondary)',
              fontFamily: 'Lato, sans-serif', fontSize: 14,
              letterSpacing: 1, cursor: 'pointer',
              textTransform: 'uppercase', textAlign: 'left',
              transition: 'all 0.15s',
            }}>
              <Icon />{label}
            </button>
          ))}

          {/* Déconnexion */}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderRadius: 10, marginTop: 4,
            background: 'rgba(180,60,60,0.06)',
            border: '1px solid rgba(180,60,60,0.2)',
            color: '#c05050', fontFamily: 'Lato, sans-serif',
            fontSize: 14, letterSpacing: 1, cursor: 'pointer',
            textTransform: 'uppercase', textAlign: 'left',
          }}>
            <IconLogout /> Déconnexion
          </button>
        </div>
      )}

      {/* Overlay pour fermer le menu en cliquant dehors */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 98,
            background: 'rgba(0,0,0,0.3)',
            top: 64,
          }}
        />
      )}

      {/* ── Styles responsive ── */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Desktop : nav visible, hamburger caché */
        @media (min-width: 640px) {
          .nav-desktop    { display: flex !important; }
          .hamburger      { display: none !important; }
          .logout-desktop { display: flex !important; }
          .hide-small     { display: flex !important; }
          .show-small     { display: none !important; }
          .hide-mobile    { display: inline !important; }
        }

        /* Mobile : nav cachée, hamburger visible */
        @media (max-width: 639px) {
          .nav-desktop    { display: none !important; }
          .hamburger      { display: flex !important; }
          .logout-desktop { display: none !important; }
          .hide-small     { display: none !important; }
          .show-small     { display: flex !important; }
          .hide-mobile    { display: none !important; }
        }
      `}</style>
    </>
  )
}