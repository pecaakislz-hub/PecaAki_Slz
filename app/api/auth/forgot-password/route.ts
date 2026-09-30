import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ensureSupabaseUser, getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const genericMessage = 'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!email) return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })

    const user = await db.findUserByEmail(email)
    if (!user) return NextResponse.json({ success: true, message: genericMessage }, { headers: { 'Cache-Control': 'no-store' } })

    if (!getSupabaseAdmin()) {
      console.error('Supabase Auth admin não configurado: SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_SECRET_KEY ausente.')
      return NextResponse.json({ error: 'A recuperação de senha ainda não está configurada no servidor.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
    }

    await ensureSupabaseUser(user.email, undefined, { app_user_id: user.id, role: user.role })
    return NextResponse.json({ success: true, message: genericMessage }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Erro ao preparar recuperação pelo Supabase Auth:', error)
    return NextResponse.json({ error: 'Não foi possível iniciar a recuperação de senha.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
