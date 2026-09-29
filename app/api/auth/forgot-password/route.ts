import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { db } from '@/lib/db'

const genericMessage = 'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.'

async function sendResetEmail(email: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.MAIL_FROM
  if (!apiKey || !from) return false
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Recuperação de senha — PeçaAki',
      html: `<p>Recebemos uma solicitação para redefinir sua senha no PeçaAki.</p><p><a href="${resetUrl}">Criar uma nova senha</a></p><p>O link expira em 30 minutos. Se você não fez esta solicitação, ignore este e-mail.</p>`
    })
  })
  return response.ok
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 })

    const user = await db.findUserByEmail(email.trim())
    if (!user) return NextResponse.json({ success: true, message: genericMessage })

    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)
    const token = await db.createPasswordResetToken(user.id, tokenHash, expiresAt)
    const forwardedProto = req.headers.get('x-forwarded-proto') || 'http'
    const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || new URL(req.url).host
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${forwardedProto}://${forwardedHost}`
    const resetUrl = `${origin}/redefinir-senha?token=${rawToken}`
    const sent = await sendResetEmail(user.email, resetUrl)

    if (!sent && process.env.ALLOW_LOCAL_RESET_LINK !== 'true') {
      return NextResponse.json({ error: 'A recuperação está temporariamente indisponível. O serviço de e-mail ainda não foi configurado.' }, { status: 503 })
    }

    return NextResponse.json({ success: true, message: genericMessage, ...(process.env.ALLOW_LOCAL_RESET_LINK === 'true' ? { resetUrl } : {}) })
  } catch (error) {
    console.error('Erro na recuperação de senha:', error)
    return NextResponse.json({ error: 'Não foi possível iniciar a recuperação de senha.' }, { status: 500 })
  }
}
