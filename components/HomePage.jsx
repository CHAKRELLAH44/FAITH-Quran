'use client'
import { useState } from 'react'
import SurahCard from './SurahCard'

export default function HomePage({ surahs, read, favorites, isFav, isRead, onOpen }) {
  const [query,  setQuery]  = useState('')
  const [filter, setFilter] = useState('all') // all | short | long

  const filtered = surahs.filter(s => {
    const matchFilter =
      filter === 'all'   ? true :
      filter === 'short' ? s.ayahs <= 20 :
      /* long */            s.ayahs > 100

    const q = query.toLowerCase()
    const matchSearch = !q ||
      s.englishName.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      String(s.number).includes(q) ||
      s.translation.toLowerCase().includes(q)

    return matchFilter && matchSearch
  })

  return (
    <div style={{ paddingTop: 64, position: 'relative', zIndex: 1 }}>

      {/* Hero */}
      <div style={{ padding: '64px 32px 48px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Amiri, serif', fontSize: 'clamp(28px, 5vw, 48px)',
          color: 'var(--gold-light)', direction: 'rtl', marginBottom: 16, opacity: 0.9,
        }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>
        <div style={{
          fontFamily: 'Cinzel, serif', fontSize: 'clamp(14px, 2vw, 18px)',
          letterSpacing: 6, color: 'var(--text-secondary)', textTransform: 'uppercase',
        }}>
          Le Noble Coran — 114 Sourates
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
        padding: '0 32px 40px', maxWidth: 800, margin: '0 auto',
      }}>
        {[
          { n: '114',              label: 'Sourates'  },
          null,
          { n: '6236',             label: 'Versets'   },
          null,
          { n: read.length,        label: 'Lues'      },
          null,
          { n: favorites.length,   label: 'Favoris'   },
        ].map((item, i) =>
          item === null ? (
            <div key={i} style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch' }} />
          ) : (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: 28, color: 'var(--gold)', fontWeight: 700 }}>{item.n}</span>
              <span style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: 2, textTransform: 'uppercase' }}>{item.label}</span>
            </div>
          )
        )}
      </div>

      {/* Search & Filters */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
        justifyContent: 'center', padding: '0 32px 48px',
        maxWidth: 900, margin: '0 auto',
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: 240, maxWidth: 360, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: 14 }}></span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher par nom ou numéro..."
            style={{
              width: '100%', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 8,
              padding: '11px 14px 11px 40px', color: 'var(--text-primary)',
              fontFamily: 'Lato, sans-serif', fontSize: 14, outline: 'none',
            }}
            onFocus={e  => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)' }}
            onBlur={e   => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { key: 'all',   label: 'Toutes'  },
            { key: 'short', label: 'Courtes' },
            { key: 'long',  label: 'Longues' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                background: filter === key ? 'var(--glow)' : 'var(--bg-card)',
                border: `1px solid ${filter === key ? 'var(--gold)' : 'var(--border)'}`,
                borderRadius: 6, padding: '10px 18px',
                color: filter === key ? 'var(--gold)' : 'var(--text-secondary)',
                fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16, padding: '0 32px 80px',
        maxWidth: 1400, margin: '0 auto',
      }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            Aucune sourate trouvée
          </div>
        ) : (
          filtered.map((s, i) => (
            <SurahCard
              key={s.number}
              surah={s}
              isRead={isRead(s.number)}
              isFav={isFav(s.number)}
              delay={i}
              onClick={() => onOpen(s.number)}
            />
          ))
        )}
      </div>
    </div>
  )
}
