'use client'

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

export default function Topbar({ username, read, page, onNav, onLogout }) {
  const pct = Math.round((read.length / 114) * 100)

  const navItems = [
    { key: 'home',      label: 'Sourates', Icon: IconGrid  },
    { key: 'favorites', label: 'Favoris',  Icon: IconStar  },
    { key: 'progress',  label: 'Suivi',    Icon: IconCheck },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      background: 'rgba(10,10,12,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
    }}>

      {/* Logo */}
      <div onClick={() => onNav('home')} style={{
        fontFamily: 'Cinzel, serif', fontSize: 22, fontWeight: 700,
        color: 'var(--gold)', letterSpacing: 4, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontFamily: 'Amiri, serif', fontSize: 26, color: 'var(--gold-light)', fontWeight: 400 }}>الإيمان</span>
        FAITH
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', gap: 8 }}>
        {navItems.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => onNav(key)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: page === key ? 'var(--glow)' : 'transparent',
            border: `1px solid ${page === key ? 'var(--border-bright)' : 'transparent'}`,
            color: page === key ? 'var(--gold)' : 'var(--text-secondary)',
            fontFamily: 'Lato, sans-serif', fontSize: 12,
            letterSpacing: 1, padding: '6px 16px', borderRadius: 6,
            cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
          }}>
            <Icon />
            {label}
          </button>
        ))}
      </div>

      {/* User + progress + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
          <span>{read.length}/114</span>
          <div style={{ width: 60, height: 4, background: 'var(--bg-card)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: 'linear-gradient(90deg, var(--gold-dim), var(--gold))',
              width: `${pct}%`, transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Badge utilisateur */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--glow)', border: '1px solid var(--border-bright)',
          borderRadius: 20, padding: '4px 14px 4px 8px',
          fontSize: 13, color: 'var(--gold-light)',
        }}>
          <div style={{
            width: 26, height: 26,
            background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#0a0a0c',
          }}>
            {username?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span style={{ textTransform: 'capitalize' }}>{username?.replace(/_/g, ' ')}</span>
        </div>

        {/* Bouton déconnexion */}
        <button
          onClick={onLogout}
          title="Se déconnecter"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 34, height: 34,
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--text-dim)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(180,60,60,0.5)'
            e.currentTarget.style.color       = '#c05050'
            e.currentTarget.style.background  = 'rgba(180,60,60,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color       = 'var(--text-dim)'
            e.currentTarget.style.background  = 'transparent'
          }}
        >
          <IconLogout />
        </button>

      </div>
    </nav>
  )
}