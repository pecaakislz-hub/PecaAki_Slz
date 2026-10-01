import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const quote = await db.findQuoteById(params.id)

    if (!quote) {
      return NextResponse.json({ error: 'Cotação não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ quote })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar detalhes da cotação' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    await db.deleteQuote(params.id, user.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.message === 'NOT_ALLOWED') return NextResponse.json({ error: 'Você só pode excluir suas próprias cotações.' }, { status: 403 })
    if (error?.message === 'QUOTE_CLOSED') return NextResponse.json({ error: 'Esta cotação já foi encerrada e não pode ser excluída.' }, { status: 409 })
    return NextResponse.json({ error: 'Não foi possível excluir a cotação.' }, { status: 500 })
  }
}
