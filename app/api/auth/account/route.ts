import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const body = await req.json()
    const name = String(body.name || '').trim()
    const phone = String(body.phone || '').trim()
    const city = String(body.city || '').trim()
    const neighborhood = String(body.neighborhood || '').trim()
    const avatarUrl = body.avatarUrl === null || body.avatarUrl === undefined ? null : String(body.avatarUrl)
    if (!name || !phone || !city || !neighborhood) {
      return NextResponse.json({ error: 'Nome, telefone, município e bairro são obrigatórios' }, { status: 400 })
    }
    if (avatarUrl && (!avatarUrl.startsWith('data:image/') || avatarUrl.length > 2_000_000)) {
      return NextResponse.json({ error: 'A imagem do perfil é inválida ou excede o limite permitido.' }, { status: 400 })
    }
    const updated = await db.updateUser(user.id, { name, phone, city, neighborhood, avatarUrl })
    if (!updated) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    const { passwordHash, ...safeUser } = updated
    return NextResponse.json({ success: true, user: safeUser })
  } catch {
    return NextResponse.json({ error: 'Não foi possível atualizar os dados' }, { status: 500 })
  }
}

export async function DELETE() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const deleted = await db.deleteUser(user.id)
  if (!deleted) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  const response = NextResponse.json({ success: true })
  response.cookies.delete('pecaaki_token')
  return response
}
