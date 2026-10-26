import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { ensureStarterSubscription, PLAN_CATALOG, type PlanCode } from '@/lib/subscriptions'
import { prisma } from '@/lib/prisma'

const endOfMonth = (from: Date) => new Date(from.getFullYear(), from.getMonth() + 1, 0, 23, 59, 59, 999)

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 })
    if (!['LOJISTA', 'VENDEDOR'].includes(user.role) || !user.storeProfile) {
      return NextResponse.json({ error: 'Apenas lojistas podem contratar planos.' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const plan = String(body.plan || '').toUpperCase() as PlanCode
    const billingCycle = body.billingCycle === 'ANNUALLY' ? 'ANNUALLY' : 'MONTHLY'
    const paymentMethod = body.paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : 'PIX'
    const simulateApproval = body.simulateApproval === true

    if (!['PRO', 'PREMIUM'].includes(plan)) {
      return NextResponse.json({ error: 'Selecione um plano pago válido.' }, { status: 400 })
    }

    const storeProfileId = user.storeProfile.id
    const subscription = await ensureStarterSubscription(storeProfileId)
    const catalog = PLAN_CATALOG[plan]
    const amount = billingCycle === 'ANNUALLY' ? catalog.yearlyPrice : catalog.monthlyPrice
    const now = new Date()

    const result = await prisma.$transaction(async (transaction) => {
      const purchase = await transaction.creditPurchase.create({
        data: {
          storeProfileId,
          subscriptionId: subscription.id,
          planTier: plan,
          billingCycle,
          isExtraCredits: false,
          quantity: 1,
          amount,
          status: 'PENDING',
          paymentMethod,
        },
      })

      if (!simulateApproval) return { purchase, approved: false }

      const updatedSubscription = await transaction.storeSubscription.update({
        where: { id: subscription.id },
        data: {
          planTier: plan,
          billingCycle,
          status: 'ACTIVE',
          monthlyQuota: catalog.monthlyLimit,
          quotaUsed: 0,
          currentPeriodStart: now,
          currentPeriodEnd: endOfMonth(now),
        },
      })
      const approvedPurchase = await transaction.creditPurchase.update({
        where: { id: purchase.id },
        data: { status: 'PAID' },
      })
      return { purchase: approvedPurchase, updatedSubscription, approved: true }
    })

    return NextResponse.json({
      success: true,
      status: result.approved ? 'PAID_TEST' : 'PAYMENT_PENDING',
      purchaseId: result.purchase.id,
      plan,
      billingCycle,
      paymentMethod,
      amount,
      message: result.approved
        ? `Assinatura ${catalog.name} ativada em modo de teste. O limite agora é de ${catalog.monthlyLimit} cotações por mês.`
        : 'Intenção de contratação registrada como pendente. O plano será ativado após confirmação do gateway.',
    })
  } catch (error) {
    console.error('Erro no checkout de assinatura:', error)
    return NextResponse.json({ error: 'Não foi possível registrar a contratação agora.' }, { status: 500 })
  }
}
