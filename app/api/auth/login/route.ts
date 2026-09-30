import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { ensureSupabaseUser } from '@/lib/supabase-admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Informe e-mail e senha' }, { status: 400 })
    }

    const user = await db.findUserByEmail(email)

    if (!user) {
      return NextResponse.json({ error: 'E-mail ou senha inválidos' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'E-mail ou senha inválidos' }, { status: 401 })
    }

    try {
      await ensureSupabaseUser(user.email, password, { app_user_id: user.id, role: user.role })
    } catch (error) {
      // O login legado continua funcionando; o erro será corrigido na próxima tentativa.
      console.error('Não foi possível sincronizar o usuário com o Supabase Auth:', error)
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeProfile: user.storeProfile
      }
    })

    response.cookies.set('pecaaki_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (error: any) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro interno ao realizar login' }, { status: 500 })
  }
}
