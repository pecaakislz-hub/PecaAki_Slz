import { prisma } from '@/lib/prisma'

const isPrismaConfigured = () => Boolean(process.env.DATABASE_URL)

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
      planTier: 'STARTER',
      billingCycle: 'MONTHLY',
      status: 'ACTIVE',
      monthlyQuota: PLAN_CATALOG.STARTER.monthlyLimit,
      quotaUsed: 0,
      extraCredits: 0,
      currentPeriodStart: now,
      currentPeriodEnd: endOfMonth(now),
    },
  })
  return subscription
}

async function refreshSubscriptionPeriod(subscription: any): Promise<any> {
  const now = new Date()
  if (!subscription.currentPeriodEnd || subscription.currentPeriodEnd >= now) return subscription
  const plan = (PLAN_CATALOG[subscription.planTier as PlanCode] || PLAN_CATALOG.STARTER)
  return prisma.storeSubscription.update({
      where: { id: subscription.id },
    data: {
      currentPeriodStart: now,
      currentPeriodEnd: endOfMonth(now),
      monthlyQuota: plan.monthlyLimit,
      quotaUsed: 0,
      status: subscription.status === 'ACTIVE' ? 'ACTIVE' : subscription.status,
    },
  })
}

export async function getStoreSubscriptionOverview(storeProfileId: string) {
  let subscription = await ensureStarterSubscription(storeProfileId)
  subscription = await refreshSubscriptionPeriod(subscription)
  const used = subscription.quotaUsed
  const available = subscription.monthlyQuota + subscription.extraCredits
  const plan = (PLAN_CATALOG[subscription.planTier as PlanCode] || PLAN_CATALOG.STARTER)
  return {
    subscription,
    wallet: { balance: subscription.extraCredits },
    plan,
    used,
    limit: subscription.monthlyQuota,
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
  const monthlyRemaining = Math.max(overview.limit - overview.subscription.quotaUsed, 0)
  if (monthlyRemaining > 0) return { ...overview, allowed: true, sourceType: 'MONTHLY_QUOTA' as const, remaining: monthlyRemaining, code: 'OK', message: '' }
  if (overview.extraCredits > 0) return { ...overview, allowed: true, sourceType: 'EXTRA_CREDITS' as const, remaining: overview.extraCredits, code: 'OK', message: '' }
  const isStarter = overview.subscription.planTier === 'STARTER'
  return {
    ...overview,
    allowed: false,
    sourceType: 'NONE' as const,
    remaining: 0,
    code: isStarter ? 'STARTER_LIMIT_REACHED' : 'EXTRA_CREDITS_REQUIRED',
    message: isStarter ? 'Você atingiu o limite gratuito de 5 cotações este mês. Faça upgrade para o Plano Pro para continuar enviando orçamentos!' : 'Sua cota mensal acabou. Adicione um pacote de créditos extras por R$ 2,50 por cotação para não perder vendas.',
  }
}

export async function consumeQuotationCredit(storeProfileId: string) {
  if (!isPrismaConfigured()) return { consumed: true, sourceType: 'MONTHLY_QUOTA' as const }
  const subscription = await ensureStarterSubscription(storeProfileId)
  const monthly = await prisma.storeSubscription.updateMany({
    where: { id: subscription.id, status: 'ACTIVE', quotaUsed: { lt: subscription.monthlyQuota } },
    data: { quotaUsed: { increment: 1 } },
  })
  if (monthly.count === 1) return { consumed: true, sourceType: 'MONTHLY_QUOTA' as const }
  const extra = await prisma.storeSubscription.updateMany({
    where: { id: subscription.id, status: 'ACTIVE', quotaUsed: { gte: subscription.monthlyQuota }, extraCredits: { gt: 0 } },
    data: { extraCredits: { decrement: 1 } },
  })
  if (extra.count === 1) return { consumed: true, sourceType: 'EXTRA_CREDITS' as const }
  return { consumed: false, sourceType: 'NONE' as const }
}
