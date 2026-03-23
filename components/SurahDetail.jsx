'use client'
import { useState, useEffect, useRef } from 'react'
import { fetchAyat, fetchTranslation } from '../lib/quranApi'

// ══════════════════════════════════════════════════════════════
//  ICÔNES SVG — thème doré islamique
// ══════════════════════════════════════════════════════════════
const Icon = {
  // Livre ouvert → Lecture
  Book: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  // Étoile → Explication / connaissance
  Star: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  // Flèche retour
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  // Coche → Marquer comme lue
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  // Étoile pleine → Favoris actif
  StarFilled: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  // Étoile vide → Favoris inactif
  StarOutline: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  // Globe → langue
  Globe: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  // Croissant → arabe / islamique
  Crescent: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  // Lumière / soleil → contexte de révélation
  Sun: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  // Oeil → thème principal
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  // Clé → message clé
  Key: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  ),
  // Diamant → verset représentatif
  Diamond: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <path d="M2 8.5h20"/>
    </svg>
  ),
  // Cœur → vertu & bienfaits
  Heart: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  // Alerte → erreur
  Alert: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <triangle points="10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  // Refresh → réessayer
  Refresh: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
}

// ══════════════════════════════════════════════════════════════
//  COMPOSANT BOUTON LANGUE UNIFIÉ
// ══════════════════════════════════════════════════════════════
function LangBtn({ active, disabled, onClick, icon: IconComp, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '6px 16px',
        borderRadius: 5,
        fontSize: 12,
        letterSpacing: 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textTransform: 'uppercase',
        transition: 'all 0.2s',
        background: active ? 'var(--glow)' : 'transparent',
        border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
        color: active ? 'var(--gold)' : 'var(--text-secondary)',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'Lato, sans-serif',
      }}
    >
      {IconComp && <IconComp />}
      {children}
    </button>
  )
}

// ══════════════════════════════════════════════════════════════
//  COMPOSANT SECTION EXPLICATION
// ══════════════════════════════════════════════════════════════
function ExplSection({ icon: IconComp, title, children, isRTL }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: 3,
        color: 'var(--gold)', textTransform: 'uppercase',
        marginBottom: 16, paddingBottom: 10,
        borderBottom: '1px solid var(--border)',
        flexDirection: isRTL ? 'row-reverse' : 'row',
      }}>
        {IconComp && (
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 26, height: 26, borderRadius: '50%',
            border: '1px solid var(--border-bright)',
            background: 'var(--glow)', flexShrink: 0,
            color: 'var(--gold)',
          }}>
            <IconComp />
          </span>
        )}
        {title}
      </div>
      {children}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
