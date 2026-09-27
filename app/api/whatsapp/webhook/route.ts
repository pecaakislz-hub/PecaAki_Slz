import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

function isValidSignature(rawBody: string, signature: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET
  if (!secret) return process.env.NODE_ENV !== 'production'
  if (!signature?.startsWith('sha256=')) return false
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`
  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(signature)
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')
  if (mode === 'subscribe' && token && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) return new Response(challenge, { status: 200 })
  return NextResponse.json({ error: 'Webhook não verificado' }, { status: 403 })
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  if (!isValidSignature(rawBody, request.headers.get('x-hub-signature-256'))) return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
  try {
    const payload = JSON.parse(rawBody)
    if (payload.object !== 'whatsapp_business_account') return NextResponse.json({ received: true })
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== 'messages') continue
        const value = change.value || {}
        const toPhone = value.metadata?.display_phone_number || null
        for (const message of value.messages || []) {
          await db.ingestWhatsAppMessage({
            externalId: message.id,
            fromPhone: message.from,
            toPhone,
            messageType: message.type || 'unknown',
            body: message.type === 'text' ? message.text?.body || null : `[${message.type || 'mensagem'}]`
          })
        }
      }
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro no webhook WhatsApp:', error)
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }
}
