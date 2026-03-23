'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SURAHS } from '../../../lib/surahs'

// ── Icônes ────────────────────────────────────────────────────
const IconUsers    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IconChart    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const IconBook     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const IconBell     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IconLogout   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IconTrash    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const IconSend     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
const IconRefresh  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>

// ── Composants UI ─────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '24px 28px',
      flex: '1 1 160px', minWidth: 160,
    }}>
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 36, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 8 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 600,
      color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase',
      marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)',
    }}>
      <span style={{
        width: 30, height: 30, borderRadius: '50%',
        border: '1px solid var(--border-bright)', background: 'var(--glow)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--gold)', flexShrink: 0,
      }}><Icon /></span>
      {title}
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────
export default function AdminDashboard() {
  const router  = useRouter()
  const [tab,   setTab]    = useState('stats')
  const [data,  setData]   = useState({})
  const [loading, setLoading] = useState(true)
  const [notifTitle, setNotifTitle] = useState('')
  const [notifMsg,   setNotifMsg]   = useState('')
  const [sending,    setSending]    = useState(false)
  const [sendResult, setSendResult] = useState('')
  const [delConfirm, setDelConfirm] = useState(null)

  const fetchData = useCallback(async (type) => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/admin?type=${type}`)
      if (res.status === 401) { router.push('/admin'); return }
      const json = await res.json()
      setData(prev => ({ ...prev, ...json }))
    } catch {}
    setLoading(false)
  }, [router])

  useEffect(() => { fetchData('stats') }, [])

  function handleTabChange(t) {
    setTab(t)
    if (t === 'stats')  fetchData('stats')
    if (t === 'users')  fetchData('users')
    if (t === 'notifs') fetchData('notifications')
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  async function sendNotification() {
    if (!notifTitle || !notifMsg) return
    setSending(true); setSendResult('')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_notification', title: notifTitle, message: notifMsg }),
      })
      const json = await res.json()
      if (json.success) {
        setSendResult('✦ Notification envoyée avec succès')
        setNotifTitle(''); setNotifMsg('')
        fetchData('notifications')
      } else {
        setSendResult('⚠ Erreur : ' + json.error)
      }
    } catch { setSendResult('⚠ Erreur réseau') }
    setSending(false)
  }

  async function deleteUser(userId, username) {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_user', userId }),
    })
    if ((await res.json()).success) {
      setDelConfirm(null)
      fetchData('users')
    }
  }

  const surahName = (id) => SURAHS.find(s => s.number === id)?.englishName || `Sourate ${id}`
  const surahAr   = (id) => SURAHS.find(s => s.number === id)?.name || ''

  const S = { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* ── Topbar admin ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
        background: 'rgba(10,10,12,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 700, color: 'var(--gold)', letterSpacing: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Amiri, serif', fontSize: 22, color: 'var(--gold-light)' }}></span>
          FAITH &nbsp;
          <span style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text-dim)', fontWeight: 400, border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 4 }}>ADMIN</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { key: 'stats',  label: 'Statistiques', Icon: IconChart  },
            { key: 'users',  label: 'Utilisateurs', Icon: IconUsers  },
            { key: 'surahs', label: 'Sourates',      Icon: IconBook   },
            { key: 'notifs', label: 'Notifications', Icon: IconBell   },
          ].map(({ key, label, Icon }) => (
            <button key={key} onClick={() => handleTabChange(key)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'Lato, sans-serif', fontSize: 12, letterSpacing: 1,
              textTransform: 'uppercase', transition: 'all 0.2s',
              background: tab === key ? 'var(--glow)' : 'transparent',
              border: `1px solid ${tab === key ? 'var(--border-bright)' : 'transparent'}`,
              color: tab === key ? 'var(--gold)' : 'var(--text-secondary)',
            }}>
              <Icon />{label}
            </button>
          ))}
        </div>

        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--text-dim)', fontFamily: 'Lato, sans-serif',
          fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#c05050'; e.currentTarget.style.borderColor = 'rgba(180,60,60,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <IconLogout /> Déconnexion
        </button>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
            <div className="spinner" /><div style={{ marginTop: 16 }}>Chargement...</div>
          </div>
        )}

        {/* ══ STATISTIQUES ══════════════════════════════════════ */}
        {!loading && tab === 'stats' && (
          <div>
            <SectionTitle icon={IconChart} title="Statistiques Globales" />

            {/* Cartes stats */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
              <StatCard label="Utilisateurs" value={data.stats?.totalUsers || 0} />
              <StatCard label="Lectures totales" value={data.stats?.totalReads || 0} />
              <StatCard label="Favoris totaux" value={data.stats?.totalFavs || 0} />
              <StatCard label="Moy. lus / user" value={data.stats?.avgReadPerUser || 0} sub="sourates par utilisateur" />
            </div>

            {/* Top sourates lues */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>
                  Top 10 — Sourates les plus lues
                </div>
                {data.topReadSurahs?.map((s, i) => (
                  <div key={s.surah_id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: 'var(--gold-dim)', width: 24, textAlign: 'right' }}>{i+1}</span>
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)' }}>{surahName(s.surah_id)}</span>
                    <span style={{ fontFamily: 'Amiri, serif', fontSize: 16, color: 'var(--gold-light)' }}>{surahAr(s.surah_id)}</span>
                    {/* Barre */}
                    <div style={{ width: 80, height: 4, background: 'rgba(201,168,76,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 2,
                        background: 'linear-gradient(90deg, var(--gold-dim), var(--gold))',
                        width: `${Math.round(s.count / (data.topReadSurahs[0]?.count || 1) * 100)}%`,
                      }}/>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)', width: 30, textAlign: 'right' }}>{s.count}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>
                  Top 10 — Sourates en favoris
                </div>
                {data.topFavSurahs?.map((s, i) => (
                  <div key={s.surah_id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: 'var(--gold-dim)', width: 24, textAlign: 'right' }}>{i+1}</span>
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)' }}>{surahName(s.surah_id)}</span>
                    <span style={{ fontFamily: 'Amiri, serif', fontSize: 16, color: 'var(--gold-light)' }}>{surahAr(s.surah_id)}</span>
                    <div style={{ width: 80, height: 4, background: 'rgba(201,168,76,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 2,
                        background: 'linear-gradient(90deg, var(--gold-dim), var(--gold))',
                        width: `${Math.round(s.count / (data.topFavSurahs[0]?.count || 1) * 100)}%`,
                      }}/>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)', width: 30, textAlign: 'right' }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Derniers inscrits */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>
                Derniers utilisateurs inscrits
              </div>
              {data.recentUsers?.map(u => (
                <div key={u.username} style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#0a0a0c', flexShrink: 0 }}>
                    {u.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{u.username.replace(/_/g, ' ')}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ UTILISATEURS ══════════════════════════════════════ */}
        {!loading && tab === 'users' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <SectionTitle icon={IconUsers} title={`Utilisateurs (${data.users?.length || 0})`} />
              <button onClick={() => fetchData('users')} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 6, color: 'var(--text-secondary)', fontSize: 12,
                cursor: 'pointer', fontFamily: 'Lato, sans-serif', letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                <IconRefresh /> Actualiser
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 120px 120px 140px 40px',
                gap: 16, padding: '8px 20px',
                fontSize: 10, letterSpacing: 2, color: 'var(--text-dim)', textTransform: 'uppercase',
              }}>
                <span>Utilisateur</span><span>Lues</span><span>Favoris</span><span>Inscrit le</span><span></span>
              </div>

              {data.users?.map(u => (
                <div key={u.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 120px 120px 140px 40px',
                  gap: 16, padding: '14px 20px', alignItems: 'center',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#0a0a0c', flexShrink: 0 }}>
                      {u.username[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{u.username.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 13, color: 'var(--gold)' }}>{u.read_count}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-dim)' }}> / 114</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.fav_count}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</div>
                  <button
                    onClick={() => setDelConfirm(u)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', transition: 'color 0.2s', padding: 4 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#c05050'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                  >
                    <IconTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal confirm suppression */}
            {delConfirm && (
              <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
              }} onClick={() => setDelConfirm(null)}>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
                  borderRadius: 12, padding: '32px 36px', maxWidth: 360, width: '90%',
                }} onClick={e => e.stopPropagation()}>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: 16, color: 'var(--text-primary)', marginBottom: 12 }}>
                    Supprimer l'utilisateur ?
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
                    <strong style={{ color: 'var(--gold)', textTransform: 'capitalize' }}>{delConfirm.username.replace(/_/g, ' ')}</strong> sera définitivement supprimé avec toutes ses données.
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setDelConfirm(null)} style={{
                      flex: 1, padding: '10px', borderRadius: 8,
                      background: 'transparent', border: '1px solid var(--border)',
                      color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13,
                      fontFamily: 'Lato, sans-serif',
                    }}>Annuler</button>
                    <button onClick={() => deleteUser(delConfirm.id, delConfirm.username)} style={{
                      flex: 1, padding: '10px', borderRadius: 8,
                      background: 'rgba(180,60,60,0.15)', border: '1px solid rgba(180,60,60,0.4)',
                      color: '#c05050', cursor: 'pointer', fontSize: 13,
                      fontFamily: 'Lato, sans-serif',
                    }}>Supprimer</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ SOURATES ══════════════════════════════════════════ */}
        {!loading && tab === 'surahs' && (
          <div>
            <SectionTitle icon={IconBook} title="Gestion des Sourates" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {SURAHS.map(s => (
                <div key={s.number} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '16px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ width: 34, height: 34, border: '1px solid var(--border-bright)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cinzel, serif', fontSize: 11, color: 'var(--gold)', flexShrink: 0 }}>
                    {String(s.number).padStart(3,'0')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'Cinzel, serif' }}>{s.englishName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{s.ayahs} versets · {s.type}</div>
                  </div>
                  <div style={{ fontFamily: 'Amiri, serif', fontSize: 18, color: 'var(--gold-light)', flexShrink: 0 }}>{s.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ NOTIFICATIONS ═════════════════════════════════════ */}
        {!loading && tab === 'notifs' && (
          <div>
            <SectionTitle icon={IconBell} title="Notifications" />

            {/* Formulaire d'envoi */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
              borderRadius: 12, padding: '28px 32px', marginBottom: 32,
            }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 20 }}>
                Envoyer une notification à tous les utilisateurs
              </div>

              <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Titre</label>
              <input
                value={notifTitle}
                onChange={e => setNotifTitle(e.target.value)}
                placeholder="ex: Nouveau contenu disponible"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)', borderRadius: 8,
                  padding: '12px 16px', color: 'var(--text-primary)',
                  fontFamily: 'Lato, sans-serif', fontSize: 14,
                  outline: 'none', marginBottom: 16,
                }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border)'}
              />

              <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Message</label>
              <textarea
                value={notifMsg}
                onChange={e => setNotifMsg(e.target.value)}
                placeholder="Écris ton message ici..."
                rows={3}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)', borderRadius: 8,
                  padding: '12px 16px', color: 'var(--text-primary)',
                  fontFamily: 'Lato, sans-serif', fontSize: 14,
                  outline: 'none', marginBottom: 16, resize: 'vertical',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border)'}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  onClick={sendNotification}
                  disabled={sending || !notifTitle || !notifMsg}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 24px', borderRadius: 8,
                    background: sending ? 'var(--gold-dim)' : 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
                    border: 'none', color: '#0a0a0c',
                    fontFamily: 'Lato, sans-serif', fontSize: 13,
                    fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                    cursor: sending ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    opacity: (!notifTitle || !notifMsg) ? 0.5 : 1,
                  }}
                >
                  <IconSend /> {sending ? 'Envoi...' : 'Envoyer'}
                </button>
                {sendResult && (
                  <span style={{ fontSize: 13, color: sendResult.startsWith('✦') ? 'var(--gold)' : '#c05050' }}>
                    {sendResult}
                  </span>
                )}
              </div>
            </div>

            {/* Historique notifications */}
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: 2, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 16 }}>
              Historique
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.notifications?.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>Aucune notification envoyée</div>
              )}
              {data.notifications?.map(n => (
                <div key={n.id} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '16px 20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: 13, color: 'var(--text-primary)' }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{new Date(n.sent_at).toLocaleString('fr-FR')}</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{n.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
