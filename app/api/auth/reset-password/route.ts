import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Informe o token e a nova senha.' }, { status: 400 })
    }
    if (password.length < 6) return NextResponse.json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' }, { status: 400 })

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const resetToken = await db.findValidPasswordResetToken(tokenHash)
    if (!resetToken) return NextResponse.json({ error: 'Este link é inválido ou já expirou.' }, { status: 400 })

    const passwordHash = await bcrypt.hash(password, 10)
    const updated = await db.consumePasswordResetToken(resetToken.id, passwordHash)
    if (!updated) return NextResponse.json({ error: 'Este link é inválido ou já expirou.' }, { status: 400 })
    return NextResponse.json({ success: true, message: 'Senha redefinida. Você já pode entrar com a nova senha.' })
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    return NextResponse.json({ error: 'Não foi possível redefinir a senha.' }, { status: 500 })
  }
}
