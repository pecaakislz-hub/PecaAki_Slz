import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get('authorization') || ''
    const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
    const { password } = await req.json()
    if (!accessToken || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Sessão de recuperação ou senha inválida.' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    if (!admin) return NextResponse.json({ error: 'Supabase Auth não está configurado no servidor.' }, { status: 503 })
    const { data, error } = await admin.auth.getUser(accessToken)
    if (error || !data.user?.email) return NextResponse.json({ error: 'Sessão de recuperação inválida ou expirada.' }, { status: 401 })

    const passwordHash = await bcrypt.hash(password, 10)
    const updated = await db.updateUserPasswordByEmail(data.user.email, passwordHash)
    if (!updated) return NextResponse.json({ error: 'Usuário da aplicação não encontrado.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao sincronizar senha do Supabase Auth:', error)
    return NextResponse.json({ error: 'Não foi possível concluir a redefinição.' }, { status: 500 })
  }
}
