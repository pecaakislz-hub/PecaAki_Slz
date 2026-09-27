import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const body = await req.json()
    const rating = Number(body.rating)
    if (!body.purchaseId || !Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: 'Informe o pedido e uma nota de 1 a 5.' }, { status: 400 })
    const review = await db.createReview(user.id, { purchaseId: body.purchaseId, rating, comment: typeof body.comment === 'string' ? body.comment.trim().slice(0, 500) : '' })
    return NextResponse.json({ review }, { status: 201 })
  } catch (error: any) {
    const message = error?.message === 'REVIEW_NOT_ALLOWED' ? 'A avaliação só pode ser feita uma vez após marcar o pedido como entregue.' : 'Não foi possível salvar a avaliação.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
