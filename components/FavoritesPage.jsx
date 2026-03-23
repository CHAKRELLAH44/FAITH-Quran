'use client'
import SurahCard from './SurahCard'

export default function FavoritesPage({ surahs, favorites, read, isFav, isRead, onOpen }) {
  const favSurahs = surahs.filter(s => favorites.includes(s.number))

  return (
    <div style={{ paddingTop: 80, padding: '80px 32px 80px', maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 1 }}>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 40, paddingBottom: 24, borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 28 }}>⭐</span>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
          Mes Favoris
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'Cinzel, serif', fontSize: 14, color: 'var(--text-dim)' }}>
          {favSurahs.length} sourate{favSurahs.length !== 1 ? 's' : ''}
        </span>
      </div>

      {favSurahs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>⭐</div>
          <div style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
            Aucun favori pour l'instant.<br />
            Ajoutez des sourates depuis leur page de lecture.
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {favSurahs.map((s, i) => (
            <SurahCard
              key={s.number}
              surah={s}
              isRead={isRead(s.number)}
              isFav={true}
              delay={i}
              onClick={() => onOpen(s.number)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
