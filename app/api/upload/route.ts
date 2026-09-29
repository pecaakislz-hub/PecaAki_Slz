import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'node:crypto'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function safeExtension(contentType: string, name = '') {
  const fromName = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, '')
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(fromName)) return fromName === '.jpeg' ? '.jpg' : fromName
  const extensions: Record<string, string> = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }
  return extensions[contentType] || '.jpg'
}

async function fromRemoteUrl(sourceUrl: string) {
  let parsed: URL
  try { parsed = new URL(sourceUrl) } catch { throw new Error('Informe uma URL válida.') }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('A URL deve começar com http:// ou https://.')
  const response = await fetch(parsed, { redirect: 'follow', signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error('Não foi possível baixar a imagem da internet.')
  const contentType = response.headers.get('content-type')?.split(';')[0] || ''
  if (!contentType.startsWith('image/')) throw new Error('O endereço informado não aponta para uma imagem.')
  const bytes = Buffer.from(await response.arrayBuffer())
  return { bytes, contentType, name: parsed.pathname }
}

export async function POST(req: Request) {
  try {
    let buffer: Buffer
    let contentType = ''
    let originalName = ''
    const requestType = req.headers.get('content-type') || ''
    if (requestType.includes('application/json')) {
      const body = await req.json()
      if (!body.sourceUrl) return NextResponse.json({ error: 'Informe um endereço de imagem.' }, { status: 400 })
      const remote = await fromRemoteUrl(String(body.sourceUrl))
      buffer = remote.bytes
      contentType = remote.contentType
      originalName = remote.name
      if (buffer.byteLength > 8 * 1024 * 1024) return NextResponse.json({ error: 'A imagem deve ter no máximo 8 MB.' }, { status: 413 })
      return NextResponse.json({ success: true, dataUrl: `data:${contentType};base64,${buffer.toString('base64')}` })
    } else {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
      contentType = file.type
      originalName = file.name
      buffer = Buffer.from(await file.arrayBuffer())
    }

    if (!contentType.startsWith('image/')) return NextResponse.json({ error: 'Envie apenas imagens.' }, { status: 400 })
    if (buffer.byteLength > 8 * 1024 * 1024) return NextResponse.json({ error: 'A imagem deve ter no máximo 8 MB.' }, { status: 413 })

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const filename = `${Date.now()}_${crypto.randomUUID()}${safeExtension(contentType, originalName)}`
    await writeFile(path.join(uploadDir, filename), buffer)
    return NextResponse.json({ success: true, url: `/uploads/${filename}` })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao fazer upload da imagem' }, { status: 500 })
  }
}
