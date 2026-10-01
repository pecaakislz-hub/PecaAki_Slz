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
    const address = String(body.address || '').trim()
    const postalCode = String(body.postalCode || '').trim()
    const avatarUrl = body.avatarUrl === null || body.avatarUrl === undefined ? null : String(body.avatarUrl)
    const storeProfile = body.storeProfile && typeof body.storeProfile === 'object' ? {
      companyName: String(body.storeProfile.companyName || '').trim(),
      fantasyName: String(body.storeProfile.fantasyName || '').trim(),
      cnpjCpf: String(body.storeProfile.cnpjCpf || '').trim(),
      phone: String(body.storeProfile.phone || '').trim(),
      city: String(body.storeProfile.city || '').trim(),
      neighborhood: String(body.storeProfile.neighborhood || '').trim(),
      address: String(body.storeProfile.address || '').trim(),
      categories: String(body.storeProfile.categories || '[]'),
      vehicleBrands: String(body.storeProfile.vehicleBrands || '[]'),
      serviceScopes: String(body.storeProfile.serviceScopes || '[]'),
      vehicleSizes: String(body.storeProfile.vehicleSizes || '[]'),
      productTypes: String(body.storeProfile.productTypes || '[]'),
      itemConditions: String(body.storeProfile.itemConditions || '[]'),
      contactEmail: String(body.storeProfile.contactEmail || '').trim(),
      socialLinks: String(body.storeProfile.socialLinks || '{}'),
    } : undefined
    if (!name || !phone || !city || !neighborhood) {
      return NextResponse.json({ error: 'Nome, telefone, município e bairro são obrigatórios' }, { status: 400 })
    }
    if (avatarUrl && (!avatarUrl.startsWith('data:image/') || avatarUrl.length > 2_000_000)) {
      return NextResponse.json({ error: 'A imagem do perfil é inválida ou excede o limite permitido.' }, { status: 400 })
    }
    if (storeProfile && (!storeProfile.companyName || !storeProfile.fantasyName || !storeProfile.cnpjCpf || !storeProfile.phone)) {
      return NextResponse.json({ error: 'Preencha os dados comerciais obrigatórios do perfil.' }, { status: 400 })
    }
    const updated = await db.updateUser(user.id, { name, phone, city, neighborhood, address, postalCode, avatarUrl, storeProfile })
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
