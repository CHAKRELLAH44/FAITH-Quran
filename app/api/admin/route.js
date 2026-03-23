import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'
import { verifyAdmin }   from '../../../lib/adminAuth'

export async function GET(req) {
  const session = await verifyAdmin(req)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const type = new URL(req.url).searchParams.get('type')
  const db   = supabaseAdmin()

  try {
    if (type === 'users') {
      const { data: users } = await db
        .from('users').select('id, username, created_at, last_seen')
        .order('created_at', { ascending: false })

      const enriched = await Promise.all(users.map(async (u) => {
        const [{ count: favCount }, { count: readCount }] = await Promise.all([
          db.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', u.id),
          db.from('progress').select('*', { count: 'exact', head: true }).eq('user_id', u.id).eq('completed', true),
        ])
        return { ...u, fav_count: favCount || 0, read_count: readCount || 0 }
      }))
      return NextResponse.json({ users: enriched })
    }

    if (type === 'stats') {
      const [
        { count: totalUsers },
        { count: totalReads },
        { count: totalFavs },
        { data: topRead },
        { data: topFav },
        { data: recentUsers },
      ] = await Promise.all([
        db.from('users').select('*', { count: 'exact', head: true }),
        db.from('progress').select('*', { count: 'exact', head: true }).eq('completed', true),
        db.from('favorites').select('*', { count: 'exact', head: true }),
        db.from('progress').select('surah_id').eq('completed', true),
        db.from('favorites').select('surah_id'),
        db.from('users').select('username, created_at').order('created_at', { ascending: false }).limit(5),
      ])

      const readMap = {}
      topRead?.forEach(r => { readMap[r.surah_id] = (readMap[r.surah_id] || 0) + 1 })
      const topReadSorted = Object.entries(readMap)
        .sort(([,a],[,b]) => b - a).slice(0, 10)
        .map(([surah_id, count]) => ({ surah_id: parseInt(surah_id), count }))

      const favMap = {}
      topFav?.forEach(f => { favMap[f.surah_id] = (favMap[f.surah_id] || 0) + 1 })
      const topFavSorted = Object.entries(favMap)
        .sort(([,a],[,b]) => b - a).slice(0, 10)
        .map(([surah_id, count]) => ({ surah_id: parseInt(surah_id), count }))

      return NextResponse.json({
        stats: {
          totalUsers:      totalUsers || 0,
          totalReads:      totalReads || 0,
          totalFavs:       totalFavs  || 0,
          avgReadPerUser:  totalUsers ? Math.round((totalReads || 0) / totalUsers) : 0,
        },
        topReadSurahs: topReadSorted,
        topFavSurahs:  topFavSorted,
        recentUsers:   recentUsers || [],
      })
    }

    if (type === 'notifications') {
      const { data } = await db.from('notifications').select('*').order('sent_at', { ascending: false })
      return NextResponse.json({ notifications: data || [] })
    }

    return NextResponse.json({ error: 'Type invalide' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  const session = await verifyAdmin(req)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { action, ...payload } = await req.json()
  const db = supabaseAdmin()

  try {
    if (action === 'send_notification') {
      const { title, message } = payload
      if (!title || !message)
        return NextResponse.json({ error: 'Titre et message requis' }, { status: 400 })
      const { data } = await db.from('notifications').insert({ title, message }).select().single()
      return NextResponse.json({ success: true, notification: data })
    }
    if (action === 'delete_user') {
      await db.from('users').delete().eq('id', payload.userId)
      return NextResponse.json({ success: true })
    }
    if (action === 'update_surah') {
      await db.from('surah_notes')
        .upsert({ surah_id: payload.surahId, note: payload.note }, { onConflict: 'surah_id' })
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}