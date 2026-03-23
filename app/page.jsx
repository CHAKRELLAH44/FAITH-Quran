'use client'
import { useState } from 'react'
import { useStore }       from '../lib/useStore'
import { SURAHS }         from '../lib/surahs'
import LoginScreen        from '../components/LoginScreen'
import Topbar             from '../components/Topbar'
import Notification, { notify } from '../components/Notification'
import HomePage           from '../components/HomePage'
import SurahDetail        from '../components/SurahDetail'
import FavoritesPage      from '../components/FavoritesPage'
import ProgressPage       from '../components/ProgressPage'

export default function App() {
  const store = useStore()
  const [displayName, setDisplayName] = useState('')
  const [page,        setPage]        = useState('home')
  const [openSurah,   setOpenSurah]   = useState(null)

  // ── Login ─────────────────────────────────────────────────────────────────
  function handleLogin(name) {
    store.login(name)
    setDisplayName(name)
    notify('✦', `Bienvenue, ${name} !`)
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  function handleLogout() {
    store.logout()
    setDisplayName('')
    setPage('home')
    setOpenSurah(null)
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function openSurahDetail(num) {
    const s = SURAHS.find(x => x.number === num)
    if (!s) return
    setOpenSurah(s)
    setPage('detail')
  }

  // ── Toggles ───────────────────────────────────────────────────────────────
  function handleToggleFav(num) {
    const s = SURAHS.find(x => x.number === num)
    store.isFavorite(num)
      ? notify('☆', `${s?.englishName} retirée des favoris`)
      : notify('★', `${s?.englishName} ajoutée aux favoris`)
    store.toggleFavorite(num)
  }

  function handleToggleRead(num) {
    const s = SURAHS.find(x => x.number === num)
    store.isRead(num)
      ? notify('✗', `${s?.englishName} démarquée`)
      : notify('✔', `${s?.englishName} marquée comme lue`)
    store.toggleRead(num)
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!store.username) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Notification />
      </>
    )
  }

  return (
    <>
      <Topbar
        username={displayName || store.username}
        read={store.read}
        page={page}
        onNav={setPage}
        onLogout={handleLogout}
      />

      {page === 'home' && (
        <HomePage
          surahs={SURAHS}
          read={store.read}
          favorites={store.favorites}
          isFav={store.isFavorite}
          isRead={store.isRead}
          onOpen={openSurahDetail}
        />
      )}

      {page === 'detail' && openSurah && (
        <SurahDetail
          surah={openSurah}
          isRead={store.isRead(openSurah.number)}
          isFav={store.isFavorite(openSurah.number)}
          onToggleRead={() => handleToggleRead(openSurah.number)}
          onToggleFav={()  => handleToggleFav(openSurah.number)}
          onBack={() => setPage('home')}
        />
      )}

      {page === 'favorites' && (
        <FavoritesPage
          surahs={SURAHS}
          favorites={store.favorites}
          read={store.read}
          isFav={store.isFavorite}
          isRead={store.isRead}
          onOpen={openSurahDetail}
        />
      )}

      {page === 'progress' && (
        <ProgressPage
          surahs={SURAHS}
          read={store.read}
          isRead={store.isRead}
          onOpen={openSurahDetail}
        />
      )}

      <Notification />
    </>
  )
}