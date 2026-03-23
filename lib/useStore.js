'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

function loadLocal(username) {
  if (typeof window === 'undefined' || !username) return { favorites: [], read: [] }
  try { return JSON.parse(localStorage.getItem('nur_' + username) || '{}') || { favorites: [], read: [] } }
  catch { return { favorites: [], read: [] } }
}
function saveLocal(username, state) {
  if (typeof window === 'undefined' || !username) return
  localStorage.setItem('nur_' + username, JSON.stringify(state))
}

export function useStore() {
  const [username,      setUsername]      = useState(null)
  const [userId,        setUserId]        = useState(null)
  const [favorites,     setFavorites]     = useState([])
  const [read,          setRead]          = useState([])
  const [mounted,       setMounted]       = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => { setMounted(true) }, [])

  const login = useCallback(async (name) => {
    const key = name.trim().toLowerCase().replace(/\s+/g, '_')
    setUsername(key)
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({ username: key, last_seen: new Date().toISOString() }, { onConflict: 'username' })
        .select('id')
        .single()
      if (error) throw error
      const uid = data.id
      setUserId(uid)

      const { data: favData }  = await supabase.from('favorites').select('surah_id').eq('user_id', uid)
      const { data: progData } = await supabase.from('progress').select('surah_id').eq('user_id', uid).eq('completed', true)
      const { data: notifData }= await supabase.from('notifications').select('*').order('sent_at', { ascending: false }).limit(10)

      const favs  = favData?.map(f => f.surah_id)  || []
      const reads = progData?.map(p => p.surah_id) || []
      setFavorites(favs)
      setRead(reads)
      setNotifications(notifData || [])
      saveLocal(key, { favorites: favs, read: reads })
    } catch (err) {
      console.warn('Supabase indisponible, mode local:', err)
      const local = loadLocal(key)
      setFavorites(local.favorites || [])
      setRead(local.read || [])
    }
    return key
  }, [])

  const logout = useCallback(() => {
    setUsername(null); setUserId(null); setFavorites([]); setRead([])
  }, [])

  const toggleFavorite = useCallback(async (num) => {
    const isFav = favorites.includes(num)
    const newFavs = isFav ? favorites.filter(n => n !== num) : [...favorites, num]
    setFavorites(newFavs)
    if (userId) {
      if (isFav) await supabase.from('favorites').delete().eq('user_id', userId).eq('surah_id', num)
      else        await supabase.from('favorites').insert({ user_id: userId, surah_id: num })
    }
    saveLocal(username, { favorites: newFavs, read })
  }, [favorites, userId, username, read])

  const toggleRead = useCallback(async (num) => {
    const isDone = read.includes(num)
    const newRead = isDone ? read.filter(n => n !== num) : [...read, num]
    setRead(newRead)
    if (userId) {
      if (isDone) await supabase.from('progress').delete().eq('user_id', userId).eq('surah_id', num)
      else        await supabase.from('progress').upsert(
        { user_id: userId, surah_id: num, completed: true, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,surah_id' }
      )
    }
    saveLocal(username, { favorites, read: newRead })
  }, [read, userId, username, favorites])

  const isFavorite = useCallback((num) => favorites.includes(num), [favorites])
  const isRead     = useCallback((num) => read.includes(num),      [read])

  return {
    mounted, username, userId, login, logout,
    favorites, read, notifications,
    toggleFavorite, toggleRead, isFavorite, isRead,
  }
}