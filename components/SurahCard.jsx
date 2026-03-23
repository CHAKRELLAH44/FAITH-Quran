'use client'

export default function SurahCard({ surah, isRead, isFav, delay = 0, onClick }) {
  return (
    <div
      className="card-appear"
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${isRead ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '20px 22px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        animationDelay: `${Math.min(delay * 0.02, 0.6)}s`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-bright)'
        e.currentTarget.style.transform   = 'translateY(-3px)'
        e.currentTarget.style.boxShadow   = '0 8px 32px rgba(201,168,76,0.1), 0 2px 8px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isRead ? 'rgba(201,168,76,0.3)' : 'var(--border)'
        e.currentTarget.style.transform   = 'translateY(0)'
        e.currentTarget.style.boxShadow   = 'none'
      }}
    >
      {/* Completed badge */}
      {isRead && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 20, height: 20,
          background: 'var(--gold)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#0a0a0c',
        }}>✓</div>
      )}

      {/* Number + Arabic name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, flexShrink: 0,
          border: '1px solid var(--border-bright)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Cinzel, serif', fontSize: 12, fontWeight: 600,
          color: 'var(--gold)',
        }}>
          {String(surah.number).padStart(3, '0')}
        </div>
        <div style={{
          fontFamily: 'Amiri, serif', fontSize: 22, color: 'var(--gold-light)',
          direction: 'rtl', textAlign: 'right', lineHeight: 1.2, flex: 1, paddingLeft: 12,
        }}>
          {surah.name}
        </div>
      </div>

      {/* English name */}
      <div style={{
        fontFamily: 'Cinzel, serif', fontSize: 14, fontWeight: 600,
        color: 'var(--text-primary)', marginBottom: 4, letterSpacing: 0.5,
      }}>
        {surah.englishName}
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1 }}>
        <span>۝  {surah.ayahs} versets</span>
        <span style={{ color: isFav ? 'var(--gold)' : 'var(--text-dim)', fontSize: 14 }}>{isFav ? '★' : '☆'}</span>
      </div>

      <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4, letterSpacing: 1 }}>
        {surah.translation}
      </div>

      {/* Type pill */}
      <div style={{
        marginTop: 12, alignSelf: 'flex-start',
        fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
        color: surah.type === 'Mecquoise' ? 'var(--gold-dim)' : 'var(--text-dim)',
        border: `1px solid ${surah.type === 'Mecquoise' ? 'rgba(201,168,76,0.2)' : 'var(--border)'}`,
        borderRadius: 3, padding: '2px 8px',
      }}>
        {surah.type}
      </div>
    </div>
  )
}
