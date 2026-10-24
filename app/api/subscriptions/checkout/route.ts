import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getStoreSubscriptionOverview, PLAN_CATALOG, type PlanCode } from '@/lib/subscriptions'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 })
  if (!['LOJISTA', 'VENDEDOR'].includes(user.role) || !user.storeProfile) {
    return NextResponse.json({ error: 'Apenas lojistas podem contratar planos.' }, { status: 403 })
  }
  const body = await req.json().catch(() => ({}))
  const plan = String(body.plan || '').toUpperCase() as PlanCode
  const billingCycle = body.billingCycle === 'YEARLY' ? 'YEARLY' : 'MONTHLY'
  if (!['PRO', 'PREMIUM'].includes(plan)) {
    return NextResponse.json({ error: 'Selecione um plano pago válido.' }, { status: 400 })
  }
  const catalog = PLAN_CATALOG[plan]
  const amount = billingCycle === 'YEARLY' ? catalog.yearlyPrice : catalog.monthlyPrice
  await getStoreSubscriptionOverview(user.storeProfile.id)
  return NextResponse.json({
    success: true,
    status: 'PAYMENT_PENDING',
    plan,
    billingCycle,
    amount,
    message: 'A confirmação de pagamento será conectada ao webhook do provedor escolhido. O plano atual permanece ativo até a confirmação.',
  })
}
