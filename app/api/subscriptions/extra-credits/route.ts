import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ALLOWED_QUANTITIES = [10, 20, 50]
const UNIT_PRICE = 2.5

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 })
    if (!['LOJISTA', 'VENDEDOR'].includes(user.role) || !user.storeProfile) return NextResponse.json({ error: 'Apenas lojistas podem comprar créditos extras.' }, { status: 403 })
    const body = await req.json().catch(() => ({}))
    const quantity = Number(body.quantity)
    const paymentMethod = body.paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'PIX'
    const simulateApproval = body.simulateApproval === true
    if (!ALLOWED_QUANTITIES.includes(quantity)) return NextResponse.json({ error: 'Escolha um pacote de 10, 20 ou 50 créditos.' }, { status: 400 })

    const subscription = await prisma.storeSubscription.findUnique({ where: { storeProfileId: user.storeProfile.id } })
    if (!subscription || !['PRO', 'PREMIUM'].includes(subscription.planTier)) return NextResponse.json({ error: 'Créditos extras estão disponíveis para os planos Pro e Premium.' }, { status: 403 })
    const amount = quantity * UNIT_PRICE
    const result = await prisma.$transaction(async (transaction) => {
      const purchase = await transaction.creditPurchase.create({
        data: { storeProfileId: user.storeProfile!.id, subscriptionId: subscription.id, planTier: subscription.planTier, billingCycle: subscription.billingCycle, isExtraCredits: true, quantity, amount, paymentMethod, status: simulateApproval ? 'PAID' : 'PENDING' },
      })
      if (!simulateApproval) return { purchase, approved: false }
      const updated = await transaction.storeSubscription.update({ where: { id: subscription.id }, data: { extraCredits: { increment: quantity } } })
      return { purchase, updated, approved: true }
    })
    return NextResponse.json({ success: true, status: result.approved ? 'PAID_TEST' : 'PAYMENT_PENDING', purchaseId: result.purchase.id, quantity, amount, message: result.approved ? `${quantity} créditos extras liberados em modo de teste.` : 'Pedido de créditos registrado como pendente.' })
  } catch (error) {
    console.error('Erro na compra de créditos extras:', error)
    return NextResponse.json({ error: 'Não foi possível registrar a compra de créditos.' }, { status: 500 })
  }
}
