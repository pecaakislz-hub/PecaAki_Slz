import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { status } = await req.json()
    const purchase = await db.updatePurchaseStatus(params.id, user.id, status)
    return NextResponse.json({ purchase })
  } catch (error: any) {
    const message = error?.message === 'NOT_ALLOWED' ? 'Pedido não encontrado ou não pertence a esta conta.' : error?.message === 'INVALID_STATUS' ? 'Status de pedido inválido.' : 'Não foi possível atualizar o pedido.'
    return NextResponse.json({ error: message }, { status: error?.message === 'NOT_ALLOWED' ? 403 : 400 })
  }
}
