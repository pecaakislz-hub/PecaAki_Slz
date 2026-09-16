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

      const proposal = await db.acceptProposal(proposalId)
      return NextResponse.json({ success: true, proposal })
    }

    if (user.role !== 'LOJISTA' || !user.storeProfile) {
      return NextResponse.json({ error: 'Apenas lojistas cadastrados podem enviar orçamentos' }, { status: 403 })
    }

    const { quoteRequestId, availability, condition, cashPrice, installmentPrice, deliveryFee, deliveryTime, notes, photoUrl } = body

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
