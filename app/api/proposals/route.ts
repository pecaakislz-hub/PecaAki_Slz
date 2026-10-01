import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { action } = body

    if (action === 'ACCEPT') {
      const { proposalId } = body
      if (!proposalId) return NextResponse.json({ error: 'ID da proposta não informado' }, { status: 400 })

      try {
        const result = await db.acceptProposal(proposalId, user.id)
        return NextResponse.json({ success: true, ...result })
      } catch (error: any) {
        if (error?.message === 'NOT_ALLOWED') return NextResponse.json({ error: 'Você só pode aceitar propostas da sua própria cotação.' }, { status: 403 })
        throw error
      }
    }

    if (!['LOJISTA', 'VENDEDOR', 'OFICINA', 'GUINCHO'].includes(user.role) || !user.storeProfile) {
      return NextResponse.json({ error: 'Apenas vendedores, oficinas e guinchos cadastrados podem enviar respostas' }, { status: 403 })
    }

    const { quoteRequestId, availability, condition, cashPrice, installmentPrice, deliveryFee, deliveryTime, notes, photoUrl } = body
    const quote = quoteRequestId ? await db.findQuoteById(quoteRequestId) : null
    if (!quote) return NextResponse.json({ error: 'Cotação não encontrada.' }, { status: 404 })
    if (['ACCEPTED', 'CLOSED'].includes(quote.status)) return NextResponse.json({ error: 'Esta cotação já foi encerrada.' }, { status: 409 })
    if (user.role === 'OFICINA' && quote.category !== 'Oficina') return NextResponse.json({ error: 'A oficina deve responder apenas a atendimentos de oficina.' }, { status: 403 })
    if (user.role === 'GUINCHO' && quote.category !== 'Guincho') return NextResponse.json({ error: 'O guincho deve responder apenas a atendimentos de guincho.' }, { status: 403 })

    if (!quoteRequestId || !cashPrice || !deliveryTime) {
      return NextResponse.json({ error: 'Cotação, valor à vista e tempo de entrega são obrigatórios' }, { status: 400 })
    }

    const proposal = await db.createProposal({
      quoteRequestId,
      storeProfileId: user.storeProfile.id,
      availability: availability || 'IN_STOCK',
      condition: condition || 'NEW',
      cashPrice: parseFloat(cashPrice),
      installmentPrice: installmentPrice ? parseFloat(installmentPrice) : null,
      deliveryFee: deliveryFee ? parseFloat(deliveryFee) : 0,
      deliveryTime,
      notes: notes || null,
      photoUrl: photoUrl || null
    })

    return NextResponse.json({ success: true, proposal })
  } catch (error) {
    console.error('Erro em POST /api/proposals:', error)
    return NextResponse.json({ error: 'Erro ao processar proposta' }, { status: 500 })
  }
}
