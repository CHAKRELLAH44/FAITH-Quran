import { supabaseAdmin } from './supabase'

export async function verifyAdmin(req) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return null

  const db = supabaseAdmin()
  const { data } = await db
    .from('admin_sessions')
    .select('id, expires_at')
    .eq('token', token)
    .single()

  if (!data) return null
  if (new Date(data.expires_at) < new Date()) return null
  return data.id
}