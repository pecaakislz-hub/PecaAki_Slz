import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken } from '@/lib/auth'

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
