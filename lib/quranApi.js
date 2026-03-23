const BASE = 'https://api.alquran.cloud/v1'

// ─── Fetch all 114 surah metadata ─────────────────────────────────────────────
export async function fetchSurahList() {
  const res  = await fetch(`${BASE}/surah`)
  const data = await res.json()
  return data.data   // array of surah objects
}

// ─── Fetch Arabic ayat for one surah ──────────────────────────────────────────
export async function fetchAyat(surahNumber) {
  const res  = await fetch(`${BASE}/surah/${surahNumber}`)
  const data = await res.json()
  return data.data.ayahs   // [{ numberInSurah, text }, ...]
}

// ─── Fetch translated ayat ────────────────────────────────────────────────────
// lang: 'fr' → fr.hamidullah  |  'en' → en.sahih
export async function fetchTranslation(surahNumber, lang) {
  const edition = lang === 'fr' ? 'fr.hamidullah' : 'en.sahih'
  const res  = await fetch(`${BASE}/surah/${surahNumber}/${edition}`)
  const data = await res.json()
  return data.data.ayahs   // [{ numberInSurah, text }, ...]
}