//  COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function SurahDetail({ surah, isRead, isFav, onToggleRead, onToggleFav, onBack }) {
  const [activeTab,  setActiveTab]  = useState('read')
  const [lang,       setLang]       = useState('ar')
  const [explLang,   setExplLang]   = useState('fr')
  const [ayat,       setAyat]       = useState(null)
  const [trans,      setTrans]      = useState({})
  const [loading,    setLoading]    = useState(true)
  const [expl,       setExpl]       = useState(null)
  const [explLoad,   setExplLoad]   = useState(false)
  const [explError,  setExplError]  = useState(null)

  const explCache  = useRef({})
  const ayatCache  = useRef({})
  const transCache = useRef({})

  // ── Reset quand on change de sourate ─────────────────────────────────────
  useEffect(() => {
    setLoading(true); setAyat(null); setTrans({}); setLang('ar')
    setActiveTab('read'); setExpl(null); setExplError(null); setExplLang('fr')
    async function load() {
      try {
        if (!ayatCache.current[surah.number])
          ayatCache.current[surah.number] = await fetchAyat(surah.number)
        setAyat(ayatCache.current[surah.number])
      } catch { setAyat([]) }
      setLoading(false)
    }
    load()
  }, [surah.number])

  // ── Traduction lecture ────────────────────────────────────────────────────
  useEffect(() => {
    if (lang === 'ar') return
    async function loadTrans() {
      if (transCache.current[surah.number]?.[lang]) {
        setTrans(t => ({ ...t, [lang]: transCache.current[surah.number][lang] })); return
      }
      try {
        const data = await fetchTranslation(surah.number, lang)
        if (!transCache.current[surah.number]) transCache.current[surah.number] = {}
        transCache.current[surah.number][lang] = data
        setTrans(t => ({ ...t, [lang]: data }))
      } catch {}
    }
    loadTrans()
  }, [lang, surah.number])

  // ── Charger explication ───────────────────────────────────────────────────
  async function loadExplanation(targetLang) {
    if (explCache.current[surah.number]?.[targetLang]) {
      setExpl(prev => ({ ...prev, [targetLang]: explCache.current[surah.number][targetLang] })); return
    }
    setExplLoad(true); setExplError(null)

    const systemPrompt = targetLang === 'ar'
      ? 'أنت عالم في العلوم الإسلامية. أجب فقط بـ JSON صحيح، بدون markdown، بدون backticks.'
      : 'You are an Islamic scholar. Reply ONLY with valid JSON, no markdown, no backticks.'

    const userPrompt = targetLang === 'fr'
      ? `Génère une explication en français pour la sourate ${surah.number} "${surah.englishName}" (${surah.name} - ${surah.translation}). JSON uniquement :
{"context":"Contexte de révélation en 3-4 phrases","theme":"Thème principal en 2-3 phrases","message":"Message clé en 3-4 phrases","key_verse_arabic":"Un verset en arabe","key_verse_translation":"Traduction française","virtue":"Vertu ou bienfait"}`
      : targetLang === 'ar'
      ? `اشرح سورة ${surah.number} "${surah.name}". JSON فقط :
{"context":"سبب النزول في 3-4 جمل","theme":"الموضوع الرئيسي في 2-3 جمل","message":"الرسالة الأساسية في 3-4 جمل","key_verse_arabic":"آية مميزة","key_verse_translation":"معنى الآية","virtue":"فضل السورة"}`
      : `Explain Surah ${surah.number} "${surah.englishName}" (${surah.name}). JSON only:
{"context":"Context of revelation in 3-4 sentences","theme":"Main theme in 2-3 sentences","message":"Key message in 3-4 sentences","key_verse_arabic":"A verse in Arabic","key_verse_translation":"English translation","virtue":"Virtue or benefit"}`

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surahNumber: surah.number, englishName: surah.englishName, arabicName: surah.name, translation: surah.translation, systemPrompt, userPrompt }),
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `Erreur ${res.status}`) }
      const info = await res.json()
      if (info.error) throw new Error(info.message || 'Erreur inconnue')
      if (!explCache.current[surah.number]) explCache.current[surah.number] = {}
      explCache.current[surah.number][targetLang] = info
      setExpl(prev => ({ ...(prev || {}), [targetLang]: info }))
    } catch (err) {
      setExplError(err.message || 'Erreur de chargement')
    }
    setExplLoad(false)
  }

  function handleExplLang(l) { setExplLang(l); setExplError(null); if (!expl?.[l]) loadExplanation(l) }
  function handleTabSwitch(tab) { setActiveTab(tab); if (tab === 'expl' && !expl?.['fr'] && !explLoad) loadExplanation('fr') }

  const isRTL = explLang === 'ar'
  const currentExpl = expl?.[explLang]
  const T = {
    color: 'var(--text-secondary)', lineHeight: 2,
    direction: isRTL ? 'rtl' : 'ltr',
    fontFamily: isRTL ? 'Amiri, serif' : 'Lato, sans-serif',
    fontSize: isRTL ? 18 : 14,
  }

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* ══ Header ══════════════════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(201,168,76,0.07) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)', padding: '48px 48px 40px',
      }}>
        {/* Retour */}
        <button onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: 'var(--text-secondary)', fontSize: 13, letterSpacing: 1,
          textTransform: 'uppercase', background: 'none', border: 'none',
          cursor: 'pointer', marginBottom: 32, transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <Icon.ArrowLeft /> Retour
        </button>

        {/* Titre sourate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: 'Cinzel, serif', fontSize: 56, fontWeight: 700,
            color: 'rgba(201,168,76,0.15)', lineHeight: 1, flexShrink: 0,
          }}>
            {String(surah.number).padStart(3, '0')}
          </div>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {surah.englishName}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: 1 }}>
              {surah.translation}
            </div>
            <div style={{ fontFamily: 'Amiri, serif', fontSize: 36, color: 'var(--gold-light)' }}>
              {surah.name}
            </div>
          </div>
        </div>

        {/* Chips */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
          {[`${surah.ayahs} versets`, `Sourate ${surah.number}`, surah.type].map(c => (
            <div key={c} style={{
              background: 'var(--glow)', border: '1px solid var(--border-bright)',
              borderRadius: 4, padding: '4px 12px', fontSize: 11,
              letterSpacing: 1, color: 'var(--gold)', textTransform: 'uppercase',
            }}>{c}</div>
          ))}
        </div>

        {/* Boutons actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <button onClick={onToggleRead} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 8,
            fontFamily: 'Lato, sans-serif', fontSize: 13, letterSpacing: 1,
            cursor: 'pointer', textTransform: 'uppercase', fontWeight: 700,
            background: isRead ? 'linear-gradient(135deg, #5a3d10, #c9a84c)' : 'linear-gradient(135deg,var(--gold-dim),var(--gold))',
            border: 'none', color: '#0a0a0c', transition: 'all 0.2s',
          }}>
            <Icon.Check />
            {isRead ? 'Lue' : 'Marquer comme lue'}
          </button>
          <button onClick={onToggleFav} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 8,
            fontFamily: 'Lato, sans-serif', fontSize: 13, letterSpacing: 1,
            cursor: 'pointer', textTransform: 'uppercase', fontWeight: 700,
            background: isFav ? 'rgba(201,168,76,0.08)' : 'transparent',
            border: `1px solid ${isFav ? 'var(--gold)' : 'var(--border-bright)'}`,
            color: isFav ? 'var(--gold)' : 'var(--text-secondary)', transition: 'all 0.2s',
          }}>
            {isFav ? <Icon.StarFilled /> : <Icon.StarOutline />}
            {isFav ? 'Dans les favoris' : 'Ajouter aux favoris'}
          </button>
        </div>
      </div>

      {/* ══ Tabs ════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)',
        padding: '0 48px', background: 'rgba(10,10,12,0.5)',
      }}>
        {[
          { key: 'read', label: 'Lecture',      IconComp: Icon.Book  },
          { key: 'expl', label: 'Explication',  IconComp: Icon.Star  },
        ].map(({ key, label, IconComp }) => (
          <button key={key} onClick={() => handleTabSwitch(key)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '16px 28px', fontFamily: 'Lato, sans-serif', fontSize: 13,
            letterSpacing: 2, textTransform: 'uppercase',
            color: activeTab === key ? 'var(--gold)' : 'var(--text-dim)',
            background: 'none', border: 'none',
            borderBottom: `2px solid ${activeTab === key ? 'var(--gold)' : 'transparent'}`,
            marginBottom: -1, cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <IconComp />
            {label}
          </button>
        ))}
      </div>

      {/* ══ Tab : Lecture ═══════════════════════════════════════════════════ */}
      {activeTab === 'read' && (
        <div style={{ padding: '48px', maxWidth: 900 }}>

          {/* Boutons langue */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            <LangBtn active={lang === 'ar'} onClick={() => setLang('ar')} icon={Icon.Crescent}>العربية</LangBtn>
            <LangBtn active={lang === 'fr'} onClick={() => setLang('fr')} icon={Icon.Globe}>Français</LangBtn>
            <LangBtn active={lang === 'en'} onClick={() => setLang('en')} icon={Icon.Globe}>English</LangBtn>
          </div>

          {/* Bismillah */}
          {surah.number !== 9 && (
            <div style={{
              textAlign: 'center', fontFamily: 'Amiri, serif',
              fontSize: 'clamp(24px,4vw,36px)', color: 'var(--gold-light)',
              direction: 'rtl', marginBottom: 40, padding: '24px',
              borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
            }}>
              ✦ &nbsp; بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ &nbsp; ✦
            </div>
          )}

          {/* Versets */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <div className="spinner" /><div style={{ marginTop: 16 }}>Chargement des versets...</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {ayat?.map((a, i) => (
                <div key={i} style={{
                  border: '1px solid var(--border)', borderRadius: 10,
                  padding: '24px 28px', background: 'var(--bg-card)', transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{
                    fontFamily: 'Amiri, serif', fontSize: 'clamp(22px,3vw,30px)',
                    lineHeight: 2, color: 'var(--text-primary)',
                    direction: 'rtl', textAlign: 'right',
                    marginBottom: lang !== 'ar' ? 16 : 0,
                  }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, border: '1px solid var(--gold-dim)', borderRadius: '50%',
                      fontFamily: 'Cinzel, serif', fontSize: 10, color: 'var(--gold)',
                      marginLeft: 12, verticalAlign: 'middle',
                    }}>
                      {a.numberInSurah}
                    </span>
                    {a.text}
                  </div>
                  {lang !== 'ar' && trans[lang] && (
                    <div style={{
                      fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)',
                      paddingTop: 16, borderTop: '1px solid var(--border)', fontStyle: 'italic',
                    }}>
                      {trans[lang]?.[i]?.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ Tab : Explication ═══════════════════════════════════════════════ */}
      {activeTab === 'expl' && (
        <div style={{ padding: '48px', maxWidth: 900 }}>

          {/* Boutons langue — même style */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            <LangBtn active={explLang === 'fr'} disabled={explLoad} onClick={() => handleExplLang('fr')} icon={Icon.Globe}>Français</LangBtn>
            <LangBtn active={explLang === 'ar'} disabled={explLoad} onClick={() => handleExplLang('ar')} icon={Icon.Crescent}>العربية</LangBtn>
            <LangBtn active={explLang === 'en'} disabled={explLoad} onClick={() => handleExplLang('en')} icon={Icon.Globe}>English</LangBtn>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginBottom: 36 }} />

          {/* Chargement */}
          {explLoad && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <div className="spinner" />
              <div style={{ marginTop: 16, fontSize: 14 }}>
                {explLang === 'ar' ? 'جارٍ توليد الشرح...' : explLang === 'en' ? 'Generating explanation...' : "Génération de l'explication..."}
              </div>
            </div>
          )}

          {/* Erreur */}
          {!explLoad && explError && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <div style={{ color: 'var(--gold)', marginBottom: 16, opacity: 0.7 }}><Icon.Alert /></div>
              <div style={{ marginBottom: 8 }}>Impossible de charger l'explication.</div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 24 }}>{explError}</div>
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '16px 20px', textAlign: 'left',
                fontSize: 13, color: 'var(--text-dim)', maxWidth: 480, margin: '0 auto 20px',
              }}>
                <div style={{ color: 'var(--gold)', marginBottom: 8, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
                  Pour activer cette fonctionnalité :
                </div>
                <div>1. Crée <code style={{ color: 'var(--gold-light)' }}>.env.local</code> à la racine</div>
                <div style={{ marginTop: 6 }}>2. Ajoute : <code style={{ color: 'var(--gold-light)' }}>GROQ_API_KEY=gsk_...</code></div>
                <div style={{ marginTop: 6 }}>3. Redémarre : <code style={{ color: 'var(--gold-light)' }}>npm run dev</code></div>
              </div>
              <button onClick={() => { setExplError(null); loadExplanation(explLang) }} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 8,
                background: 'var(--glow)', border: '1px solid var(--border-bright)',
                color: 'var(--gold)', cursor: 'pointer', fontSize: 13,
                fontFamily: 'Lato, sans-serif', letterSpacing: 1,
              }}>
                <Icon.Refresh /> Réessayer
              </button>
            </div>
          )}

          {/* Contenu */}
          {!explLoad && !explError && currentExpl && (
            <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>

              <ExplSection icon={Icon.Sun} isRTL={isRTL}
                title={explLang === 'ar' ? 'سبب النزول' : explLang === 'en' ? 'Context of Revelation' : 'Contexte de Révélation'}>
                <div style={T}>{currentExpl.context}</div>
              </ExplSection>

              <ExplSection icon={Icon.Eye} isRTL={isRTL}
                title={explLang === 'ar' ? 'الموضوع الرئيسي' : explLang === 'en' ? 'Main Theme' : 'Thème Principal'}>
                <div style={T}>{currentExpl.theme}</div>
              </ExplSection>

              <ExplSection icon={Icon.Key} isRTL={isRTL}
                title={explLang === 'ar' ? 'الرسالة الأساسية' : explLang === 'en' ? 'Key Message' : 'Message Clé'}>
                <div style={T}>{currentExpl.message}</div>
              </ExplSection>

              {currentExpl.key_verse_arabic && (
                <ExplSection icon={Icon.Diamond} isRTL={isRTL}
                  title={explLang === 'ar' ? 'آية مميزة' : explLang === 'en' ? 'Key Verse' : 'Verset Représentatif'}>
                  <div style={{
                    borderLeft: isRTL ? 'none' : '2px solid var(--gold-dim)',
                    borderRight: isRTL ? '2px solid var(--gold-dim)' : 'none',
                    padding: '16px 20px', margin: '16px 0',
                    background: 'var(--glow)',
                    borderRadius: isRTL ? '8px 0 0 8px' : '0 8px 8px 0',
                    fontFamily: 'Amiri, serif', fontSize: 22,
                    direction: 'rtl', textAlign: 'right',
                    color: 'var(--gold-light)', lineHeight: 2,
                  }}>
                    {currentExpl.key_verse_arabic}
                  </div>
                  <div style={{ ...T, fontStyle: 'italic', marginTop: 8 }}>
                    &ldquo;{currentExpl.key_verse_translation}&rdquo;
                  </div>
                </ExplSection>
              )}

              {currentExpl.virtue && (
                <ExplSection icon={Icon.Heart} isRTL={isRTL}
                  title={explLang === 'ar' ? 'فضل السورة' : explLang === 'en' ? 'Virtue & Benefits' : 'Vertu & Bienfaits'}>
                  <div style={T}>{currentExpl.virtue}</div>
                </ExplSection>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  )
}