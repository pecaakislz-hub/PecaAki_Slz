import { NextResponse } from 'next/server'
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
