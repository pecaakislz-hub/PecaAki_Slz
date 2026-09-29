import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const genericMessage = 'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.'
const configurationMessage = 'A recuperação de senha ainda não está disponível. O serviço de e-mail precisa ser configurado pelo administrador.'

type SendResult = { ok: true } | { ok: false; reason: 'missing_config' | 'provider_error' }

async function sendResetEmail(email: string, resetUrl: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.MAIL_FROM?.trim()
  if (!apiKey || !from) return { ok: false, reason: 'missing_config' }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Recuperação de senha — PeçaAki',
        text: `Recebemos uma solicitação para redefinir sua senha no PeçaAki. Acesse: ${resetUrl}\n\nO link expira em 30 minutos. Se você não fez esta solicitação, ignore este e-mail.`,
        html: `<p>Recebemos uma solicitação para redefinir sua senha no PeçaAki.</p><p><a href="${resetUrl}">Criar uma nova senha</a></p><p>O link expira em 30 minutos. Se você não fez esta solicitação, ignore este e-mail.</p>`
      })
    })

    if (response.ok) return { ok: true }
    const providerBody = await response.text().catch(() => '')
    console.error('Resend rejeitou o e-mail de recuperação:', response.status, providerBody.slice(0, 500))
    return { ok: false, reason: 'provider_error' }
  } catch (error) {
    console.error('Falha de comunicação com o Resend:', error)
    return { ok: false, reason: 'provider_error' }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!email) return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })

    const user = await db.findUserByEmail(email)
    if (!user) return NextResponse.json({ success: true, message: genericMessage }, { headers: { 'Cache-Control': 'no-store' } })

    const apiConfigured = Boolean(process.env.RESEND_API_KEY?.trim() && process.env.MAIL_FROM?.trim())
    const localResetEnabled = process.env.NODE_ENV !== 'production' && process.env.ALLOW_LOCAL_RESET_LINK === 'true'
    if (!apiConfigured && !localResetEnabled) {
      return NextResponse.json({ error: configurationMessage }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
    }

    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)
    const forwardedProto = req.headers.get('x-forwarded-proto') || 'https'
    const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || new URL(req.url).host
    const origin = process.env.NEXT_PUBLIC_APP_URL?.trim() || `${forwardedProto}://${forwardedHost}`
    const resetUrl = `${origin.replace(/\/$/, '')}/redefinir-senha?token=${rawToken}`

    const token = await db.createPasswordResetToken(user.id, tokenHash, expiresAt)

    if (apiConfigured) {
      const sent = await sendResetEmail(user.email, resetUrl)
      if (!sent.ok) {
        await db.deletePasswordResetToken(token.id)
        return NextResponse.json({ error: 'Não foi possível enviar o e-mail de recuperação agora. Verifique novamente mais tarde.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
      }
    }

    return NextResponse.json({ success: true, message: genericMessage, ...(localResetEnabled ? { resetUrl } : {}) }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Erro na recuperação de senha:', error)
    return NextResponse.json({ error: 'Não foi possível iniciar a recuperação de senha.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}
