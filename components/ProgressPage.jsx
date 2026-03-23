'use client'

export default function ProgressPage({ surahs, read, isRead, onOpen }) {
  const count = read.length
  const pct   = Math.round((count / 114) * 100)
  const circumference = 515
  const offset = circumference - (pct / 100 * circumference)
  const readSurahs = surahs.filter(s => read.includes(s.number))

  return (
    <div style={{
      paddingTop: 80, padding: '80px 32px 80px',
      maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1,
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 40, paddingBottom: 24, borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 28 }}>✓ </span>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
          Mon Suivi de Lecture
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'Cinzel, serif', fontSize: 14, color: 'var(--text-dim)' }}>
          {count} / 114 sourates
        </span>
      </div>

      {/* Progress ring */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 48, position: 'relative',
      }}>
        <svg viewBox="0 0 200 200" style={{ width: 200, height: 200 }}>
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#7a6230" />
              <stop offset="100%" stopColor="#c9a84c" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx="100" cy="100" r="82" fill="none"
            stroke="url(#goldGrad)" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <span style={{
            display: 'block', fontFamily: 'Cinzel, serif',
            fontSize: 40, fontWeight: 700, color: 'var(--gold)',
          }}>{pct}%</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 2, textTransform: 'uppercase' }}>
            Complété
          </span>
        </div>
      </div>

      {/* List of read surahs */}
      {readSurahs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🕮</div>
          <div style={{ fontSize: 15, lineHeight: 1.8 }}>
            Commencez à lire des sourates et marquez-les comme lues<br />pour suivre votre progression.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {readSurahs.map(s => (
            <div
              key={s.number}
              onClick={() => onOpen(s.number)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '14px 20px',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-bright)'
                e.currentTarget.style.transform   = 'translateX(4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform   = 'translateX(0)'
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: '#0a0a0c', fontWeight: 700, flexShrink: 0,
              }}>✓</div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>
                {s.englishName}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1 }}>
                {s.ayahs} v.
              </div>
              <div style={{ fontFamily: 'Amiri, serif', fontSize: 18, color: 'var(--gold-light)' }}>
                {s.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
