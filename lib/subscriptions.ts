import { prisma } from '@/lib/prisma'

export const PLAN_CATALOG = {
  STARTER: { name: 'Starter', monthlyLimit: 5, monthlyPrice: 0, yearlyPrice: 0, verified: false, priority: false },
  PRO: { name: 'Pro', monthlyLimit: 50, monthlyPrice: 50, yearlyPrice: 500, verified: true, priority: false },
  PREMIUM: { name: 'Premium', monthlyLimit: 100, monthlyPrice: 100, yearlyPrice: 1000, verified: true, priority: true },
} as const

export type PlanCode = keyof typeof PLAN_CATALOG

function endOfMonth(from: Date) {
  return new Date(from.getFullYear(), from.getMonth() + 1, 0, 23, 59, 59, 999)
}

export async function ensureStarterSubscription(storeProfileId: string) {
  const now = new Date()
  const subscription = await prisma.storeSubscription.upsert({
    where: { storeProfileId },
    update: {},
    create: {
      storeProfileId,
      plan: 'STARTER',
      billingCycle: 'MONTHLY',
      status: 'ACTIVE',
      monthlyQuoteLimit: PLAN_CATALOG.STARTER.monthlyLimit,
      periodStart: now,
      periodEnd: endOfMonth(now),
    },
  })
  await prisma.creditWallet.upsert({
    where: { storeProfileId },
    update: {},
    create: { storeProfileId, balance: 0 },
  })
  return subscription
}

async function refreshSubscriptionPeriod(subscription: any): Promise<any> {
  const now = new Date()
  if (subscription.periodEnd >= now) return subscription
  const plan = (PLAN_CATALOG[subscription.plan as PlanCode] || PLAN_CATALOG.STARTER)
  return prisma.storeSubscription.update({
    where: { id: subscription.id },
    data: {
      periodStart: now,
      periodEnd: endOfMonth(now),
      monthlyQuoteLimit: plan.monthlyLimit,
      status: subscription.status === 'ACTIVE' ? 'ACTIVE' : subscription.status,
    },
  })
}

export async function getStoreSubscriptionOverview(storeProfileId: string) {
  let subscription = await ensureStarterSubscription(storeProfileId)
  subscription = await refreshSubscriptionPeriod(subscription)
  const wallet = await prisma.creditWallet.findUnique({ where: { storeProfileId } })
  const used = await prisma.proposal.count({
    where: { storeProfileId, createdAt: { gte: subscription.periodStart, lte: new Date() } },
  })
  const available = subscription.monthlyQuoteLimit + subscription.extraCredits
  const plan = (PLAN_CATALOG[subscription.plan as PlanCode] || PLAN_CATALOG.STARTER)
  return {
    subscription,
    wallet: wallet || { balance: 0 },
    plan,
    used,
    limit: subscription.monthlyQuoteLimit,
    extraCredits: subscription.extraCredits,
    available,
    remaining: Math.max(available - used, 0),
  }
}

export async function canStoreRespondQuotation(storeProfileId: string) {
  const overview = await getStoreSubscriptionOverview(storeProfileId)
  if (overview.subscription.status !== 'ACTIVE') {
    return { allowed: false, code: 'SUBSCRIPTION_INACTIVE', message: 'O plano da loja não está ativo.', ...overview }
  }
  if (overview.used >= overview.available) {
    return { allowed: false, code: 'QUOTA_EXCEEDED', message: 'Sua cota de respostas deste período foi atingida. Faça upgrade ou compre créditos extras.', ...overview }
  }
  return { allowed: true, code: 'OK', message: '', ...overview }
}
