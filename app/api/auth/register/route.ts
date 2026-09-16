import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone, role, city, neighborhood, storeData } = body

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios' }, { status: 400 })
    }

    const existingUser = await db.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: 'E-mail já cadastrado na plataforma' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await db.createUser({
      name,
      email,
      passwordHash,
      phone,
      role: role || 'COMPRADOR',
      city: city || 'São Luís',
      neighborhood: neighborhood || 'Centro',
      storeProfile: storeData
    })

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
    console.error('Erro no registro:', error)
    return NextResponse.json({ error: 'Erro interno ao realizar cadastro' }, { status: 500 })
  }
}
