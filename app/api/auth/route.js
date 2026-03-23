import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase'
import crypto from 'crypto'

export async function POST(req) {
  try {
    const { code } = await req.json()
    if (code !== process.env.ADMIN_SECRET_CODE)
      return NextResponse.json({ error: 'Code incorrect' }, { status: 401 })

    const token = crypto.randomBytes(32).toString('hex')
    const db    = supabaseAdmin()
    await db.from('admin_sessions').insert({
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   60 * 60 * 24,
      path:     '/',
    })
    return response
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_token')
  return response
}